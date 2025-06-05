
// Add this declaration at the top of the file
declare var process: {
  env: {
    API_KEY?: string;
    [key: string]: string | undefined;
  };
};

import { GoogleGenAI, GenerateContentResponse as SDKGenerateContentResponse, Content } from "@google/genai";
import { 
  MyraConfig, ChatMessage, 
  GeminiGenerateContentResponse, GeminiCandidate, GeminiSafetyRating,
  LMStudioChatMessage, LMStudioResponse, ResolvedSpeakerPersonaConfig, AIProviderConfig
} from '../types';

const getGenAIInstance = (): GoogleGenAI | null => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) { 
    console.warn("Gemini API Key (process.env.API_KEY) is not configured. Gemini provider will not work.");
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    return null;
  }
};

const transformGeminiSDKResponse = (sdkResponse: SDKGenerateContentResponse): GeminiGenerateContentResponse => {
  return {
    text: sdkResponse.text, 
    candidates: sdkResponse.candidates as GeminiCandidate[] | undefined, 
    promptFeedback: sdkResponse.promptFeedback as { blockReason?: string; safetyRatings?: GeminiSafetyRating[]; } | undefined,
  };
};

const callLmStudioApi = async (
  prompt: string,
  globalMyraConfig: MyraConfig, 
  speakerAIConfig: AIProviderConfig, 
  history: ChatMessage[], // This history should NOT contain the current prompt's message
  baseSystemInstruction: string, 
  speakerPersonaConfig: ResolvedSpeakerPersonaConfig | undefined,
  t: (key: string, substitutions?: Record<string, string>) => string
): Promise<GeminiGenerateContentResponse> => {
  
  const effectiveSpeakerName = speakerPersonaConfig?.name || globalMyraConfig.myraName;
  const effectiveRoleDescription = speakerPersonaConfig?.roleDescription || globalMyraConfig.myraRoleDescription;
  const effectiveEthics = speakerPersonaConfig?.ethicsPrinciples || globalMyraConfig.myraEthicsPrinciples;
  const effectiveResponseInstruction = speakerPersonaConfig?.responseInstruction || globalMyraConfig.myraResponseInstruction;

  let fullSystemInstruction = `${effectiveRoleDescription}\n\n${t('aiService.corePrinciplesLabel')}:\n${effectiveEthics}\n\n`;
  fullSystemInstruction += `${t('aiService.currentInternalContextLabel', { speakerName: effectiveSpeakerName })}:\n${baseSystemInstruction}\n`;
  fullSystemInstruction += `\n${t('aiService.responseInstructionLabel', { speakerName: effectiveSpeakerName })}:\n${effectiveResponseInstruction}`;

  const messages: LMStudioChatMessage[] = [{ role: 'system', content: fullSystemInstruction }];
  
  // Add history messages
  history.slice(-globalMyraConfig.maxHistoryMessagesForPrompt * 2).forEach(msg => {
    const role = msg.speakerName === effectiveSpeakerName ? 'assistant' : 'user';
    const finalRole = msg.speakerName ? role : (msg.role === 'user' ? 'user' : 'assistant');
    // For LM Studio, models often expect the prompt to be prefixed if it's conversational after a system prompt.
    // Using the speakerName or a generic "User" label.
    const prefix = msg.speakerName || (msg.role === 'user' ? globalMyraConfig.userName : t('aiService.systemLabel'));
    messages.push({ role: finalRole, content: `${prefix}: ${msg.content}` });
  });

  // Add the current prompt from the perspective of the last speaker in history, or the user if history is empty.
  const lastSpeakerInHistory = history.length > 0 
    ? (history[history.length - 1].speakerName || (history[history.length - 1].role === 'user' ? globalMyraConfig.userName : t('aiService.systemLabel'))) 
    : globalMyraConfig.userName;
  messages.push({ role: 'user', content: `${lastSpeakerInHistory}: ${prompt}` }); 
  // Note: Some LM Studio models might prefer the last prompt to not have a prefix if it's directly from the "user" role.
  // This might need adjustment based on the specific model's chat template.
  // For now, this maintains consistency with the previous approach.

  const payload = {
    model: speakerAIConfig.lmStudioGenerationModel,
    messages: messages,
    temperature: speakerAIConfig.temperatureBase, 
  };

  try {
    const response = await fetch(`${speakerAIConfig.lmStudioBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`LM Studio API Error: ${response.status} ${response.statusText}`, errorBody);
      return { text: t('aiService.error.lmStudioRequestFailed', { status: String(response.status), errorBody }) };
    }

    const lmStudioData: LMStudioResponse = await response.json();
    if (lmStudioData.choices && lmStudioData.choices.length > 0 && lmStudioData.choices[0].message) {
      return { text: lmStudioData.choices[0].message.content.trim() };
    }
    console.error("LM Studio response format unexpected:", lmStudioData);
    return { text: t('aiService.error.lmStudioUnexpectedFormat') };

  } catch (error: any) {
    console.error("Error calling LM Studio API:", error);
    let errorMessage = t('aiService.error.lmStudioGenerationError', { speakerName: effectiveSpeakerName });
    if (error.message) errorMessage += ` ${t('aiService.error.details', { message: error.message })}`;
    if (error.message?.includes("fetch") || error.message?.includes("NetworkError")) {
      errorMessage = t('aiService.error.lmStudioNetworkError', { speakerName: effectiveSpeakerName, baseUrl: speakerAIConfig.lmStudioBaseUrl });
    }
    return { text: errorMessage };
  }
};

export const callAiApi = async (
  prompt: string, // The content of the current message to respond to
  globalMyraConfig: MyraConfig, 
  speakerAIConfig: AIProviderConfig, 
  history: ChatMessage[], // All prior messages, NOT including the current prompt's message
  baseSystemInstruction: string, 
  speakerPersonaConfig: ResolvedSpeakerPersonaConfig | undefined,
  t: (key: string, substitutions?: Record<string, string>) => string
): Promise<GeminiGenerateContentResponse> => {
  if (speakerAIConfig.aiProvider === 'lmstudio') {
    return callLmStudioApi(prompt, globalMyraConfig, speakerAIConfig, history, baseSystemInstruction, speakerPersonaConfig, t);
  }

  const ai = getGenAIInstance();
  if (!ai) {
    return { text: t('aiService.error.geminiNotInitialized') };
  }
  
  const modelName = speakerAIConfig.geminiModelName;
  const contents: Content[] = [];

  const effectiveSpeakerName = speakerPersonaConfig?.name || globalMyraConfig.myraName;
  const effectiveRoleDescription = speakerPersonaConfig?.roleDescription || globalMyraConfig.myraRoleDescription;
  const effectiveEthics = speakerPersonaConfig?.ethicsPrinciples || globalMyraConfig.myraEthicsPrinciples;
  const effectiveResponseInstruction = speakerPersonaConfig?.responseInstruction || globalMyraConfig.myraResponseInstruction;

  let fullSystemInstruction = `${effectiveRoleDescription}\n\n${t('aiService.corePrinciplesLabel')}:\n${effectiveEthics}\n\n`;
  fullSystemInstruction += `${t('aiService.currentInternalContextLabel', { speakerName: effectiveSpeakerName })}:\n${baseSystemInstruction}\n`;
  fullSystemInstruction += `\n${t('aiService.responseInstructionLabel', { speakerName: effectiveSpeakerName })}:\n${effectiveResponseInstruction}`;
  
  // Convert chat history to Gemini's format
  // The `history` parameter contains messages *before* the current `prompt`.
  history.slice(-globalMyraConfig.maxHistoryMessagesForPrompt * 2).forEach(chatMsg => {
    // If chatMsg.speakerName is the current AI (effectiveSpeakerName), its role was 'model'.
    // Otherwise, it was from the 'user' (either actual user or the other AI).
    const geminiRole = chatMsg.speakerName === effectiveSpeakerName ? 'model' : 'user';
    contents.push({ role: geminiRole, parts: [{ text: chatMsg.content }] });
  });

  // Add the current prompt as a new user message for the AI to respond to.
  contents.push({ role: 'user', parts: [{ text: prompt }] });

  try {
    const response: SDKGenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: contents, 
      config: { 
        temperature: speakerAIConfig.temperatureBase, 
        systemInstruction: fullSystemInstruction, 
      },
    });
    return transformGeminiSDKResponse(response);

  } catch (error: any) {
    console.error(`Error calling Gemini API for ${effectiveSpeakerName}:`, error);
    let errorMessage = t('aiService.error.geminiGenerationError', { speakerName: effectiveSpeakerName });
    if (error.message) errorMessage += ` ${t('aiService.error.details', { message: error.message })}`;
    if (error.toString().includes("API key not valid")) errorMessage = t('aiService.error.geminiApiKeyInvalid');
    else if (error.toString().includes("quota")) errorMessage = t('aiService.error.geminiQuotaExceeded');
    else if (error.message?.includes("fetch") || error.message?.includes("NetworkError")) errorMessage = t('aiService.error.geminiNetworkError');
    return { text: errorMessage };
  }
};

import { GoogleGenAI, GenerateContentResponse as SDKGenerateContentResponse, Content } from "@google/genai";
import { 
  MyraConfig, ChatMessage, 
  GeminiGenerateContentResponse, GeminiCandidate, GeminiSafetyRating,
  LMStudioChatMessage, LMStudioResponse
} from '../types';
import { INITIAL_CONFIG, API_KEY_FOR_GEMINI } from '../constants'; // API_KEY_FOR_GEMINI uses process.env.API_KEY

const getGenAIInstance = (): GoogleGenAI | null => {
  // API_KEY_FOR_GEMINI is process.env.API_KEY from constants.ts
  if (!API_KEY_FOR_GEMINI) { 
    console.warn("Gemini API Key (process.env.API_KEY) is not configured. Gemini provider will not work.");
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey: API_KEY_FOR_GEMINI });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    return null;
  }
};

const transformGeminiSDKResponse = (sdkResponse: SDKGenerateContentResponse): GeminiGenerateContentResponse => {
  return {
    text: sdkResponse.text, // Direct access as per new guidelines
    candidates: sdkResponse.candidates as GeminiCandidate[] | undefined, // Cast based on your defined types
    promptFeedback: sdkResponse.promptFeedback as { blockReason?: string; safetyRatings?: GeminiSafetyRating[]; } | undefined, // Cast
  };
};

const callLmStudioApi = async (
  prompt: string,
  config: MyraConfig,
  history: ChatMessage[],
  systemInstruction: string
): Promise<GeminiGenerateContentResponse> => {
  const messages: LMStudioChatMessage[] = [{ role: 'system', content: systemInstruction }];
  history.slice(-config.maxHistoryMessagesForPrompt * 2).forEach(msg => {
    if (msg.role === 'user') {
      messages.push({ role: 'user', content: msg.content });
    } else if (msg.role === 'assistant') {
      messages.push({ role: 'assistant', content: msg.content });
    }
  });
  messages.push({ role: 'user', content: prompt });

  const payload = {
    model: config.lmStudioGenerationModel,
    messages: messages,
    temperature: config.temperatureBase,
  };

  try {
    const response = await fetch(`${config.lmStudioBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`LM Studio API Error: ${response.status} ${response.statusText}`, errorBody);
      return { text: `Error: LM Studio API request failed (${response.status}). ${errorBody}` };
    }

    const lmStudioData: LMStudioResponse = await response.json();
    if (lmStudioData.choices && lmStudioData.choices.length > 0 && lmStudioData.choices[0].message) {
      return { text: lmStudioData.choices[0].message.content.trim() };
    }
    console.error("LM Studio response format unexpected:", lmStudioData);
    return { text: "Error: Unexpected response format from LM Studio." };

  } catch (error: any) {
    console.error("Error calling LM Studio API:", error);
    let errorMessage = "Error generating response from M.Y.R.A (LM Studio).";
    if (error.message) {
      errorMessage += ` Details: ${error.message}`;
    }
     if (error.message?.includes("fetch") || error.message?.includes("NetworkError")) {
      errorMessage = "Network error connecting to LM Studio. Is it running and accessible?";
    }
    return { text: errorMessage };
  }
};

export const callAiApi = async (
  prompt: string,
  config: MyraConfig,
  history: ChatMessage[],
  systemInstruction: string
): Promise<GeminiGenerateContentResponse> => {
  if (config.aiProvider === 'lmstudio') {
    return callLmStudioApi(prompt, config, history, systemInstruction);
  }

  // Default to Gemini
  const ai = getGenAIInstance();
  if (!ai) {
    return { text: "Error: Gemini API client not initialized. Check API Key." };
  }
  
  const modelName = config.geminiModelName || INITIAL_CONFIG.geminiModelName;
  const contents: Content[] = [];

  // Add system instruction at the beginning if it's not part of the config object for generateContent
  // For Gemini, systemInstruction is part of the config object in generateContent call.
  // Let's build history for Gemini `contents` format
  
  history.slice(-config.maxHistoryMessagesForPrompt * 2).forEach(msg => {
    if (msg.role === 'user') {
      contents.push({ role: 'user', parts: [{ text: msg.content }] });
    } else if (msg.role === 'assistant') { // Gemini uses 'model' for assistant role
      contents.push({ role: 'model', parts: [{ text: msg.content }] });
    }
  });
  // Add the current user prompt
  contents.push({ role: 'user', parts: [{ text: prompt }] });

  try {
    // Using ai.models.generateContent directly
    const response: SDKGenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: contents, // Pass the constructed history and prompt
      config: { 
        temperature: config.temperatureBase,
        systemInstruction: systemInstruction, // System instruction passed here
        // topK, topP, etc. can be added here if needed from MyraConfig
      },
    });
    return transformGeminiSDKResponse(response);

  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    let errorMessage = "Error generating response from M.Y.R.A (Gemini).";
    if (error.message) {
      errorMessage += ` Details: ${error.message}`;
    }
    if (error.toString().includes("API key not valid")) {
      errorMessage = "API Key not valid for Gemini. Please check your configuration.";
    } else if (error.toString().includes("quota")) {
      errorMessage = "Gemini API quota exceeded. Please check your Gemini account.";
    } else if (error.message?.includes("fetch") || error.message?.includes("NetworkError")) {
      errorMessage = "Network error connecting to Gemini API. Please check your internet connection.";
    }
    return { text: errorMessage };
  }
};

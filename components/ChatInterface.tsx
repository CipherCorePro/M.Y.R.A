
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MyraConfig } from '../types';
import { PaperAirplaneIcon, UserCircleIcon, SparklesIcon, MicrophoneIcon, SpeakerWaveIcon } from './IconComponents';

// Add these declarations if not found globally
interface SpeechRecognition extends EventTarget {
    grammars: SpeechGrammarList;
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    abort(): void;
    start(): void;
    stop(): void;
}

interface SpeechGrammarList {
    readonly length: number;
    item(index: number): SpeechGrammar;
    addFromString(string: string, weight?: number): void;
    addFromURI(src: string, weight?: number): void;
    [index: number]: SpeechGrammar;
}

interface SpeechGrammar {
    src: string;
    weight: number;
}

interface SpeechRecognitionEventMap {
    "audiostart": Event;
    "audioend": Event;
    "end": Event;
    "error": SpeechRecognitionErrorEvent;
    "nomatch": SpeechRecognitionEvent;
    "result": SpeechRecognitionEvent;
    "soundstart": Event;
    "soundend": Event;
    "speechstart": Event;
    "speechend": Event;
    "start": Event;
}

interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
    readonly interpretation?: any; // This property is non-standard
    readonly emma?: Document | null; // This property is non-standard
}

interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}

type SpeechRecognitionErrorCode =
    | "no-speech" | "aborted" | "audio-capture" | "network"
    | "not-allowed" | "service-not-allowed" | "bad-grammar" | "language-not-supported";

interface SpeechRecognitionErrorEvent extends Event { 
    readonly error: SpeechRecognitionErrorCode;
    readonly message: string;
}

declare var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
};


interface ChatInterfaceProps {
  chatHistory: ChatMessage[];
  onSendMessage: (prompt: string) => Promise<void>;
  isLoading: boolean;
  myraConfig: MyraConfig;
  t: (key: string, substitutions?: Record<string, string>) => string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatHistory, onSendMessage, isLoading, myraConfig, t }) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [currentSpokenMessageId, setCurrentSpokenMessageId] = useState<string | null>(null);
  
  const isListeningRef = useRef(isListening);
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  const activeAgentName = myraConfig.activeChatAgent === 'caelum' ? myraConfig.caelumName : myraConfig.myraName;
  const activeAgentIcon = myraConfig.activeChatAgent === 'caelum' 
    ? <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-caelum-primary" /> 
    : <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-myra-primary" />;


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatHistory]);

  // Speech Recognition (STT) Setup
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn("Speech Recognition API not supported in this browser.");
      // Set error state if button is ever enabled somehow
      if (!speechRecognitionRef.current) {
         setSpeechError(t('chatInterface.button.speechNotSupported'));
      }
      return;
    }
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
        console.warn("Speech Recognition API constructor not found.");
        if (!speechRecognitionRef.current) {
           setSpeechError(t('chatInterface.button.speechNotSupported'));
        }
        return;
    }

    const recognition: SpeechRecognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    // recognition.lang is set before start()

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInputPrompt(prev => prev + (finalTranscript.length > 0 ? (prev.length > 0 && !prev.endsWith(' ') ? ' ' : '') + finalTranscript : ''));
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error, event.message);
      setSpeechError(t('chatInterface.input.speechError') + ` (Error: ${event.error})`);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setSpeechError(t('chatInterface.button.speechPermissionDenied'));
      }
      setIsListening(false);
    };
    
    recognition.onend = () => {
      // If isListening is still true, it means it wasn't a manual stop via the button
      // This can happen if the service disconnects or times out.
      if(isListeningRef.current) {
          console.log("Speech recognition ended unexpectedly.");
          setIsListening(false);
      }
    };

    speechRecognitionRef.current = recognition;

    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, [t]); // t is stable

  const toggleListening = () => {
    console.log("toggleListening called. isListeningRef.current:", isListeningRef.current, "Ref exists:", !!speechRecognitionRef.current);
    if (!speechRecognitionRef.current) {
      console.warn("Speech recognition not initialized or not supported.");
      setSpeechError(t('chatInterface.button.speechNotSupported'));
      return;
    }

    if (isListeningRef.current) {
      console.log("Stopping speech recognition.");
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      console.log("Attempting to start speech recognition.");
      setSpeechError(null);
      
      navigator.permissions.query({ name: 'microphone' as PermissionName }).then(permissionStatus => {
        console.log("Microphone permission status:", permissionStatus.state);
        const startRecognition = () => {
          if (speechRecognitionRef.current) {
            console.log("Calling recognition.start() with lang:", myraConfig.language);
            speechRecognitionRef.current.lang = myraConfig.language;
            speechRecognitionRef.current.start();
            setIsListening(true);
          } else {
             console.error("speechRecognitionRef.current is null before startRecognition call");
          }
        };

        if (permissionStatus.state === 'granted') {
          startRecognition();
        } else if (permissionStatus.state === 'prompt') {
          console.log("Requesting microphone permission via getUserMedia.");
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => {
              console.log("getUserMedia success, starting recognition.");
              startRecognition();
            })
            .catch(err => {
              console.error("Microphone access denied or error:", err);
              setSpeechError(t('chatInterface.button.speechPermissionDenied'));
              setIsListening(false);
            });
        } else if (permissionStatus.state === 'denied') {
          console.error("Microphone permission was explicitly denied.");
          setSpeechError(t('chatInterface.button.speechPermissionDenied'));
          setIsListening(false);
        }
        
        permissionStatus.onchange = () => {
          console.log("Microphone permission status changed to:", permissionStatus.state);
          if (permissionStatus.state !== 'granted' && isListeningRef.current) {
            speechRecognitionRef.current?.stop();
            setIsListening(false);
            setSpeechError(t('chatInterface.button.speechPermissionDenied'));
          }
        };
      }).catch(err => {
          console.warn("Could not query microphone permission, trying getUserMedia directly:", err);
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => {
              if (speechRecognitionRef.current) {
                console.log("getUserMedia success (fallback), starting recognition with lang:", myraConfig.language);
                speechRecognitionRef.current.lang = myraConfig.language;
                speechRecognitionRef.current.start();
                setIsListening(true);
              }
            })
            .catch(getUserMediaError => {
              console.error("Microphone access denied or error (fallback):", getUserMediaError);
              setSpeechError(t('chatInterface.button.speechPermissionDenied'));
              setIsListening(false);
            });
      });
    }
  };
  
  const handleSpeakMessage = (messageId: string, text: string) => {
    // ... (TTS logic as before) ...
    if (!('speechSynthesis' in window)) {
      console.warn("Speech Synthesis API not supported.");
      return;
    }
    if (currentSpokenMessageId === messageId) { 
      window.speechSynthesis.cancel();
      setCurrentSpokenMessageId(null);
      return;
    }
    window.speechSynthesis.cancel(); 

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = myraConfig.language;
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.lang.startsWith(myraConfig.language));
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.onstart = () => setCurrentSpokenMessageId(messageId);
    utterance.onend = () => setCurrentSpokenMessageId(null);
    utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setCurrentSpokenMessageId(null);
    };
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);


  const handleSend = () => {
    if (inputPrompt.trim() && !isLoading) {
      onSendMessage(inputPrompt.trim());
      setInputPrompt('');
      if(isListeningRef.current && speechRecognitionRef.current) { 
        speechRecognitionRef.current.stop();
        setIsListening(false);
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800/30 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700">
      <div className="flex-1 p-3 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto fancy-scrollbar chat-background-image">
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] sm:max-w-3/4 p-2 sm:p-3 rounded-xl shadow-md relative group ${
                msg.role === 'user' 
                  ? 'bg-purple-600 text-white rounded-br-none' 
                  : (msg.speakerName === myraConfig.caelumName ? 'bg-sky-700 text-gray-100 rounded-bl-none' : 'bg-gray-700 text-gray-200 rounded-bl-none')
              }`}
            >
              <div className="flex items-center mb-1">
                {msg.role === 'user' ? (
                  <UserCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-purple-300" />
                ) : (
                  msg.speakerName === myraConfig.caelumName 
                    ? <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-caelum-primary" />
                    : <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-myra-primary" />
                )}
                <span className="font-semibold text-xs sm:text-sm">
                  {msg.speakerName || (msg.role === 'user' ? myraConfig.userName : activeAgentName)}
                </span>
              </div>
              <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{msg.content}</p>
              {msg.role === 'assistant' && msg.retrievedChunks && msg.retrievedChunks.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-600/50">
                  <details className="text-xs text-gray-400">
                    <summary className="cursor-pointer hover:text-gray-200 select-none outline-none">
                      {t('chatInterface.retrievedContext.title', { count: String(msg.retrievedChunks.length) })}
                    </summary>
                    <ul className="list-disc list-inside pl-2 mt-1 space-y-1 max-h-32 overflow-y-auto fancy-scrollbar">
                      {msg.retrievedChunks.map((chunk, index) => (
                        <li key={index} title={chunk.text} className="truncate">
                          <span className="font-semibold text-gray-300">{chunk.source}:</span> {chunk.text.substring(0, 70) + (chunk.text.length > 70 ? "..." : "")}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              )}
              <div className="text-xs text-gray-400 mt-1 text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              {msg.role === 'assistant' && (
                <button
                  onClick={() => handleSpeakMessage(msg.id, msg.content)}
                  className={`absolute -top-2 -right-2 p-1 bg-gray-600/70 hover:bg-gray-500/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200
                              ${currentSpokenMessageId === msg.id ? 'text-myra-primary animate-pulse' : 'text-gray-300'}`}
                  aria-label={currentSpokenMessageId === msg.id ? t('chatInterface.button.stopSpeaking') : t('chatInterface.button.speakMessage')}
                  title={currentSpokenMessageId === msg.id ? t('chatInterface.button.stopSpeaking') : t('chatInterface.button.speakMessage')}
                >
                  <SpeakerWaveIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {speechError && <div className="p-2 text-center text-xs text-red-400 bg-red-900/30">{speechError}</div>}
      <div className="p-2 sm:p-4 border-t border-gray-700 bg-gray-800/50">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={toggleListening}
            disabled={!speechRecognitionRef.current} // Button disabled if API not supported/initialized
            className={`p-2 sm:p-3 rounded-lg transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
                        ${isListening ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            aria-label={isListening ? t('chatInterface.button.stopSpeech') : t('chatInterface.button.startSpeech')}
            title={isListening ? t('chatInterface.button.stopSpeech') : t('chatInterface.button.startSpeech')}
          >
            <MicrophoneIcon className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isLoading ? t('chatInterface.input.thinking', { name: activeAgentName }) : isListening ? t('chatInterface.input.speechListening') : t('chatInterface.input.promptPlaceholder', { name: activeAgentName })}
            disabled={isLoading}
            className="flex-1 p-2 sm:p-3 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-150 ease-in-out text-gray-100 placeholder-gray-400 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputPrompt.trim()}
            className="p-2 sm:p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={t('chatInterface.button.sendMessage')}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <PaperAirplaneIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

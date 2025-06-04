
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MyraConfig } from '../types';
import { PaperAirplaneIcon, UserCircleIcon, SparklesIcon } from './IconComponents';

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatHistory]);

  const handleSend = () => {
    if (inputPrompt.trim() && !isLoading) {
      onSendMessage(inputPrompt.trim());
      setInputPrompt('');
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
      <div className="flex-1 p-6 space-y-4 overflow-y-auto fancy-scrollbar">
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3/4 p-3 rounded-xl shadow-md ${
                msg.role === 'user' 
                  ? 'bg-purple-600 text-white rounded-br-none' 
                  : 'bg-gray-700 text-gray-200 rounded-bl-none'
              }`}
            >
              <div className="flex items-center mb-1">
                {msg.role === 'user' ? (
                  <UserCircleIcon className="w-5 h-5 mr-2 text-purple-300" />
                ) : (
                  <SparklesIcon className="w-5 h-5 mr-2 text-purple-400" />
                )}
                <span className="font-semibold text-sm">
                  {msg.role === 'user' ? myraConfig.userName : myraConfig.myraName}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <div className="text-xs text-gray-400 mt-1 text-right">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700 bg-gray-800/50">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isLoading ? t('chatInterface.input.thinking', { name: myraConfig.myraName }) : t('chatInterface.input.promptPlaceholder', { name: myraConfig.myraName })}
            disabled={isLoading}
            className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-150 ease-in-out text-gray-100 placeholder-gray-400 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputPrompt.trim()}
            className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
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

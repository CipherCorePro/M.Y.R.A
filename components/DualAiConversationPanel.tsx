
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MyraConfig } from '../types';
import { PaperAirplaneIcon, UserCircleIcon, SparklesIcon, ChatBubbleLeftRightIcon } from './IconComponents';

interface DualAiConversationPanelProps {
  dualConversationHistory: ChatMessage[];
  isDualConversationLoading: boolean;
  onStartDualConversation: (initialPrompt: string, rounds: number) => Promise<void>;
  myraConfig: MyraConfig;
  t: (key: string, substitutions?: Record<string, string>) => string;
}

const DualAiConversationPanel: React.FC<DualAiConversationPanelProps> = ({
  dualConversationHistory,
  isDualConversationLoading,
  onStartDualConversation,
  myraConfig,
  t,
}) => {
  const [initialPrompt, setInitialPrompt] = useState<string>('');
  const [rounds, setRounds] = useState<number>(3);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [dualConversationHistory]);

  const handleStartConversation = () => {
    if (initialPrompt.trim() && rounds > 0 && !isDualConversationLoading) {
      onStartDualConversation(initialPrompt.trim(), rounds);
    }
  };
  
  const getSpeakerIcon = (speakerName?: string) => {
    if (speakerName === myraConfig.myraName) return <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-purple-400" />;
    if (speakerName === myraConfig.caelumName) return <ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-sky-400" />;
    return <UserCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-green-400" />;
  };
  
  const getSpeakerBgColor = (speakerName?: string, role?: string) => {
    if (role === 'user') return 'bg-green-600 rounded-br-none';
    if (speakerName === myraConfig.myraName) return 'bg-purple-700 rounded-bl-none';
    if (speakerName === myraConfig.caelumName) return 'bg-sky-700 rounded-bl-none';
    return 'bg-gray-700 rounded-bl-none';
  };


  return (
    <div className="flex flex-col h-full bg-gray-800/30 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700">
      {/* Controls Section */}
      <div className="p-3 sm:p-4 border-b border-gray-700 bg-gray-800/50 space-y-3">
        <div>
          <label htmlFor="dual-initial-prompt" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
            {t('dualAiPanel.label.initialPrompt', { myraName: myraConfig.myraName, caelumName: myraConfig.caelumName})}
          </label>
          <textarea
            id="dual-initial-prompt"
            rows={2}
            value={initialPrompt}
            onChange={(e) => setInitialPrompt(e.target.value)}
            placeholder={t('dualAiPanel.placeholder.initialPrompt')}
            className="w-full p-2 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-100 placeholder-gray-400"
            disabled={isDualConversationLoading}
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-2 sm:space-y-0">
          <div>
            <label htmlFor="dual-rounds" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
              {t('dualAiPanel.label.rounds')}
            </label>
            <input
              type="number"
              id="dual-rounds"
              value={rounds}
              onChange={(e) => setRounds(Math.max(1, parseInt(e.target.value, 10) || 1))}
              min="1"
              max="10"
              className="p-2 w-full sm:w-24 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-100"
              disabled={isDualConversationLoading}
            />
          </div>
          <button
            onClick={handleStartConversation}
            disabled={isDualConversationLoading || !initialPrompt.trim() || rounds <= 0}
            className="w-full sm:w-auto py-2 px-4 sm:py-2.5 sm:px-6 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDualConversationLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
            ) : (
              t('dualAiPanel.button.startConversation')
            )}
          </button>
        </div>
      </div>

      {/* Conversation History Section */}
      <div className="flex-1 p-3 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto fancy-scrollbar">
        {dualConversationHistory.map((msg) => (
          <div key={msg.id} className={`flex ${
              msg.role === 'user' ? 'justify-center' : 
              msg.speakerName === myraConfig.caelumName ? 'justify-end' : 
              'justify-start'
            }`}>
            <div className={`max-w-[90%] sm:max-w-3/4 p-2 sm:p-3 rounded-xl shadow-md text-white ${getSpeakerBgColor(msg.speakerName, msg.role)} ${msg.role === 'system' ? 'w-full text-center bg-gray-600' : ''}`}>
              <div className={`flex items-center mb-1 ${msg.role === 'system' ? 'justify-center' : ''}`}>
                {getSpeakerIcon(msg.speakerName)}
                <span className="font-semibold text-xs sm:text-sm">
                  {msg.speakerName || (msg.role === 'user' ? myraConfig.userName : t('dualAiPanel.label.system'))}
                </span>
              </div>
              <p className={`text-sm sm:text-base whitespace-pre-wrap break-words ${msg.role === 'system' ? 'italic text-gray-300' : ''}`}>{msg.content}</p>
              <div className="text-xs text-gray-400 mt-1 text-right">
                 {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {dualConversationHistory.length === 0 && !isDualConversationLoading && (
            <div className="text-center text-gray-400 italic mt-10 px-2">
                {t('dualAiPanel.info.emptyState')}
            </div>
        )}
        {isDualConversationLoading && dualConversationHistory.length > 0 && (
             <div className="flex justify-center items-center p-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
                <span className="ml-2 text-purple-300">{t('dualAiPanel.info.inProgress')}</span>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default DualAiConversationPanel;

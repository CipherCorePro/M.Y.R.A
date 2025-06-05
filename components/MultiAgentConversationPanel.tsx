
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MyraConfig } from '../types';
import { UserCircleIcon, SparklesIcon, CpuChipIcon, UserGroupIcon as PanelIcon, PaperAirplaneIcon, CheckCircleIcon } from './IconComponents';

interface MultiAgentConversationPanelProps {
  multiAgentConversationHistory: ChatMessage[];
  isMultiAgentConversationLoading: boolean;
  onStartMultiAgentConversation: (initialPrompt: string, rounds: number, selectedAgentIds: string[]) => Promise<void>;
  myraConfig: MyraConfig;
  t: (key: string, substitutions?: Record<string, string>) => string;
}

const getSpeakerStyling = (message: ChatMessage, config: MyraConfig, tFunc: (key: string, substitutions?: Record<string, string>) => string) => {
    const { speakerId, speakerName, role } = message;

    if (role === 'user' || speakerId === 'user') {
        return {
            icon: <UserCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-green-400" />,
            bgColor: 'bg-green-600 rounded-br-none',
            name: speakerName || config.userName || tFunc('user.name')
        };
    }
    if (speakerId === 'myra') {
        return {
            icon: <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-myra-primary" />,
            bgColor: 'bg-myra-primary/80 rounded-bl-none',
            name: speakerName || config.myraName
        };
    }
    if (speakerId === 'caelum') {
        return {
            icon: <CpuChipIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-caelum-primary" />,
            bgColor: 'bg-caelum-primary/80 rounded-bl-none',
            name: speakerName || config.caelumName
        };
    }
    
    // If speakerId is defined and not 'myra', 'caelum', or 'user', it's a configurable agent.
    if (speakerId && role === 'assistant') { 
        const configurableAgent = config.configurableAgents.find(a => a.id === speakerId);
        return {
            icon: <PanelIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-purple-400" />,
            bgColor: 'bg-indigo-700 rounded-bl-none', // Consistent distinct color for configurable agents
            name: speakerName || configurableAgent?.name || tFunc('multiAgentConversationPanel.label.agent')
        };
    }

    if (role === 'system') {
         return {
            icon: <PanelIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-gray-400" />,
            bgColor: 'bg-gray-600 w-full text-center',
            name: speakerName || tFunc('multiAgentConversationPanel.label.system')
        };
    }

    // Fallback for unknown assistant or other roles if speakerId is not matched
    return {
        icon: <PanelIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-gray-400" />,
        bgColor: 'bg-gray-700 rounded-bl-none',
        name: speakerName || tFunc('multiAgentConversationPanel.label.unknownAgent')
    };
};


const MultiAgentConversationPanel: React.FC<MultiAgentConversationPanelProps> = ({
  multiAgentConversationHistory,
  isMultiAgentConversationLoading,
  onStartMultiAgentConversation,
  myraConfig,
  t,
}) => {
  const [initialPrompt, setInitialPrompt] = useState<string>('');
  const [rounds, setRounds] = useState<number>(2);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const allAvailableAgents: ({ id: string; name: string; type: 'system' | 'configurable' })[] = [
    { id: 'myra', name: myraConfig.myraName || 'M.Y.R.A.', type: 'system' },
    { id: 'caelum', name: myraConfig.caelumName || 'C.A.E.L.U.M.', type: 'system' },
    ...myraConfig.configurableAgents.map(agent => ({ id: agent.id, name: agent.name, type: 'configurable' as 'configurable'}))
  ];
  
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(['myra', 'caelum']);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [multiAgentConversationHistory]);

  const handleToggleAgentSelection = (agentId: string) => {
    setSelectedAgentIds(prevSelected =>
      prevSelected.includes(agentId)
        ? prevSelected.filter(id => id !== agentId)
        : [...prevSelected, agentId]
    );
  };

  const handleStartConversation = () => {
    if (initialPrompt.trim() && rounds > 0 && selectedAgentIds.length > 0 && !isMultiAgentConversationLoading) {
      onStartMultiAgentConversation(initialPrompt.trim(), rounds, selectedAgentIds);
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-800/30 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700">
      <div className="p-3 sm:p-4 border-b border-gray-700 bg-gray-800/50 space-y-3">
        <h3 className="text-md sm:text-lg font-semibold text-purple-300 flex items-center">
          <PanelIcon className="w-5 h-5 mr-2"/> {t('multiAgentConversationPanel.title')}
        </h3>
        <div>
          <label htmlFor="multi-initial-prompt" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
            {t('multiAgentConversationPanel.label.initialPrompt')}
          </label>
          <textarea
            id="multi-initial-prompt"
            rows={2}
            value={initialPrompt}
            onChange={(e) => setInitialPrompt(e.target.value)}
            placeholder={t('multiAgentConversationPanel.placeholder.initialPrompt')}
            className="w-full p-2 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-100 placeholder-gray-400"
            disabled={isMultiAgentConversationLoading}
          />
        </div>
        
        <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
              {t('multiAgentConversationPanel.label.selectAgents')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2 bg-gray-700/50 rounded-md">
                {allAvailableAgents.map(agent => (
                    <button
                        key={agent.id}
                        onClick={() => handleToggleAgentSelection(agent.id)}
                        disabled={isMultiAgentConversationLoading}
                        className={`p-2 text-xs rounded-md transition-colors duration-150 flex items-center justify-center
                            ${selectedAgentIds.includes(agent.id) ? (agent.id === 'myra' ? 'bg-myra-primary text-white shadow-md' : agent.id === 'caelum' ? 'bg-caelum-primary text-white shadow-md' : 'bg-purple-600 text-white shadow-md') : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}
                            disabled:opacity-50 disabled:cursor-not-allowed`}
                        title={agent.name}
                        aria-pressed={selectedAgentIds.includes(agent.id)}
                    >
                        {selectedAgentIds.includes(agent.id) && <CheckCircleIcon className="w-3 h-3 mr-1"/>}
                        <span className="truncate">{agent.name}</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-2 sm:space-y-0">
          <div>
            <label htmlFor="multi-rounds" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
              {t('multiAgentConversationPanel.label.roundsPerAgent')}
            </label>
            <input
              type="number"
              id="multi-rounds"
              value={rounds}
              onChange={(e) => setRounds(Math.max(1, parseInt(e.target.value, 10) || 1))}
              min="1"
              max="10"
              className="p-2 w-full sm:w-24 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-100"
              disabled={isMultiAgentConversationLoading}
            />
          </div>
          <button
            onClick={handleStartConversation}
            disabled={isMultiAgentConversationLoading || !initialPrompt.trim() || rounds <= 0 || selectedAgentIds.length === 0}
            className="w-full sm:w-auto py-2 px-4 sm:py-2.5 sm:px-6 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMultiAgentConversationLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
            ) : (
              t('multiAgentConversationPanel.button.startConversation')
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 p-3 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto fancy-scrollbar">
        {multiAgentConversationHistory.map((msg) => {
          const styleInfo = getSpeakerStyling(msg, myraConfig, t);
          return (
            <div key={msg.id} className={`flex ${
                msg.role === 'user' ? 'justify-center' : 
                (msg.speakerId && selectedAgentIds.indexOf(msg.speakerId) % 2 === 0 && msg.role !== 'system') ? 'justify-start' : 
                (msg.role !== 'system') ? 'justify-end' : 'justify-center'
              }`}>
              <div className={`max-w-[90%] sm:max-w-3/4 p-2 sm:p-3 rounded-xl shadow-md text-white ${styleInfo.bgColor}`}>
                <div className={`flex items-center mb-1 ${msg.role === 'system' ? 'justify-center' : ''}`}>
                  {styleInfo.icon}
                  <span className="font-semibold text-xs sm:text-sm">
                    {styleInfo.name}
                  </span>
                </div>
                <p className={`text-sm sm:text-base whitespace-pre-wrap break-words ${msg.role === 'system' ? 'italic text-gray-300' : ''}`}>{msg.content}</p>
                {/* Context retrieval display can be added here if implemented for multi-agent */}
                <div className="text-xs text-gray-400 mt-1 text-right">
                   {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        {multiAgentConversationHistory.length === 0 && !isMultiAgentConversationLoading && (
            <div className="text-center text-gray-400 italic mt-10 px-2">
                {t('multiAgentConversationPanel.info.emptyState')}
            </div>
        )}
        {isMultiAgentConversationLoading && multiAgentConversationHistory.length > 0 && (
             <div className="flex justify-center items-center p-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
                <span className="ml-2 text-purple-300">{t('multiAgentConversationPanel.info.inProgress')}</span>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MultiAgentConversationPanel;

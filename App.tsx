import React from 'react';
import { useMyraState } from './hooks/useMyraState';
import ChatInterface from './components/ChatInterface';
import SubQGDisplay from './components/SubQGDisplay';
import SystemStatusPanel from './components/SystemStatusPanel';
import NodePanel from './components/NodePanel';
import SettingsPanel from './components/SettingsPanel';
import KnowledgePanel from './components/KnowledgePanel'; // Import new panel
import { MyraConfig, TextChunk } from './types';
// INITIAL_CONFIG is not directly used here but useMyraState uses it.
// import { INITIAL_CONFIG } from './constants'; 
import { SparklesIcon, Cog6ToothIcon, InformationCircleIcon, BeakerIcon, BookOpenIcon } from './components/IconComponents'; // Added BookOpenIcon

const App: React.FC = () => {
  const myraState = useMyraState();
  const [activeTab, setActiveTab] = React.useState<'status' | 'nodes' | 'subqg' | 'settings' | 'knowledge'>('status'); // Added knowledge tab

  const handleConfigChange = (newConfig: Partial<MyraConfig>) => {
    myraState.updateMyraConfig(newConfig);
  };

  const handleLoadFile = async (file: File) => {
    await myraState.loadAndProcessFile(file);
  };

  const handleClearKnowledge = () => {
    myraState.clearAllKnowledge();
  };


  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-gray-100 overflow-hidden">
      <header className="p-4 bg-gray-800/50 backdrop-blur-md shadow-lg flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-8 w-8 text-purple-400" />
          <h1 className="text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            M.Y.R.A Interface
          </h1>
        </div>
        <div className="text-sm text-gray-400">
          Sim Step: {myraState.simulationStep} | Fitness: {myraState.adaptiveFitness.overallScore.toFixed(3)}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Tabs for Status, Nodes, SubQG, Settings, Knowledge */}
        <aside className="w-1/4 min-w-[350px] max-w-[450px] bg-gray-800/70 backdrop-blur-md p-4 space-y-4 overflow-y-auto border-r border-gray-700 shadow-xl">
          <div className="flex space-x-1 p-1 bg-gray-700 rounded-lg">
            {[
              { id: 'status', label: 'Status', icon: <InformationCircleIcon className="w-5 h-5 mr-1"/> },
              { id: 'nodes', label: 'Nodes', icon: <BeakerIcon className="w-5 h-5 mr-1"/> },
              { id: 'subqg', label: 'SubQG', icon: <SparklesIcon className="w-5 h-5 mr-1"/> },
              { id: 'knowledge', label: 'Knowledge', icon: <BookOpenIcon className="w-5 h-5 mr-1"/> }, // New Knowledge Tab
              { id: 'settings', label: 'Settings', icon: <Cog6ToothIcon className="w-5 h-5 mr-1"/> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center transition-colors duration-200 ease-in-out
                  ${activeTab === tab.id ? 'bg-purple-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-600 hover:text-white'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          
          {activeTab === 'status' && (
            <SystemStatusPanel
              emotionState={myraState.emotionState}
              adaptiveFitness={myraState.adaptiveFitness}
              subQgGlobalMetrics={myraState.subQgGlobalMetrics}
              activeSubQgJumpModifier={myraState.activeSubQgJumpModifier}
              subQgJumpModifierActiveStepsRemaining={myraState.subQgJumpModifierActiveStepsRemaining}
            />
          )}
          {activeTab === 'nodes' && <NodePanel nodeStates={myraState.nodeStates} />}
          {activeTab === 'subqg' && (
            <SubQGDisplay
              matrix={myraState.subQgMatrix}
              phaseMatrix={myraState.subQgPhaseMatrix}
              size={myraState.myraConfig.subqgSize}
              onInject={myraState.injectSubQgStimulus}
              jumpInfo={myraState.subQgJumpInfo}
            />
          )}
           {activeTab === 'knowledge' && ( // New Panel Rendering
            <KnowledgePanel
              processedTextChunks={myraState.processedTextChunks}
              onLoadFile={handleLoadFile}
              onClearKnowledge={handleClearKnowledge}
              isLoading={myraState.isLoadingKnowledge}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsPanel
              config={myraState.myraConfig}
              onConfigChange={handleConfigChange}
            />
          )}
        </aside>

        {/* Main Panel: Chat Interface */}
        <main className="flex-1 flex flex-col p-4 overflow-hidden">
          <ChatInterface
            chatHistory={myraState.chatHistory}
            onSendMessage={myraState.generateMyraResponse}
            isLoading={myraState.isLoading}
            myraConfig={myraState.myraConfig}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
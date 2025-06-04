import React, { useEffect } from 'react';
import { useMyraState } from './hooks/useMyraState';
import ChatInterface from './components/ChatInterface';
import SubQGDisplay from './components/SubQGDisplay';
import SystemStatusPanel from './components/SystemStatusPanel';
import NodePanel from './components/NodePanel';
import { SettingsPanel } from './components/SettingsPanel';
import KnowledgePanel from './components/KnowledgePanel';
import DualAiConversationPanel from './components/DualAiConversationPanel';
import { MyraConfig } from './types';
import { SparklesIcon, Cog6ToothIcon, InformationCircleIcon, BeakerIcon, BookOpenIcon, ChatBubbleLeftRightIcon, CpuChipIcon } from './components/IconComponents';

export type ActiveTab =
  | 'statusMyra' | 'nodesMyra' | 'subqgMyra'
  | 'statusCaelum' | 'nodesCaelum' | 'subqgCaelum'
  | 'knowledge' | 'dualAI' | 'settings';

const App: React.FC = () => {
  const myraState = useMyraState();
  const { myraConfig, t, language } = myraState;
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('statusMyra');

  useEffect(() => {
    document.documentElement.className = myraConfig.theme;
    document.documentElement.lang = language;
  }, [myraConfig.theme, language]);

  const handleConfigChange = (newConfig: Partial<MyraConfig>) => {
    myraState.updateMyraConfig(newConfig);
  };

  const handleLoadFile = async (file: File) => {
    await myraState.loadAndProcessFile(file);
  };

  const handleClearKnowledge = () => {
    myraState.clearAllKnowledge();
  };

  const getHeaderInfo = () => {
    if (activeTab.endsWith('Caelum')) {
      return {
        simStep: myraState.simulationStepCaelum,
        fitness: myraState.adaptiveFitnessCaelum.overallScore,
        name: myraConfig.caelumName // Already translated via myraConfig
      };
    }
    return {
      simStep: myraState.simulationStep,
      fitness: myraState.adaptiveFitness.overallScore,
      name: myraConfig.myraName // Already translated via myraConfig
    };
  };
  const headerInfo = getHeaderInfo();

  const tabDefinitions = [
    { id: 'statusMyra', labelKey: 'tabs.statusMyra', icon: <InformationCircleIcon className="w-5 h-5 mr-1 text-myra-primary" /> },
    { id: 'statusCaelum', labelKey: 'tabs.statusCaelum', icon: <InformationCircleIcon className="w-5 h-5 mr-1 text-caelum-primary" /> },
    { id: 'nodesMyra', labelKey: 'tabs.nodesMyra', icon: <BeakerIcon className="w-5 h-5 mr-1 text-myra-primary" /> },
    { id: 'nodesCaelum', labelKey: 'tabs.nodesCaelum', icon: <BeakerIcon className="w-5 h-5 mr-1 text-caelum-primary" /> },
    { id: 'subqgMyra', labelKey: 'tabs.subqgMyra', icon: <SparklesIcon className="w-5 h-5 mr-1 text-myra-primary" /> },
    { id: 'subqgCaelum', labelKey: 'tabs.subqgCaelum', icon: <SparklesIcon className="w-5 h-5 mr-1 text-caelum-primary" /> },
    { id: 'knowledge', labelKey: 'tabs.knowledge', icon: <BookOpenIcon className="w-5 h-5 mr-1 text-text-accent" /> },
    { id: 'dualAI', labelKey: 'tabs.dualAI', icon: <ChatBubbleLeftRightIcon className="w-5 h-5 mr-1 text-text-accent" /> },
    { id: 'settings', labelKey: 'tabs.settings', icon: <Cog6ToothIcon className="w-5 h-5 mr-1 text-text-accent" /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-primary text-primary overflow-hidden">
      <header className="p-4 bg-secondary backdrop-blur-md shadow-lg flex items-center justify-between border-b border-accent">
        <div className="flex items-center space-x-2">
          {activeTab.endsWith('Caelum') ? <CpuChipIcon className="h-8 w-8 text-caelum-primary" /> : <SparklesIcon className="h-8 w-8 text-myra-primary" />}
          <h1 className="text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-myra-primary to-myra-secondary">
            {activeTab.endsWith('Caelum') ? t('header.caelumSystemInterface', { name: myraConfig.caelumName }) : t('header.myraSystemInterface', { name: myraConfig.myraName })}
          </h1>
        </div>
        <div className="text-sm text-text-accent">
          {t('header.simStep', { agent: headerInfo.name.charAt(0) })}: {headerInfo.simStep} | {t('header.fitness', { agent: headerInfo.name.charAt(0) })}: {headerInfo.fitness.toFixed(3)}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-1/4 min-w-[350px] max-w-[450px] bg-secondary-transparent backdrop-blur-md p-4 space-y-4 overflow-y-auto border-r border-accent shadow-xl fancy-scrollbar">
          <div className="grid grid-cols-2 gap-1 p-1 bg-accent rounded-lg">
            {tabDefinitions.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center transition-colors duration-200 ease-in-out
                  ${activeTab === tab.id ?
                    (tab.id.toString().includes('Caelum') ? 'bg-caelum-primary text-white shadow-md' : 'bg-myra-primary text-white shadow-md') :
                    'text-text-secondary hover:bg-accent-dark hover:text-text-primary'}`}
                 aria-label={t(tab.labelKey)}
                 role="tab"
                 aria-selected={activeTab === tab.id}
              >
                {tab.icon} {t(tab.labelKey)}
              </button>
            ))}
          </div>

          {activeTab === 'statusMyra' && (
            <SystemStatusPanel
              emotionState={myraState.emotionState}
              adaptiveFitness={myraState.adaptiveFitness}
              subQgGlobalMetrics={myraState.subQgGlobalMetrics}
              activeSubQgJumpModifier={myraState.activeSubQgJumpModifier}
              subQgJumpModifierActiveStepsRemaining={myraState.subQgJumpModifierActiveStepsRemaining}
              myraStressLevel={myraState.myraStressLevel}
              subQgJumpInfo={myraState.subQgJumpInfo}
              t={t}
              agentName={myraConfig.myraName}
            />
          )}
           {activeTab === 'statusCaelum' && (
            <SystemStatusPanel
              emotionState={myraState.emotionStateCaelum}
              adaptiveFitness={myraState.adaptiveFitnessCaelum}
              subQgGlobalMetrics={myraState.subQgGlobalMetricsCaelum}
              activeSubQgJumpModifier={myraState.activeSubQgJumpModifierCaelum}
              subQgJumpModifierActiveStepsRemaining={myraState.subQgJumpModifierActiveStepsRemainingCaelum}
              myraStressLevel={myraState.caelumStressLevel}
              subQgJumpInfo={myraState.subQgJumpInfoCaelum}
              t={t}
              agentName={myraConfig.caelumName}
            />
          )}
          {activeTab === 'nodesMyra' && <NodePanel nodeStates={myraState.nodeStates} t={t} />}
          {activeTab === 'nodesCaelum' && <NodePanel nodeStates={myraState.nodeStatesCaelum} t={t} />}
          {activeTab === 'subqgMyra' && (
            <SubQGDisplay
              matrix={myraState.subQgMatrix}
              phaseMatrix={myraState.subQgPhaseMatrix}
              size={myraConfig.subqgSize}
              onInject={myraState.injectSubQgStimulus}
              jumpInfo={myraState.subQgJumpInfo}
              t={t}
            />
          )}
          {activeTab === 'subqgCaelum' && (
            <SubQGDisplay
              matrix={myraState.subQgMatrixCaelum}
              phaseMatrix={myraState.subQgPhaseMatrixCaelum}
              size={myraConfig.caelumSubqgSize}
              onInject={myraState.injectSubQgStimulusCaelum}
              jumpInfo={myraState.subQgJumpInfoCaelum}
              t={t}
            />
          )}
           {activeTab === 'knowledge' && (
            <KnowledgePanel
              processedTextChunks={myraState.processedTextChunks}
              onLoadFile={handleLoadFile}
              onClearKnowledge={handleClearKnowledge}
              isLoading={myraState.isLoadingKnowledge}
              t={t}
            />
          )}
           {activeTab === 'dualAI' && (
            <DualAiConversationPanel
              dualConversationHistory={myraState.dualConversationHistory}
              isDualConversationLoading={myraState.isDualConversationLoading}
              onStartDualConversation={myraState.startDualConversation}
              myraConfig={myraConfig} // Already contains translated names
              t={t}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsPanel
              config={myraConfig}
              onConfigChange={handleConfigChange}
              t={t}
            />
          )}
        </aside>

        <main className="flex-1 flex flex-col p-4 overflow-hidden">
          <ChatInterface
            chatHistory={myraState.chatHistory}
            onSendMessage={myraState.generateMyraResponse}
            isLoading={myraState.isLoading}
            myraConfig={myraConfig} // Already contains translated names
            t={t}
          />
        </main>
      </div>
    </div>
  );
};

export default App;


import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useMyraState } from './hooks/useMyraState';
import ChatInterface from './components/ChatInterface';
import SubQGDisplay from './components/SubQGDisplay';
import SystemStatusPanel from './components/SystemStatusPanel';
import NodePanel from './components/NodePanel';
import { SettingsPanel } from './components/SettingsPanel';
import KnowledgePanel from './components/KnowledgePanel';
import DualAiConversationPanel from './components/DualAiConversationPanel';
import EmotionTimelinePanel from './components/EmotionTimelinePanel';
import DocumentationPanel from './components/DocumentationPanel'; 
import MultiAgentConversationPanel from './components/MultiAgentConversationPanel'; // New
import { MyraConfig, ActiveTab } from './types'; 
import { SparklesIcon, Cog6ToothIcon, InformationCircleIcon, BeakerIcon, BookOpenIcon, ChatBubbleLeftRightIcon, CpuChipIcon, Bars3Icon, XMarkIcon, PresentationChartLineIcon, EllipsisVerticalIcon, DocumentTextIcon, UserGroupIcon } from './components/IconComponents'; // Added UserGroupIcon


const DEFAULT_DESKTOP_SIDEBAR_WIDTH = 380;
const MIN_DESKTOP_SIDEBAR_WIDTH = 280;
const MAX_DESKTOP_SIDEBAR_WIDTH = 700; 

const App: React.FC = () => {
  const myraState = useMyraState();
  const { myraConfig, t, language } = myraState;
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('statusMyra');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const initialMouseXRef = useRef(0);
  const initialSidebarWidthRef = useRef(DEFAULT_DESKTOP_SIDEBAR_WIDTH);

  const [desktopSidebarWidth, setDesktopSidebarWidth] = useState<number>(() => {
    const savedWidth = localStorage.getItem('myraDesktopSidebarWidth');
    return savedWidth ? parseInt(savedWidth, 10) : DEFAULT_DESKTOP_SIDEBAR_WIDTH;
  });

  useEffect(() => {
    localStorage.setItem('myraDesktopSidebarWidth', desktopSidebarWidth.toString());
  }, [desktopSidebarWidth]);


  useEffect(() => {
    document.documentElement.className = myraConfig.theme;
    document.documentElement.lang = language;
  }, [myraConfig.theme, language]);

  const handleClickOutsideMobileSidebar = useCallback((event: MouseEvent) => {
    if (isMobileSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
      const hamburgerButton = document.getElementById('hamburger-button');
      if (hamburgerButton && hamburgerButton.contains(event.target as Node)) {
        return;
      }
      if (resizeHandleRef.current && resizeHandleRef.current.contains(event.target as Node)) {
        return;
      }
      setIsMobileSidebarOpen(false);
    }
  }, [isMobileSidebarOpen]);


  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutsideMobileSidebar);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideMobileSidebar);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMobileSidebar);
    };
  }, [isMobileSidebarOpen, handleClickOutsideMobileSidebar]);


  const handleMouseMoveResizable = useCallback((event: MouseEvent) => {
    if (!isResizingRef.current) return;
    const deltaX = event.clientX - initialMouseXRef.current;
    let newWidth = initialSidebarWidthRef.current + deltaX;
    newWidth = Math.max(MIN_DESKTOP_SIDEBAR_WIDTH, Math.min(newWidth, MAX_DESKTOP_SIDEBAR_WIDTH, window.innerWidth * 0.7)); 
    setDesktopSidebarWidth(newWidth);
  }, []);

  const handleMouseUpResizable = useCallback(() => {
    if (!isResizingRef.current) return;
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMoveResizable);
    document.removeEventListener('mouseup', handleMouseUpResizable);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleMouseMoveResizable]);

  const handleMouseDownOnResize = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    isResizingRef.current = true;
    initialMouseXRef.current = event.clientX;
    initialSidebarWidthRef.current = sidebarRef.current ? sidebarRef.current.offsetWidth : desktopSidebarWidth;
    document.addEventListener('mousemove', handleMouseMoveResizable);
    document.addEventListener('mouseup', handleMouseUpResizable);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [desktopSidebarWidth, handleMouseMoveResizable, handleMouseUpResizable]);


  const handleConfigChange = (newConfig: Partial<MyraConfig>) => {
    myraState.updateMyraConfig(newConfig);
  };

  const handleLoadFile = async (file: File) => {
    await myraState.loadAndProcessFile(file);
  };

  const handleClearKnowledge = () => {
    myraState.clearAllKnowledge();
  };

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    if (window.innerWidth < 768) { 
      setIsMobileSidebarOpen(false);
    }
  }

  const getHeaderInfo = () => {
    if (activeTab === 'statusCaelum' || activeTab === 'nodesCaelum' || activeTab === 'subqgCaelum') {
      return {
        simStep: myraState.simulationStepCaelum,
        fitness: myraState.adaptiveFitnessCaelum.overallScore,
        name: myraConfig.caelumName
      };
    }
    return {
      simStep: myraState.simulationStep,
      fitness: myraState.adaptiveFitness.overallScore,
      name: myraConfig.myraName
    };
  };
  const headerInfo = getHeaderInfo();
  
  const getHeaderTitle = () => {
    if (activeTab === 'emotionTimeline') return t('header.emotionTimelineInterface');
    if (activeTab === 'documentation') return t('header.documentationInterface');
    if (activeTab === 'multiAgentConversation') return t('header.multiAgentConversationInterface');
    if (activeTab === 'statusCaelum' || activeTab === 'nodesCaelum' || activeTab === 'subqgCaelum') return t('header.caelumSystemInterface', { name: myraConfig.caelumName });
    return t('header.myraSystemInterface', { name: myraConfig.myraName });
  };


  const tabDefinitions = [
    { id: 'statusMyra', labelKey: 'tabs.statusMyra', icon: <InformationCircleIcon className="w-5 h-5 mr-1 text-myra-primary" /> },
    { id: 'statusCaelum', labelKey: 'tabs.statusCaelum', icon: <InformationCircleIcon className="w-5 h-5 mr-1 text-caelum-primary" /> },
    { id: 'nodesMyra', labelKey: 'tabs.nodesMyra', icon: <BeakerIcon className="w-5 h-5 mr-1 text-myra-primary" /> },
    { id: 'nodesCaelum', labelKey: 'tabs.nodesCaelum', icon: <BeakerIcon className="w-5 h-5 mr-1 text-caelum-primary" /> },
    { id: 'subqgMyra', labelKey: 'tabs.subqgMyra', icon: <SparklesIcon className="w-5 h-5 mr-1 text-myra-primary" /> },
    { id: 'subqgCaelum', labelKey: 'tabs.subqgCaelum', icon: <SparklesIcon className="w-5 h-5 mr-1 text-caelum-primary" /> },
    { id: 'emotionTimeline', labelKey: 'tabs.emotionTimeline', icon: <PresentationChartLineIcon className="w-5 h-5 mr-1 text-text-accent" /> },
    { id: 'knowledge', labelKey: 'tabs.knowledge', icon: <BookOpenIcon className="w-5 h-5 mr-1 text-text-accent" /> },
    { id: 'documentation', labelKey: 'tabs.documentation', icon: <DocumentTextIcon className="w-5 h-5 mr-1 text-text-accent" /> },
    { id: 'dualAI', labelKey: 'tabs.dualAI', icon: <ChatBubbleLeftRightIcon className="w-5 h-5 mr-1 text-text-accent" /> },
    { id: 'multiAgentConversation', labelKey: 'tabs.multiAgentConversation', icon: <UserGroupIcon className="w-5 h-5 mr-1 text-text-accent" /> },
    { id: 'settings', labelKey: 'tabs.settings', icon: <Cog6ToothIcon className="w-5 h-5 mr-1 text-text-accent" /> },
  ];

  const getTabAccentColor = (tabId: ActiveTab) => {
    if (tabId.toString().includes('Caelum')) return 'bg-caelum-primary text-white shadow-md';
    if (tabId.toString().includes('Myra')) return 'bg-myra-primary text-white shadow-md';
    return 'bg-purple-600 text-white shadow-md'; 
  };


  return (
    <div className="flex flex-col h-screen bg-primary text-primary overflow-hidden">
      <header className="p-3 md:p-4 bg-secondary backdrop-blur-md shadow-lg flex items-center justify-between border-b border-accent z-40">
        <div className="flex items-center space-x-2">
          <button
            id="hamburger-button"
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            aria-label={isMobileSidebarOpen ? t('header.closeMenu', {defaultValue: "Close menu"}) : t('header.openMenu', {defaultValue: "Open menu"})}
            aria-expanded={isMobileSidebarOpen}
            aria-controls="mobile-sidebar"
          >
            {isMobileSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
          {activeTab === 'emotionTimeline' ? <PresentationChartLineIcon className="h-7 w-7 md:h-8 md:w-8 text-text-accent" /> 
           : activeTab === 'documentation' ? <DocumentTextIcon className="h-7 w-7 md:h-8 md:w-8 text-text-accent" />
           : activeTab === 'multiAgentConversation' ? <UserGroupIcon className="h-7 w-7 md:h-8 md:w-8 text-text-accent" />
           : (activeTab === 'statusCaelum' || activeTab === 'nodesCaelum' || activeTab === 'subqgCaelum') ? <CpuChipIcon className="h-7 w-7 md:h-8 md:w-8 text-caelum-primary" /> 
           : <SparklesIcon className="h-7 w-7 md:h-8 md:w-8 text-myra-primary" />}
          <h1 className={`text-xl md:text-2xl font-bold tracking-wider ${
              activeTab === 'emotionTimeline' || activeTab === 'documentation' || activeTab === 'multiAgentConversation' ? 'text-text-accent' :
              (activeTab === 'statusCaelum' || activeTab === 'nodesCaelum' || activeTab === 'subqgCaelum') ? 'text-caelum-primary' : 
              'text-myra-primary'
            }`}>
            {getHeaderTitle()}
          </h1>
        </div>
        <div className="text-xs md:text-sm text-text-accent text-right">
          <div>{t('header.simStep', { agent: headerInfo.name.charAt(0) })}: {headerInfo.simStep}</div>
          <div>{t('header.fitness', { agent: headerInfo.name.charAt(0) })}: {headerInfo.fitness.toFixed(3)}</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          ></div>
        )}

        <aside
          id="mobile-sidebar" 
          ref={sidebarRef}
          className={`fixed inset-y-0 left-0 z-30 bg-secondary-transparent backdrop-blur-xl shadow-xl fancy-scrollbar
                     transform transition-transform duration-300 ease-in-out md:relative md:shadow-none md:backdrop-blur-md
                     ${isMobileSidebarOpen ? 'translate-x-0 w-[85vw] max-w-md p-4 space-y-4' : '-translate-x-full md:translate-x-0 flex'}`}
          style={!isMobileSidebarOpen ? { width: `${desktopSidebarWidth}px` } : {}} 
        >
          <div className={`flex-grow overflow-y-auto fancy-scrollbar ${isMobileSidebarOpen ? '' : 'p-4 space-y-4'}`}> 
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-1 p-1 bg-accent rounded-lg"> 
              {tabDefinitions.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id as ActiveTab)}
                  className={`py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center transition-colors duration-200 ease-in-out
                    ${activeTab === tab.id ? getTabAccentColor(tab.id as ActiveTab) : 'text-text-secondary hover:bg-accent-dark hover:text-text-primary'}`}
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
            {activeTab === 'emotionTimeline' && (
              <EmotionTimelinePanel
                padHistoryMyra={myraState.padHistoryMyra}
                padHistoryCaelum={myraState.padHistoryCaelum}
                myraName={myraConfig.myraName}
                caelumName={myraConfig.caelumName}
                t={t}
              />
            )}
             {activeTab === 'documentation' && (
              <DocumentationPanel
                language={myraConfig.language}
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
                myraConfig={myraConfig}
                t={t}
              />
            )}
            {activeTab === 'multiAgentConversation' && (
              <MultiAgentConversationPanel
                multiAgentConversationHistory={myraState.multiAgentConversationHistory}
                isMultiAgentConversationLoading={myraState.isMultiAgentConversationLoading}
                onStartMultiAgentConversation={myraState.startMultiAgentConversation}
                myraConfig={myraConfig}
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
          </div>
          {!isMobileSidebarOpen && (
            <div
              ref={resizeHandleRef}
              onMouseDown={handleMouseDownOnResize}
              className="hidden md:block absolute top-0 right-0 h-full w-2.5 cursor-col-resize bg-accent/30 hover:bg-accent/70 transition-colors duration-150 z-40"
              role="separator"
              aria-orientation="vertical"
              aria-controls="mobile-sidebar" 
              aria-label={t('sidebar.resizeHandleAriaLabel', {defaultValue: 'Resize sidebar'})}
              tabIndex={0} 
            >
              <EllipsisVerticalIcon className="h-5 w-5 text-text-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </aside>

        <main className="flex-1 flex flex-col p-2 sm:p-4 overflow-hidden">
          <ChatInterface
            chatHistory={myraState.chatHistory}
            onSendMessage={myraState.generateActiveAgentChatResponse}
            isLoading={myraState.isLoading}
            myraConfig={myraConfig}
            t={t}
          />
        </main>
      </div>
    </div>
  );
};

export default App;

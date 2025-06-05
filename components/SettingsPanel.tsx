
import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    MyraConfig, ConfigurableAgentPersona, AIProviderConfig, AgentSystemCoreConfig, AdaptiveFitnessConfig,
    AdaptiveFitnessMetricWeights, ConfigField, Language, Theme,
    AgentSpecificPersonaField, AgentSpecificAIProviderField, AgentSpecificSystemConfigField,
    AgentSpecificAdaptiveFitnessBaseField, AgentSpecificAdaptiveFitnessDimensionField
} from '../types';
import { 
    Cog6ToothIcon, ServerIcon, CloudIcon, BeakerIcon as SubQGIcon, BookOpenIcon, ChartPieIcon, 
    CpuChipIcon as CaelumAICPUChipIconActual, AdjustmentsVerticalIcon, 
    LanguageIcon as LanguageIconActual, PaintBrushIcon as PaintBrushIconActual, 
    UserCircleIcon as UserCircleIconActual, UserGroupIcon, PlusCircleIcon, TrashIcon, ChevronDownIcon, ChevronRightIcon 
} from './IconComponents';
import { INITIAL_CONFIG, INITIAL_ADAPTIVE_FITNESS_CONFIG } from '../constants';

interface SettingsPanelProps {
  config: MyraConfig;
  onConfigChange: (newConfig: Partial<MyraConfig>) => void;
  t: (key: string, substitutions?: Record<string, string>) => string;
}

const UserCircleIconComp: React.FC<{className?: string}> = UserCircleIconActual;
const LanguageIconComp: React.FC<{className?: string}> = LanguageIconActual;
const PaintBrushIconComp: React.FC<{className?: string}> = PaintBrushIconActual;
const CaelumAICPUChipIconComp: React.FC<{className?: string}> = CaelumAICPUChipIconActual;
const CaelumSystemIconComp: React.FC<{className?: string}> = AdjustmentsVerticalIcon;


const getConfigFields = (t: SettingsPanelProps['t'], myraConfig: MyraConfig): ConfigField[] => {
    const fields: ConfigField[] = [
      // Localization Group
      { key: 'language', labelKey: 'settingsPanel.language.label', type: 'select', options: [ { value: 'de', labelKey: 'settingsPanel.language.options.de' }, { value: 'en', labelKey: 'settingsPanel.language.options.en' } ], groupKey: "settingsPanel.group.localization" } as ConfigField,
      { key: 'theme', labelKey: 'settingsPanel.theme.label', type: 'select', options: [ { value: 'nebula', labelKey: 'settingsPanel.theme.options.nebula' }, { value: 'biosphere', labelKey: 'settingsPanel.theme.options.biosphere' }, { value: 'matrix', labelKey: 'settingsPanel.theme.options.matrix' } ], groupKey: "settingsPanel.group.localization" } as ConfigField,

      // M.Y.R.A. AI Provider Group
      { key: 'aiProvider', parentKey: 'myraAIProviderConfig', labelKey: 'settingsPanel.myraAI.aiProvider.label', type: 'select', options: [ { value: 'gemini', labelKey: 'settingsPanel.aiProvider.options.gemini' }, { value: 'lmstudio', labelKey: 'settingsPanel.aiProvider.options.lmstudio' } ], groupKey: "settingsPanel.group.myraAI" } as ConfigField,
      { key: 'geminiModelName', parentKey: 'myraAIProviderConfig', labelKey: 'settingsPanel.myraAI.geminiModelName.label', type: 'text', condition: config => config.myraAIProviderConfig.aiProvider === 'gemini', groupKey: "settingsPanel.group.myraAI" } as ConfigField,
      { key: 'lmStudioBaseUrl', parentKey: 'myraAIProviderConfig', labelKey: 'settingsPanel.myraAI.lmStudioBaseUrl.label', type: 'text', condition: config => config.myraAIProviderConfig.aiProvider === 'lmstudio', groupKey: "settingsPanel.group.myraAI" } as ConfigField,
      { key: 'lmStudioGenerationModel', parentKey: 'myraAIProviderConfig', labelKey: 'settingsPanel.myraAI.lmStudioGenerationModel.label', type: 'text', condition: config => config.myraAIProviderConfig.aiProvider === 'lmstudio', groupKey: "settingsPanel.group.myraAI" } as ConfigField,
      { key: 'temperatureBase', parentKey: 'myraAIProviderConfig', labelKey: 'settingsPanel.myraAI.temperatureBase.label', type: 'number', step: 0.05, min: 0, max: 2.0, groupKey: "settingsPanel.group.myraAI" } as ConfigField,

      // C.A.E.L.U.M. AI Provider Group
      { key: 'aiProvider', parentKey: 'caelumAIProviderConfig', labelKey: 'settingsPanel.caelumAI.aiProvider.label', type: 'select', options: [ { value: 'gemini', labelKey: 'settingsPanel.aiProvider.options.gemini' }, { value: 'lmstudio', labelKey: 'settingsPanel.aiProvider.options.lmstudio' } ], groupKey: "settingsPanel.group.caelumAI" } as ConfigField,
      { key: 'geminiModelName', parentKey: 'caelumAIProviderConfig', labelKey: 'settingsPanel.caelumAI.geminiModelName.label', type: 'text', condition: config => config.caelumAIProviderConfig.aiProvider === 'gemini', groupKey: "settingsPanel.group.caelumAI" } as ConfigField,
      { key: 'lmStudioBaseUrl', parentKey: 'caelumAIProviderConfig', labelKey: 'settingsPanel.caelumAI.lmStudioBaseUrl.label', type: 'text', condition: config => config.caelumAIProviderConfig.aiProvider === 'lmstudio', groupKey: "settingsPanel.group.caelumAI" } as ConfigField,
      { key: 'lmStudioGenerationModel', parentKey: 'caelumAIProviderConfig', labelKey: 'settingsPanel.caelumAI.lmStudioGenerationModel.label', type: 'text', condition: config => config.caelumAIProviderConfig.aiProvider === 'lmstudio', groupKey: "settingsPanel.group.caelumAI" } as ConfigField,
      { key: 'temperatureBase', parentKey: 'caelumAIProviderConfig', labelKey: 'settingsPanel.caelumAI.temperatureBase.label', type: 'number', step: 0.05, min: 0, max: 2.0, groupKey: "settingsPanel.group.caelumAI" } as ConfigField,
      
      // Myra Persona Group
      { key: 'myraName', labelKey: 'settingsPanel.myraPersona.name.label', type: 'text', groupKey: "settingsPanel.group.myraPersona" } as ConfigField,
      { key: 'userName', labelKey: 'settingsPanel.myraPersona.userName.label', type: 'text', groupKey: "settingsPanel.group.myraPersona" } as ConfigField,
      { key: 'myraRoleDescription', labelKey: 'settingsPanel.myraPersona.roleDescription.label', type: 'textarea', rows: 3, groupKey: "settingsPanel.group.myraPersona" } as ConfigField,
      { key: 'myraEthicsPrinciples', labelKey: 'settingsPanel.myraPersona.ethicsPrinciples.label', type: 'textarea', rows: 3, groupKey: "settingsPanel.group.myraPersona" } as ConfigField,
      { key: 'myraResponseInstruction', labelKey: 'settingsPanel.myraPersona.responseInstruction.label', type: 'textarea', rows: 4, groupKey: "settingsPanel.group.myraPersona" } as ConfigField,

      // Caelum Persona Group
      { key: 'caelumName', labelKey: 'settingsPanel.caelumPersona.name.label', type: 'text', groupKey: "settingsPanel.group.caelumPersona" } as ConfigField,
      { key: 'caelumRoleDescription', labelKey: 'settingsPanel.caelumPersona.roleDescription.label', type: 'textarea', rows: 3, groupKey: "settingsPanel.group.caelumPersona" } as ConfigField,
      { key: 'caelumEthicsPrinciples', labelKey: 'settingsPanel.caelumPersona.ethicsPrinciples.label', type: 'textarea', rows: 3, groupKey: "settingsPanel.group.caelumPersona" } as ConfigField,
      { key: 'caelumResponseInstruction', labelKey: 'settingsPanel.caelumPersona.responseInstruction.label', type: 'textarea', rows: 4, groupKey: "settingsPanel.group.caelumPersona" } as ConfigField,

      // M.Y.R.A. System Group (selected fields)
      { key: 'subqgSize', labelKey: 'settingsPanel.myraSystem.subqgSize.label', type: 'number', min: 4, max: 64, step: 1, groupKey: "settingsPanel.group.myraSystem" } as ConfigField,
      { key: 'subqgBaseEnergy', labelKey: 'settingsPanel.myraSystem.subqgBaseEnergy.label', type: 'number', min:0, max:0.1, step:0.001, groupKey: "settingsPanel.group.myraSystem" } as ConfigField,
      { key: 'subqgCoupling', labelKey: 'settingsPanel.myraSystem.subqgCoupling.label', type: 'number', min:0, max:0.1, step:0.001, groupKey: "settingsPanel.group.myraSystem" } as ConfigField,
      { key: 'nodeActivationDecay', labelKey: 'settingsPanel.myraSystem.nodeActivationDecay.label', type: 'number', min: 0.8, max: 1.0, step: 0.005, groupKey: "settingsPanel.group.myraSystem" } as ConfigField,
      { key: 'emotionDecay', labelKey: 'settingsPanel.myraSystem.emotionDecay.label', type: 'number', min: 0.8, max: 1.0, step: 0.005, groupKey: "settingsPanel.group.myraSystem" } as ConfigField,
      { key: 'adaptiveFitnessUpdateInterval', labelKey: 'settingsPanel.myraSystem.adaptiveFitnessUpdateInterval.label', type: 'number', min: 1, max: 20, step: 1, groupKey: "settingsPanel.group.myraSystem" } as ConfigField,
      { key: 'rngType', labelKey: 'settingsPanel.myraSystem.rngType.label', type: 'select', options: [ {value: 'subqg', labelKey: 'settingsPanel.rngType.options.subqg'}, {value: 'quantum', labelKey: 'settingsPanel.rngType.options.quantum'} ], groupKey: "settingsPanel.group.myraSystem" } as ConfigField,
      { key: 'subqgSeed', labelKey: 'settingsPanel.myraSystem.subqgSeed.label', type: 'number', condition: config => config.rngType === 'subqg', placeholderKey: 'settingsPanel.myraSystem.subqgSeed.placeholder', groupKey: "settingsPanel.group.myraSystem" } as ConfigField,


      // C.A.E.L.U.M. System Group (selected fields)
      { key: 'caelumSubqgSize', labelKey: 'settingsPanel.caelumSystem.subqgSize.label', type: 'number', min: 4, max: 64, step: 1, groupKey: "settingsPanel.group.caelumSystem" } as ConfigField,
      { key: 'caelumSubqgBaseEnergy', labelKey: 'settingsPanel.caelumSystem.subqgBaseEnergy.label', type: 'number', min:0, max:0.1, step:0.001, groupKey: "settingsPanel.group.caelumSystem" } as ConfigField,
      { key: 'caelumSubqgCoupling', labelKey: 'settingsPanel.caelumSystem.subqgCoupling.label', type: 'number', min:0, max:0.1, step:0.001, groupKey: "settingsPanel.group.caelumSystem" } as ConfigField,
      { key: 'caelumNodeActivationDecay', labelKey: 'settingsPanel.caelumSystem.nodeActivationDecay.label', type: 'number', min: 0.8, max: 1.0, step: 0.005, groupKey: "settingsPanel.group.caelumSystem" } as ConfigField,
      { key: 'caelumEmotionDecay', labelKey: 'settingsPanel.caelumSystem.emotionDecay.label', type: 'number', min: 0.8, max: 1.0, step: 0.005, groupKey: "settingsPanel.group.caelumSystem" } as ConfigField,
      { key: 'caelumAdaptiveFitnessUpdateInterval', labelKey: 'settingsPanel.caelumSystem.adaptiveFitnessUpdateInterval.label', type: 'number', min: 1, max: 20, step: 1, groupKey: "settingsPanel.group.caelumSystem" } as ConfigField,
      { key: 'caelumRngType', labelKey: 'settingsPanel.caelumSystem.rngType.label', type: 'select', options: [ {value: 'subqg', labelKey: 'settingsPanel.rngType.options.subqg'}, {value: 'quantum', labelKey: 'settingsPanel.rngType.options.quantum'} ], groupKey: "settingsPanel.group.caelumSystem" } as ConfigField,
      { key: 'caelumSubqgSeed', labelKey: 'settingsPanel.caelumSystem.subqgSeed.label', type: 'number', condition: config => config.caelumRngType === 'subqg', placeholderKey: 'settingsPanel.caelumSystem.subqgSeed.placeholder', groupKey: "settingsPanel.group.caelumSystem" } as ConfigField,

      // General System Group
      { key: 'activeChatAgent', labelKey: 'settingsPanel.generalSystem.activeChatAgent.label', type: 'select', options: [ {value: 'myra', labelKey: myraConfig.myraName || t('settingsPanel.generalSystem.activeChatAgent.options.myra')}, {value: 'caelum', labelKey: myraConfig.caelumName || t('settingsPanel.generalSystem.activeChatAgent.options.caelum')} ], groupKey: "settingsPanel.group.generalSystem" } as ConfigField,
      { key: 'maxHistoryMessagesForPrompt', labelKey: 'settingsPanel.generalSystem.maxHistoryMessagesForPrompt.label', type: 'number', min: 0, max: 20, step: 1, groupKey: "settingsPanel.group.generalSystem" } as ConfigField,
      { key: 'temperatureLimbusInfluence', labelKey: 'settingsPanel.generalSystem.temperatureLimbusInfluence.label', type: 'number', min: -0.5, max: 0.5, step: 0.01, groupKey: "settingsPanel.group.generalSystem" } as ConfigField,
      { key: 'temperatureCreativusInfluence', labelKey: 'settingsPanel.generalSystem.temperatureCreativusInfluence.label', type: 'number', min: -0.5, max: 0.5, step: 0.01, groupKey: "settingsPanel.group.generalSystem" } as ConfigField,
      { key: 'ragChunkSize', labelKey: 'settingsPanel.generalSystem.ragChunkSize.label', type: 'number', min: 100, max: 2000, step: 50, groupKey: "settingsPanel.group.generalSystem" } as ConfigField,
      { key: 'ragChunkOverlap', labelKey: 'settingsPanel.generalSystem.ragChunkOverlap.label', type: 'number', min: 0, max: 500, step: 10, groupKey: "settingsPanel.group.generalSystem" } as ConfigField,
      { key: 'ragMaxChunksToRetrieve', labelKey: 'settingsPanel.generalSystem.ragMaxChunksToRetrieve.label', type: 'number', min: 1, max: 10, step: 1, groupKey: "settingsPanel.group.generalSystem" } as ConfigField,
      { key: 'maxPadHistorySize', labelKey: 'settingsPanel.generalSystem.maxPadHistorySize.label', type: 'number', min: 50, max: 1000, step: 50, groupKey: "settingsPanel.group.generalSystem" } as ConfigField,

      // M.Y.R.A. Adaptive Fitness - Base Metric Weights
      ...Object.keys(INITIAL_CONFIG.adaptiveFitnessConfig.baseMetricWeights).map(subKey => ({
        key: subKey as keyof AdaptiveFitnessMetricWeights,
        parentKey: 'adaptiveFitnessConfig', 
        subKey: 'baseMetricWeights',
        labelKey: `settingsPanel.adaptiveFitnessBase.${subKey}.label`,
        type: 'number', step: 0.01, min: -1, max: 1,
        groupKey: "settingsPanel.group.adaptiveFitnessBase", // Corrected groupKey
      } as ConfigField)),
      // M.Y.R.A. Adaptive Fitness - Dimension Contribution Weights
      ...Object.keys(INITIAL_CONFIG.adaptiveFitnessConfig.dimensionContribWeights).flatMap(dimKey =>
          Object.keys(INITIAL_CONFIG.adaptiveFitnessConfig.dimensionContribWeights[dimKey as keyof MyraConfig['adaptiveFitnessConfig']['dimensionContribWeights']]).map(metricKey => ({
              key: `${dimKey}_${metricKey}`, originalMetricKey: metricKey,
              parentKey: 'adaptiveFitnessConfig', 
              subKey: dimKey as keyof MyraConfig['adaptiveFitnessConfig']['dimensionContribWeights'],
              subSubKey: 'dimensionContribWeights',
              labelKey: `settingsPanel.adaptiveFitnessDim.${dimKey}.${metricKey}.label`,
              type: 'number', step: 0.01, min: 0, max: 1,
              groupKey: "settingsPanel.group.adaptiveFitnessDim" // Corrected groupKey
          } as ConfigField))
      )
    ];
    // Dynamically add fields for configurable agents
    (myraConfig.configurableAgents || []).forEach((agent, index) => {
        const agentId = agent.id;
        const agentGroupKey = `settingsPanel.group.configurableAgent_${agentId}`;
        // const agentNameForLabel = agent.name || `Agent ${index + 1}`; // Not needed if using agent.name in title

        // Persona fields for this agent
        (Object.keys(agent) as Array<keyof Omit<ConfigurableAgentPersona, 'id' | 'aiProviderConfig' | 'systemConfig' | 'adaptiveFitnessConfig' >>)
        .filter(key => !['id', 'aiProviderConfig', 'systemConfig', 'adaptiveFitnessConfig'].includes(key))
        .forEach(propKey => {
            fields.push({
                agentId,
                configPath: ['configurableAgents', index, propKey],
                labelKey: `settingsPanel.configurableAgents.${propKey}.label`,
                type: propKey === 'roleDescription' || propKey === 'ethicsPrinciples' || propKey === 'responseInstruction' ? 'textarea' : 
                      propKey === 'personalityTrait' ? 'select' : 'text',
                options: propKey === 'personalityTrait' ? [
                    {value: 'critical', labelKey: 'settingsPanel.configurableAgents.traits.critical'},
                    {value: 'visionary', labelKey: 'settingsPanel.configurableAgents.traits.visionary'},
                    {value: 'conservative', labelKey: 'settingsPanel.configurableAgents.traits.conservative'},
                    {value: 'neutral', labelKey: 'settingsPanel.configurableAgents.traits.neutral'},
                ] : undefined,
                rows: propKey.includes('Description') || propKey.includes('Instruction') ? 3 : undefined,
                groupKey: agentGroupKey,
                subGroupKey: 'persona', // For internal grouping within agent's section
            } as AgentSpecificPersonaField);
        });
        
        // AI Provider fields for this agent
        (Object.keys(agent.aiProviderConfig) as Array<keyof AIProviderConfig>).forEach(propKey => {
            fields.push({
                agentId,
                configPath: ['configurableAgents', index, 'aiProviderConfig', propKey],
                labelKey: `settingsPanel.agentSpecific.${propKey}.label`,
                type: propKey === 'aiProvider' ? 'select' : (propKey === 'temperatureBase' ? 'number' : 'text'),
                options: propKey === 'aiProvider' ? [ { value: 'gemini', labelKey: 'settingsPanel.aiProvider.options.gemini' }, { value: 'lmstudio', labelKey: 'settingsPanel.aiProvider.options.lmstudio' } ] : undefined,
                condition: (config, agentCfg) => {
                    if (!agentCfg) return true;
                    if (propKey === 'geminiModelName') return agentCfg.aiProviderConfig.aiProvider === 'gemini';
                    if (propKey === 'lmStudioBaseUrl' || propKey === 'lmStudioGenerationModel' || propKey === 'lmStudioEmbeddingModel') return agentCfg.aiProviderConfig.aiProvider === 'lmstudio';
                    return true;
                },
                step: propKey === 'temperatureBase' ? 0.05 : undefined,
                min: propKey === 'temperatureBase' ? 0 : undefined,
                max: propKey === 'temperatureBase' ? 2 : undefined,
                groupKey: agentGroupKey,
                subGroupKey: 'aiProvider',
            } as AgentSpecificAIProviderField);
        });

        // System Config fields for this agent
        (Object.keys(agent.systemConfig) as Array<keyof AgentSystemCoreConfig>).forEach(propKey => {
            fields.push({
                agentId,
                configPath: ['configurableAgents', index, 'systemConfig', propKey],
                labelKey: `settingsPanel.agentSpecific.${propKey}.label`,
                type: propKey === 'rngType' ? 'select' : 'number',
                options: propKey === 'rngType' ? [ {value: 'subqg', labelKey: 'settingsPanel.rngType.options.subqg'}, {value: 'quantum', labelKey: 'settingsPanel.rngType.options.quantum'} ] : undefined,
                condition: (config, agentCfg) => {
                    if (!agentCfg) return true;
                    if (propKey === 'subqgSeed') return agentCfg.systemConfig.rngType === 'subqg';
                    return true;
                },
                placeholderKey: propKey === 'subqgSeed' ? 'settingsPanel.agentSpecific.subqgSeed.placeholder' : undefined,
                step: (propKey.includes('Decay') || propKey.includes('Coupling') || propKey.includes('Std') || propKey.includes('Factor') || propKey.includes('Energy') || propKey.includes('Strength')) ? 0.001 : 1,
                min: (propKey.includes('Decay')) ? 0.8 : (propKey === 'subqgSize' ? 4 : (propKey === 'adaptiveFitnessUpdateInterval' ? 1 :0)),
                max: (propKey.includes('Decay')) ? 1.0 : (propKey === 'subqgSize' ? 64 : (propKey === 'adaptiveFitnessUpdateInterval' ? 20 : undefined)),
                groupKey: agentGroupKey,
                subGroupKey: 'systemConfig',
            } as AgentSpecificSystemConfigField);
        });
        
        // Adaptive Fitness Base Weights for this agent
        (Object.keys(agent.adaptiveFitnessConfig.baseMetricWeights) as Array<keyof AdaptiveFitnessMetricWeights>).forEach(propKey => {
            fields.push({
                agentId,
                configPath: ['configurableAgents', index, 'adaptiveFitnessConfig', 'baseMetricWeights', propKey],
                labelKey: `settingsPanel.adaptiveFitnessBase.${propKey}.label`, // Uses global base keys for labels
                type: 'number', step: 0.01, min: -1, max: 1,
                groupKey: agentGroupKey,
                subGroupKey: 'adaptiveFitness',
            } as AgentSpecificAdaptiveFitnessBaseField);
        });
        // Placeholder for AgentSpecificAdaptiveFitnessDimensionField if needed in the future
    });


    return fields;
};


export const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, onConfigChange, t }) => {
  const [localConfig, setLocalConfig] = useState<MyraConfig>(config);
  const currentConfigFields = React.useMemo(() => getConfigFields(t, localConfig), [t, localConfig]);
  const [activeGroupKey, setActiveGroupKey] = useState<string | null>(null);
  const [expandedAgents, setExpandedAgents] = useState<Record<string, boolean>>({});

  const toggleAgentExpansion = (agentId: string) => {
    setExpandedAgents(prev => ({ ...prev, [agentId]: !prev[agentId] }));
  };

  const groupIcons: Record<string, React.ReactElement> = {
    "settingsPanel.group.localization": <LanguageIconComp className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-yellow-400" />,
    "settingsPanel.group.myraAI": <CloudIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-myra-primary" />,
    "settingsPanel.group.caelumAI": <CaelumAICPUChipIconComp className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-caelum-primary" />,
    "settingsPanel.group.configurableAgents": <UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-teal-400" />,
    "settingsPanel.group.myraPersona": <UserCircleIconComp className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-pink-400" />,
    "settingsPanel.group.caelumPersona": <UserCircleIconComp className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-rose-400" />,
    "settingsPanel.group.myraSystem": <SubQGIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-green-400" />,
    "settingsPanel.group.caelumSystem": <CaelumSystemIconComp className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-sky-400" />,
    "settingsPanel.group.generalSystem": <Cog6ToothIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-gray-400" />,
    "settingsPanel.group.adaptiveFitnessBase": <ChartPieIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-indigo-400" />, 
    "settingsPanel.group.adaptiveFitnessDim": <ChartPieIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-violet-400" />, 
  };
   (localConfig.configurableAgents || []).forEach(agent => {
      groupIcons[`settingsPanel.group.configurableAgent_${agent.id}`] = <UserCircleIconComp className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-lime-400" />;
  });


  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleInputChange = (
    field: ConfigField,
    value: string | number | boolean | undefined
  ) => {
    setLocalConfig(prevConfig => {
      const newConfig = JSON.parse(JSON.stringify(prevConfig)) as MyraConfig;
      const f = field as any; // To simplify access with type assertions

      if (f.configPath && Array.isArray(f.configPath)) {
        // Path for configurable agents: ['configurableAgents', index, 'propertyName', subKey?, subSubKey?]
        let current = newConfig as any;
        for (let i = 0; i < f.configPath.length - 1; i++) {
          current = current[f.configPath[i]];
          if (current === undefined) {
            console.error("Invalid path in config for field:", field);
            return newConfig; // or throw error
          }
        }
        current[f.configPath[f.configPath.length - 1]] = value;
      } else if (f.parentKey && f.subKey && f.subSubKey && f.originalMetricKey) { // MyraAdaptiveFitnessDimensionSubField
        (newConfig[f.parentKey as keyof MyraConfig] as any)[f.subSubKey][f.subKey][f.originalMetricKey] = value;
      } else if (f.parentKey && f.subKey) { // MyraAdaptiveFitnessBaseWeightsField
        (newConfig[f.parentKey as keyof MyraConfig] as any)[f.subKey][f.key] = value;
      } else if (f.parentKey) { // MyraAIProviderConfigField, CaelumAIProviderConfigField
        (newConfig[f.parentKey as keyof MyraConfig] as any)[f.key] = value;
      } else { // Top-level fields (MyraSystem, MyraPersona, etc.)
        if ('key' in f && f.key !== undefined) {
         (newConfig as any)[f.key as string] = value;
        } else {
          console.error("Error: field in handleInputChange does not have a 'key' property or key is undefined. Field:", field);
        }
      }
      return newConfig;
    });
  };
  
  const sanitizeSeed = (seed: any): number | undefined => {
      if (seed === undefined || seed === null || String(seed).trim() === '') {
          return undefined;
      }
      const num = Number(seed);
      return isNaN(num) ? undefined : num;
  };

  const handleSave = () => {
    const configToSave = JSON.parse(JSON.stringify(localConfig));
    
    configToSave.subqgSeed = sanitizeSeed(configToSave.subqgSeed);
    configToSave.caelumSubqgSeed = sanitizeSeed(configToSave.caelumSubqgSeed);

    if (configToSave.configurableAgents) {
      configToSave.configurableAgents.forEach((agent: ConfigurableAgentPersona) => {
        if(agent.systemConfig){
            agent.systemConfig.subqgSeed = sanitizeSeed(agent.systemConfig.subqgSeed);
        }
      });
    }
    onConfigChange(configToSave);
  };
  
  const handleAddAgent = () => {
    setLocalConfig(prevConfig => {
        const newAgentId = uuidv4();
        const newAgentName = `Agent ${ (prevConfig.configurableAgents || []).length + 1}`;
        const newAgent: ConfigurableAgentPersona = {
            id: newAgentId,
            name: newAgentName,
            roleDescription: "New agent role description.",
            ethicsPrinciples: "Basic ethical principles.",
            responseInstruction: "Respond thoughtfully.",
            personalityTrait: 'neutral',
            aiProviderConfig: JSON.parse(JSON.stringify(INITIAL_CONFIG.myraAIProviderConfig)),
            systemConfig: JSON.parse(JSON.stringify(INITIAL_CONFIG)), // Copy M.Y.R.A.'s system defaults
            adaptiveFitnessConfig: JSON.parse(JSON.stringify(INITIAL_ADAPTIVE_FITNESS_CONFIG)),
        };
        // Remove top-level M.Y.R.A./C.A.E.L.U.M. specific fields from the copied systemConfig
        const systemCoreKeys = Object.keys(INITIAL_CONFIG).filter(k => Object.keys(newAgent.systemConfig).includes(k as keyof AgentSystemCoreConfig));
        const cleanSystemConfig: Partial<AgentSystemCoreConfig> = {};
        systemCoreKeys.forEach(k => (cleanSystemConfig as any)[k] = (INITIAL_CONFIG as any)[k]);
        newAgent.systemConfig = cleanSystemConfig as AgentSystemCoreConfig;


        return {
            ...prevConfig,
            configurableAgents: [...(prevConfig.configurableAgents || []), newAgent]
        };
    });
  };

  const handleDeleteAgent = (agentId: string) => {
    const agentToDelete = localConfig.configurableAgents.find(a => a.id === agentId);
    if (agentToDelete && window.confirm(t('settingsPanel.configurableAgents.confirmDelete', { agentName: agentToDelete.name }))) {
        setLocalConfig(prevConfig => ({
            ...prevConfig,
            configurableAgents: prevConfig.configurableAgents.filter(agent => agent.id !== agentId)
        }));
    }
  };


  const personaEditableFieldKeys: Array<keyof MyraConfig | keyof ConfigurableAgentPersona> = [
    'myraName', 'myraRoleDescription', 'myraEthicsPrinciples', 'myraResponseInstruction', 'userName',
    'caelumName', 'caelumRoleDescription', 'caelumEthicsPrinciples', 'caelumResponseInstruction',
    'name', 'roleDescription', 'ethicsPrinciples', 'responseInstruction' // for configurable agents
  ];

  const personaKeyFieldMapping: Partial<Record<keyof MyraConfig, keyof MyraConfig>> = {
      'myraName': 'myraNameKey',
      'myraRoleDescription': 'myraRoleDescriptionKey',
      'myraEthicsPrinciples': 'myraEthicsPrinciplesKey',
      'myraResponseInstruction': 'myraResponseInstructionKey',
      'userName': 'userNameKey',
      'caelumName': 'caelumNameKey',
      'caelumRoleDescription': 'caelumRoleDescriptionKey',
      'caelumEthicsPrinciples': 'caelumEthicsPrinciplesKey',
      'caelumResponseInstruction': 'caelumResponseInstructionKey',
  };

  const handleResetGroup = (groupKeyToReset: string) => {
    setLocalConfig(prevConfig => {
        const newConfig = JSON.parse(JSON.stringify(prevConfig)) as MyraConfig;
        const initialSnapshotForLang = JSON.parse(JSON.stringify(INITIAL_CONFIG)) as MyraConfig;

        if (groupKeyToReset.startsWith("settingsPanel.group.configurableAgent_")) {
            const agentId = groupKeyToReset.split("_")[1];
            const agentIndex = newConfig.configurableAgents.findIndex(a => a.id === agentId);
            if (agentIndex !== -1) {
                const initialAgentTemplate = INITIAL_CONFIG.configurableAgents.find(a => a.name.startsWith(newConfig.configurableAgents[agentIndex].name.split(" ")[0])) // Match by first name part for default reset
                                            || JSON.parse(JSON.stringify(INITIAL_CONFIG.configurableAgents[0])); // Fallback to first default agent

                // Reset only the specific agent's full config
                newConfig.configurableAgents[agentIndex] = {
                    ...newConfig.configurableAgents[agentIndex], // Keep ID and Name, persona fields
                    aiProviderConfig: JSON.parse(JSON.stringify(initialAgentTemplate.aiProviderConfig)),
                    systemConfig: JSON.parse(JSON.stringify(initialAgentTemplate.systemConfig)),
                    adaptiveFitnessConfig: JSON.parse(JSON.stringify(initialAgentTemplate.adaptiveFitnessConfig)),
                };
                 if (newConfig.configurableAgents[agentIndex].systemConfig) {
                    newConfig.configurableAgents[agentIndex].systemConfig.subqgSeed = sanitizeSeed(newConfig.configurableAgents[agentIndex].systemConfig.subqgSeed);
                 }
            }
        } else {
            currentConfigFields.filter(field => field.groupKey === groupKeyToReset).forEach(field => {
                const f = field as any; 
                if (personaEditableFieldKeys.includes(f.key as keyof MyraConfig)) {
                    (newConfig as any)[f.key] = "";
                    const actualKeyField = personaKeyFieldMapping[f.key as keyof MyraConfig];
                    if (actualKeyField) { (newConfig as any)[actualKeyField] = (initialSnapshotForLang as any)[actualKeyField]; }
                } else if (['language', 'theme', 'maxPadHistorySize', 'activeChatAgent'].includes(f.key)) {
                     (newConfig as any)[f.key] = (INITIAL_CONFIG as any)[f.key];
                } else if (f.parentKey && f.subKey && f.subSubKey && f.originalMetricKey) { // Myra AdaptiveFitnessDimensionSubField
                    (newConfig[f.parentKey as keyof MyraConfig] as any)[f.subSubKey][f.subKey][f.originalMetricKey as string] =
                    (initialSnapshotForLang[f.parentKey as keyof MyraConfig] as any)[f.subSubKey][f.subKey][f.originalMetricKey as string];
                } else if (f.parentKey && f.subKey) { // Myra AdaptiveFitnessBaseWeightsField
                    (newConfig[f.parentKey as keyof MyraConfig] as any)[f.subKey][f.key as string] =
                    (initialSnapshotForLang[f.parentKey as keyof MyraConfig]as any)[f.subKey][f.key as string];
                } else if (f.parentKey) { // Myra/Caelum AIProviderConfigField
                    (newConfig[f.parentKey as keyof MyraConfig] as any)[f.key as string] =
                    (initialSnapshotForLang[f.parentKey as keyof MyraConfig] as any)[f.key as string];
                } else {
                    if ('key' in f && f.key !== undefined && typeof (INITIAL_CONFIG as any)[f.key as string] !== 'undefined') {
                        (newConfig as any)[f.key as string] = (INITIAL_CONFIG as any)[f.key as string];
                         if (String(f.key).toLowerCase().includes('seed')) {
                           (newConfig as any)[f.key as string] = sanitizeSeed((newConfig as any)[f.key as string]);
                         }
                    } else {
                         console.error("Error: field in handleResetGroup (non-agent) missing key or initial config. Field:", field);
                    }
                }
            });
        }
        return newConfig;
    });
  };

  const handleResetAll = () => {
    const currentLang = localConfig.language;
    const currentTheme = localConfig.theme;
    let fullyResetConfig = JSON.parse(JSON.stringify(INITIAL_CONFIG)) as MyraConfig;

    personaEditableFieldKeys.forEach(key => {
        if ((INITIAL_CONFIG as any)[key as string] !== undefined) { // Only reset top-level persona fields for MYRA/CAELUM
            (fullyResetConfig as any)[key] = "";
        }
    });
    // Preserve existing IDs for configurable agents but reset their content to defaults
    const defaultAgentsCopy = JSON.parse(JSON.stringify(INITIAL_CONFIG.configurableAgents));
    fullyResetConfig.configurableAgents = localConfig.configurableAgents.map((agent, index) => {
       const templateAgent = defaultAgentsCopy[index % defaultAgentsCopy.length];
       if (templateAgent.systemConfig) {
           templateAgent.systemConfig.subqgSeed = sanitizeSeed(templateAgent.systemConfig.subqgSeed);
       }
        return {
        ...templateAgent, 
        id: agent.id, // Keep existing ID
        name: agent.name // Keep existing name or reset to a default pattern
        }
    });

    fullyResetConfig.subqgSeed = sanitizeSeed(fullyResetConfig.subqgSeed);
    fullyResetConfig.caelumSubqgSeed = sanitizeSeed(fullyResetConfig.caelumSubqgSeed);

    fullyResetConfig.language = currentLang;
    fullyResetConfig.theme = currentTheme;
    setLocalConfig(fullyResetConfig);
  };

  const renderField = (field: ConfigField, agentConfig?: ConfigurableAgentPersona) => {
    if (field.condition && !field.condition(localConfig, agentConfig)) {
      return null;
    }

    let currentValue: any;
    const f = field as any;
    let fieldIdPrefix = '';

    if (f.configPath && Array.isArray(f.configPath) && agentConfig) {
        // ['configurableAgents', index, 'propertyName', subKey?, subSubKey?]
        let current = agentConfig as any;
        for (let i = 2; i < f.configPath.length; i++) { // Start from 'propertyName'
            current = current?.[f.configPath[i]];
        }
        currentValue = current;
        fieldIdPrefix = `${agentConfig.id}_${f.configPath.slice(2).join('_')}_`;
    } else if (f.parentKey && f.subKey && f.subSubKey && f.originalMetricKey) {
        currentValue = (localConfig[f.parentKey as keyof MyraConfig] as any)?.[f.subSubKey]?.[f.subKey]?.[f.originalMetricKey];
    } else if (f.parentKey && f.subKey) {
      currentValue = (localConfig[f.parentKey as keyof MyraConfig] as any)?.[f.subKey]?.[f.key];
    } else if (f.parentKey) {
      currentValue = (localConfig[f.parentKey as keyof MyraConfig] as any)?.[f.key];
    } else {
      currentValue = localConfig[f.key as keyof MyraConfig];
    }
    
    const uniqueKey = fieldIdPrefix + (f.key || f.configPath?.join('_') || field.labelKey);

    if (field.type === 'number' && (currentValue === undefined || currentValue === null) && (uniqueKey.toLowerCase().includes('seed'))) {
        currentValue = ''; // Display empty string for undefined/null seed numbers in input
    } else if (currentValue === undefined || currentValue === null) {
        currentValue = '';
    }
    
    const commonInputClass = "w-full p-2 text-sm bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-150 ease-in-out text-gray-100 placeholder-gray-400";
    const commonLabelClass = "block text-sm font-medium text-gray-300 mb-1";

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <div key={uniqueKey} className="mb-4">
            <label htmlFor={uniqueKey} className={commonLabelClass}>{t(field.labelKey)}</label>
            <input
              type={field.type} id={uniqueKey} name={uniqueKey}
              value={currentValue as string | number}
              onChange={e => handleInputChange( field, field.type === 'number' ? (e.target.value === '' && (uniqueKey.toLowerCase().includes('seed')) ? undefined : parseFloat(e.target.value)) : e.target.value )}
              step={field.step} min={field.min} max={field.max}
              placeholder={field.placeholderKey ? t(field.placeholderKey) : undefined}
              className={commonInputClass} />
          </div>
        );
      case 'textarea':
        return (
          <div key={uniqueKey} className="mb-4">
            <label htmlFor={uniqueKey} className={commonLabelClass}>{t(field.labelKey)}</label>
            <textarea id={uniqueKey} name={uniqueKey} value={currentValue as string}
              onChange={e => handleInputChange(field, e.target.value)}
              rows={field.rows || 3} className={commonInputClass} />
          </div>
        );
      case 'select':
        let options = field.options;
        if ((f.key === 'activeChatAgent' || f.configPath?.includes('activeChatAgent')) ) {
            options = [ { value: 'myra', labelKey: localConfig.myraName || t('settingsPanel.generalSystem.activeChatAgent.options.myra') }, { value: 'caelum', labelKey: localConfig.caelumName || t('settingsPanel.generalSystem.activeChatAgent.options.caelum') } ];
        }
        return (
          <div key={uniqueKey} className="mb-4">
            <label htmlFor={uniqueKey} className={commonLabelClass}>{t(field.labelKey)}</label>
            <select id={uniqueKey} name={uniqueKey} value={currentValue as string}
              onChange={e => handleInputChange(field, e.target.value)}
              className={commonInputClass} >
              {options?.map(option => (
                <option key={option.value} value={option.value}>
                    { (f.key === 'activeChatAgent' || f.configPath?.includes('activeChatAgent')) ? option.labelKey : t(option.labelKey)}
                </option>
              ))}
            </select>
          </div>
        );
      default: return null;
    }
  };


  const renderConfigurableAgentSection = (agent: ConfigurableAgentPersona, agentIndex: number) => {
    const agentFields = currentConfigFields.filter(f => (f as any).agentId === agent.id);
    const agentSubGroups: Record<string, ConfigField[]> = {};
    agentFields.forEach(field => {
        const subGroup = (field as any).subGroupKey || 'persona'; // Default to persona if no subgroup
        if (!agentSubGroups[subGroup]) agentSubGroups[subGroup] = [];
        agentSubGroups[subGroup].push(field);
    });
    
    const orderedSubGroupKeys = ['persona', 'aiProvider', 'systemConfig', 'adaptiveFitness'].filter(key => agentSubGroups[key]);

    return (
      <div key={agent.id} className="mb-4 p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
        <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleAgentExpansion(agent.id)}>
          <h4 className="text-md font-semibold text-lime-400 flex items-center">
            {expandedAgents[agent.id] ? <ChevronDownIcon className="w-5 h-5 mr-2"/> : <ChevronRightIcon className="w-5 h-5 mr-2"/>}
            {agent.name || t('settingsPanel.configurableAgents.agentName.label')}
          </h4>
          <button
            onClick={(e) => { e.stopPropagation(); handleDeleteAgent(agent.id); }}
            className="p-1 text-red-400 hover:text-red-300"
            title={t('settingsPanel.button.deleteAgent')}
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
        {expandedAgents[agent.id] && (
          <div className="pl-4 border-l-2 border-gray-600 space-y-4">
            {orderedSubGroupKeys.map(subGroupKey => (
                <div key={subGroupKey} className="mt-3">
                    <h5 className="text-sm font-semibold text-purple-400 mb-2 border-b border-gray-600 pb-1">
                        {t(`settingsPanel.configurableAgents.${subGroupKey}.title`)}
                    </h5>
                    {agentSubGroups[subGroupKey]?.map(field => renderField(field, agent))}
                </div>
            ))}
          </div>
        )}
      </div>
    );
  };


  const groupedFields = useMemo(() => {
    const groups: Record<string, ConfigField[]> = {};
    // Filter out agent-specific fields from top-level grouping
    currentConfigFields.filter(f => !(f as any).agentId).forEach(field => {
      if (!groups[field.groupKey]) groups[field.groupKey] = [];
      groups[field.groupKey].push(field);
    });
    return groups;
  }, [currentConfigFields]);

  const orderedGroupKeys = useMemo(() => {
    const order = [
        "settingsPanel.group.localization",
        "settingsPanel.group.myraAI", "settingsPanel.group.caelumAI",
        "settingsPanel.group.myraPersona", "settingsPanel.group.caelumPersona",
        "settingsPanel.group.myraSystem", "settingsPanel.group.caelumSystem",
        "settingsPanel.group.generalSystem",
        "settingsPanel.group.adaptiveFitnessBase", // Corrected key for M.Y.R.A.
        "settingsPanel.group.adaptiveFitnessDim",  // Corrected key for M.Y.R.A.
        "settingsPanel.group.configurableAgents" 
    ];
    const existingKeys = Object.keys(groupedFields);
    if (!existingKeys.includes("settingsPanel.group.configurableAgents") && (localConfig.configurableAgents?.length ?? 0) > 0) {
         existingKeys.push("settingsPanel.group.configurableAgents");
    }

    const ordered = order.filter(key => existingKeys.includes(key));
    const unordered = existingKeys.filter(key => !order.includes(key)).sort();

    if (!activeGroupKey && ordered.length > 0) {
        setActiveGroupKey(ordered[0]);
    } else if (!activeGroupKey && unordered.length > 0) {
        setActiveGroupKey(unordered[0]);
    }
    return [...ordered, ...unordered];
  }, [groupedFields, activeGroupKey, localConfig.configurableAgents]);


  useEffect(() => {
    if (!activeGroupKey && orderedGroupKeys.length > 0) {
      setActiveGroupKey(orderedGroupKeys[0]);
    }
  }, [activeGroupKey, orderedGroupKeys]);

  return (
    <div className="p-2 sm:p-3 bg-gray-700/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-600 h-full flex flex-col overflow-hidden">
      <div className="mb-3 sm:mb-4 pb-3 border-b border-gray-600 sticky top-0 bg-gray-700/50 z-10 px-1">
        <h3 className="text-lg sm:text-xl font-semibold text-purple-300 text-center sm:text-left">{t('settingsPanel.title')}</h3>
      </div>
      <div className="flex justify-center sm:justify-end space-x-2 mb-3 sm:mb-4 px-1">
            <button onClick={handleResetAll} className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150" title={t('settingsPanel.button.resetAllTooltip')} aria-label={t('settingsPanel.button.resetAllTooltip')} >
              {t('settingsPanel.button.resetAll')} </button>
            <button onClick={handleSave} className="px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-150" aria-label={t('settingsPanel.button.saveChanges')} >
              {t('settingsPanel.button.saveChanges')} </button>
      </div>

      <div className="flex flex-1 overflow-hidden space-x-2 sm:space-x-3">
        <nav className="w-1/3 md:w-1/4 space-y-1.5 overflow-y-auto fancy-scrollbar pr-1 sm:pr-2 py-1">
          {orderedGroupKeys.map(groupKey => (
            <button key={groupKey} onClick={() => setActiveGroupKey(groupKey)}
              className={`w-full flex items-center text-left px-2 py-2 sm:px-3 sm:py-2.5 rounded-md text-xs sm:text-sm transition-colors duration-150
                ${activeGroupKey === groupKey ? 'bg-purple-600 text-white font-semibold shadow-md' : 'text-gray-300 hover:bg-gray-600/70 hover:text-white bg-gray-700' }`}
              role="tab" aria-selected={activeGroupKey === groupKey} aria-controls={`settings-group-panel-${groupKey}`} >
              {groupIcons[groupKey] || <AdjustmentsVerticalIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
              <span className="truncate">{t(groupKey)}</span>
            </button>
          ))}
        </nav>

        <main className="w-2/3 md:w-3/4 overflow-y-auto fancy-scrollbar py-1">
          {orderedGroupKeys.map(groupKey => (
            <section key={groupKey} id={`settings-group-panel-${groupKey}`} role="tabpanel"
              aria-labelledby={`settings-group-tab-${groupKey}`} className={`${activeGroupKey === groupKey ? 'block' : 'hidden'}`} >
              <div className="bg-gray-800/30 p-3 sm:p-4 rounded-lg shadow-inner border border-gray-600/50">
                  <div className="flex justify-between items-center mb-3 sm:mb-4 pb-2 border-b border-gray-600">
                    <h4 className="text-md sm:text-lg font-semibold text-purple-400 flex items-center">
                      {groupIcons[groupKey] || <AdjustmentsVerticalIcon className="w-5 h-5 mr-2" />}
                      {t(groupKey)}
                    </h4>
                   {groupKey !== "settingsPanel.group.configurableAgents" && (
                        <button onClick={() => handleResetGroup(groupKey)}
                            className="px-2 py-1 text-xs bg-red-700 text-white rounded-md hover:bg-red-800 transition duration-150"
                            title={t('settingsPanel.button.resetGroupTooltip', { groupName: t(groupKey) })}
                            aria-label={t('settingsPanel.button.resetGroupTooltip', { groupName: t(groupKey) })}>
                            {t('settingsPanel.button.resetGroup')}
                        </button>
                    )}
                  </div>
                  {groupKey === "settingsPanel.group.configurableAgents" ? (
                    <>
                      {(localConfig.configurableAgents || []).map((agent, index) => renderConfigurableAgentSection(agent, index))}
                      <button onClick={handleAddAgent} className="mt-4 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 flex items-center">
                        <PlusCircleIcon className="w-5 h-5 mr-2"/> {t('settingsPanel.button.addAgent')}
                      </button>
                    </>
                  ) : (groupedFields[groupKey]?.map(field => renderField(field)))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

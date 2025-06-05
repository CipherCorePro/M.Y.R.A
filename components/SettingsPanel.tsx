
import React, { useState, useEffect, useMemo } from 'react';
import {
    MyraConfig,
    AdaptiveFitnessMetricWeights,
    MyraSystemConfigField,
    MyraPersonaEditableField,
    CaelumPersonaEditableField,
    CaelumSystemConfigField,
    AdaptiveFitnessBaseWeightsField,
    AdaptiveFitnessDimensionSubField,
    MyraAIProviderConfigField,
    CaelumAIProviderConfigField,
    ConfigField,
    LocalizationConfigField,
    GeneralSystemConfigField,
    Language,
    Theme
} from '../types';
import { Cog6ToothIcon, ServerIcon, CloudIcon, BeakerIcon as SubQGIcon, BookOpenIcon, ChartPieIcon, CpuChipIcon as CaelumAICPUChipIconActual, AdjustmentsVerticalIcon, LanguageIcon as LanguageIconActual, PaintBrushIcon as PaintBrushIconActual, UserCircleIcon as UserCircleIconActual } from './IconComponents';
import { INITIAL_CONFIG } from '../constants';

interface SettingsPanelProps {
  config: MyraConfig;
  onConfigChange: (newConfig: Partial<MyraConfig>) => void;
  t: (key: string, substitutions?: Record<string, string>) => string;
}

// Use actual imported icons
const UserCircleIcon: React.FC<{className?: string}> = UserCircleIconActual;
const LanguageIcon: React.FC<{className?: string}> = LanguageIconActual;
const PaintBrushIcon: React.FC<{className?: string}> = PaintBrushIconActual;
const CaelumAICPUChipIcon: React.FC<{className?: string}> = CaelumAICPUChipIconActual;
const CaelumSystemIcon: React.FC<{className?: string}> = AdjustmentsVerticalIcon;


const getConfigFields = (t: SettingsPanelProps['t'], myraConfig: MyraConfig): ConfigField[] => [
  // Localization Group
  { key: 'language', labelKey: 'settingsPanel.language.label', type: 'select', options: [ { value: 'de', labelKey: 'settingsPanel.language.options.de' }, { value: 'en', labelKey: 'settingsPanel.language.options.en' } ], groupKey: "settingsPanel.group.localization" } as LocalizationConfigField,
  { key: 'theme', labelKey: 'settingsPanel.theme.label', type: 'select', options: [ { value: 'nebula', labelKey: 'settingsPanel.theme.options.nebula' }, { value: 'biosphere', labelKey: 'settingsPanel.theme.options.biosphere' }, { value: 'matrix', labelKey: 'settingsPanel.theme.options.matrix' } ], groupKey: "settingsPanel.group.localization" } as LocalizationConfigField,

  // M.Y.R.A. AI Provider Group
  { key: 'aiProvider', parentKey: 'myraAIProviderConfig', labelKey: 'settingsPanel.myraAI.aiProvider.label', type: 'select', options: [ { value: 'gemini', labelKey: 'settingsPanel.aiProvider.options.gemini' }, { value: 'lmstudio', labelKey: 'settingsPanel.aiProvider.options.lmstudio' } ], groupKey: "settingsPanel.group.myraAI" } as MyraAIProviderConfigField,
  { key: 'geminiModelName', parentKey: 'myraAIProviderConfig', labelKey: 'settingsPanel.myraAI.geminiModelName.label', type: 'text', condition: config => config.myraAIProviderConfig.aiProvider === 'gemini', groupKey: "settingsPanel.group.myraAI" } as MyraAIProviderConfigField,
  { key: 'lmStudioBaseUrl', parentKey: 'myraAIProviderConfig', labelKey: 'settingsPanel.myraAI.lmStudioBaseUrl.label', type: 'text', condition: config => config.myraAIProviderConfig.aiProvider === 'lmstudio', groupKey: "settingsPanel.group.myraAI" } as MyraAIProviderConfigField,
  { key: 'lmStudioGenerationModel', parentKey: 'myraAIProviderConfig', labelKey: 'settingsPanel.myraAI.lmStudioGenerationModel.label', type: 'text', condition: config => config.myraAIProviderConfig.aiProvider === 'lmstudio', groupKey: "settingsPanel.group.myraAI" } as MyraAIProviderConfigField,
  { key: 'temperatureBase', parentKey: 'myraAIProviderConfig', labelKey: 'settingsPanel.myraAI.temperatureBase.label', type: 'number', step: 0.05, min: 0, max: 2.0, groupKey: "settingsPanel.group.myraAI" } as MyraAIProviderConfigField,

  // C.A.E.L.U.M. AI Provider Group
  { key: 'aiProvider', parentKey: 'caelumAIProviderConfig', labelKey: 'settingsPanel.caelumAI.aiProvider.label', type: 'select', options: [ { value: 'gemini', labelKey: 'settingsPanel.aiProvider.options.gemini' }, { value: 'lmstudio', labelKey: 'settingsPanel.aiProvider.options.lmstudio' } ], groupKey: "settingsPanel.group.caelumAI" } as CaelumAIProviderConfigField,
  { key: 'geminiModelName', parentKey: 'caelumAIProviderConfig', labelKey: 'settingsPanel.caelumAI.geminiModelName.label', type: 'text', condition: config => config.caelumAIProviderConfig.aiProvider === 'gemini', groupKey: "settingsPanel.group.caelumAI" } as CaelumAIProviderConfigField,
  { key: 'lmStudioBaseUrl', parentKey: 'caelumAIProviderConfig', labelKey: 'settingsPanel.caelumAI.lmStudioBaseUrl.label', type: 'text', condition: config => config.caelumAIProviderConfig.aiProvider === 'lmstudio', groupKey: "settingsPanel.group.caelumAI" } as CaelumAIProviderConfigField,
  { key: 'lmStudioGenerationModel', parentKey: 'caelumAIProviderConfig', labelKey: 'settingsPanel.caelumAI.lmStudioGenerationModel.label', type: 'text', condition: config => config.caelumAIProviderConfig.aiProvider === 'lmstudio', groupKey: "settingsPanel.group.caelumAI" } as CaelumAIProviderConfigField,
  { key: 'temperatureBase', parentKey: 'caelumAIProviderConfig', labelKey: 'settingsPanel.caelumAI.temperatureBase.label', type: 'number', step: 0.05, min: 0, max: 2.0, groupKey: "settingsPanel.group.caelumAI" } as CaelumAIProviderConfigField,

  // Myra Persona Group (editing translated values directly)
  { key: 'myraName', labelKey: 'settingsPanel.myraPersona.name.label', type: 'text', groupKey: "settingsPanel.group.myraPersona" } as MyraPersonaEditableField,
  { key: 'userName', labelKey: 'settingsPanel.myraPersona.userName.label', type: 'text', groupKey: "settingsPanel.group.myraPersona" } as MyraPersonaEditableField,
  { key: 'myraRoleDescription', labelKey: 'settingsPanel.myraPersona.roleDescription.label', type: 'textarea', rows: 3, groupKey: "settingsPanel.group.myraPersona" } as MyraPersonaEditableField,
  { key: 'myraEthicsPrinciples', labelKey: 'settingsPanel.myraPersona.ethicsPrinciples.label', type: 'textarea', rows: 3, groupKey: "settingsPanel.group.myraPersona" } as MyraPersonaEditableField,
  { key: 'myraResponseInstruction', labelKey: 'settingsPanel.myraPersona.responseInstruction.label', type: 'textarea', rows: 4, groupKey: "settingsPanel.group.myraPersona" } as MyraPersonaEditableField,

  // Caelum Persona Group (editing translated values directly)
  { key: 'caelumName', labelKey: 'settingsPanel.caelumPersona.name.label', type: 'text', groupKey: "settingsPanel.group.caelumPersona" } as CaelumPersonaEditableField,
  { key: 'caelumRoleDescription', labelKey: 'settingsPanel.caelumPersona.roleDescription.label', type: 'textarea', rows: 3, groupKey: "settingsPanel.group.caelumPersona" } as CaelumPersonaEditableField,
  { key: 'caelumEthicsPrinciples', labelKey: 'settingsPanel.caelumPersona.ethicsPrinciples.label', type: 'textarea', rows: 3, groupKey: "settingsPanel.group.caelumPersona" } as CaelumPersonaEditableField,
  { key: 'caelumResponseInstruction', labelKey: 'settingsPanel.caelumPersona.responseInstruction.label', type: 'textarea', rows: 4, groupKey: "settingsPanel.group.caelumPersona" } as CaelumPersonaEditableField,

  // M.Y.R.A. System Group
  { key: 'subqgSize', labelKey: 'settingsPanel.myraSystem.subqgSize.label', type: 'number', min: 4, max: 64, step: 1, groupKey: "settingsPanel.group.myraSystem" } as MyraSystemConfigField,
  { key: 'subqgBaseEnergy', labelKey: 'settingsPanel.myraSystem.subqgBaseEnergy.label', type: 'number', min: 0, max: 0.1, step: 0.001, groupKey: "settingsPanel.group.myraSystem" } as MyraSystemConfigField,
  { key: 'subqgCoupling', labelKey: 'settingsPanel.myraSystem.subqgCoupling.label', type: 'number', min: 0, max: 0.1, step: 0.001, groupKey: "settingsPanel.group.myraSystem" } as MyraSystemConfigField,
  { key: 'subqgInitialEnergyNoiseStd', labelKey: 'settingsPanel.myraSystem.subqgInitialEnergyNoiseStd.label', type: 'number', min: 0, max: 0.01, step: 0.0001, groupKey: "settingsPanel.group.myraSystem" } as MyraSystemConfigField,
  { key: 'rngType', labelKey: 'settingsPanel.myraSystem.rngType.label', type: 'select', options: [ {value: 'subqg', labelKey: 'settingsPanel.rngType.options.subqg'}, {value: 'quantum', labelKey: 'settingsPanel.rngType.options.quantum'} ], groupKey: "settingsPanel.group.myraSystem" } as MyraSystemConfigField,
  { key: 'subqgSeed', labelKey: 'settingsPanel.myraSystem.subqgSeed.label', type: 'number', condition: config => config.rngType === 'subqg', placeholderKey: 'settingsPanel.myraSystem.subqgSeed.placeholder', groupKey: "settingsPanel.group.myraSystem" } as MyraSystemConfigField,
  { key: 'nodeActivationDecay', labelKey: 'settingsPanel.myraSystem.nodeActivationDecay.label', type: 'number', min: 0.8, max: 1.0, step: 0.005, groupKey: "settingsPanel.group.myraSystem" } as MyraSystemConfigField,
  { key: 'emotionDecay', labelKey: 'settingsPanel.myraSystem.emotionDecay.label', type: 'number', min: 0.8, max: 1.0, step: 0.005, groupKey: "settingsPanel.group.myraSystem" } as MyraSystemConfigField,
  { key: 'adaptiveFitnessUpdateInterval', labelKey: 'settingsPanel.myraSystem.adaptiveFitnessUpdateInterval.label', type: 'number', min: 1, max: 20, step: 1, groupKey: "settingsPanel.group.myraSystem" } as MyraSystemConfigField,

  // C.A.E.L.U.M. System Group
  { key: 'caelumSubqgSize', labelKey: 'settingsPanel.caelumSystem.subqgSize.label', type: 'number', min: 4, max: 64, step: 1, groupKey: "settingsPanel.group.caelumSystem" } as CaelumSystemConfigField,
  { key: 'caelumSubqgBaseEnergy', labelKey: 'settingsPanel.caelumSystem.subqgBaseEnergy.label', type: 'number', min: 0, max: 0.1, step: 0.001, groupKey: "settingsPanel.group.caelumSystem" } as CaelumSystemConfigField,
  { key: 'caelumRngType', labelKey: 'settingsPanel.caelumSystem.rngType.label', type: 'select', options: [ {value: 'subqg', labelKey: 'settingsPanel.rngType.options.subqg'}, {value: 'quantum', labelKey: 'settingsPanel.rngType.options.quantum'} ], groupKey: "settingsPanel.group.caelumSystem" } as CaelumSystemConfigField,
  { key: 'caelumSubqgSeed', labelKey: 'settingsPanel.caelumSystem.subqgSeed.label', type: 'number', condition: config => config.caelumRngType === 'subqg', placeholderKey: 'settingsPanel.caelumSystem.subqgSeed.placeholder', groupKey: "settingsPanel.group.caelumSystem" } as CaelumSystemConfigField,
  { key: 'caelumNodeActivationDecay', labelKey: 'settingsPanel.caelumSystem.nodeActivationDecay.label', type: 'number', min: 0.8, max: 1.0, step: 0.005, groupKey: "settingsPanel.group.caelumSystem" } as CaelumSystemConfigField,
  { key: 'caelumEmotionDecay', labelKey: 'settingsPanel.caelumSystem.emotionDecay.label', type: 'number', min: 0.8, max: 1.0, step: 0.005, groupKey: "settingsPanel.group.caelumSystem" } as CaelumSystemConfigField,
  { key: 'caelumAdaptiveFitnessUpdateInterval', labelKey: 'settingsPanel.caelumSystem.adaptiveFitnessUpdateInterval.label', type: 'number', min: 1, max: 20, step: 1, groupKey: "settingsPanel.group.caelumSystem" } as CaelumSystemConfigField,

  // General System Group
  { key: 'activeChatAgent', labelKey: 'settingsPanel.generalSystem.activeChatAgent.label', type: 'select', options: [ {value: 'myra', labelKey: myraConfig.myraName || t('settingsPanel.generalSystem.activeChatAgent.options.myra')}, {value: 'caelum', labelKey: myraConfig.caelumName || t('settingsPanel.generalSystem.activeChatAgent.options.caelum')} ], groupKey: "settingsPanel.group.generalSystem" } as GeneralSystemConfigField,
  { key: 'maxHistoryMessagesForPrompt', labelKey: 'settingsPanel.generalSystem.maxHistoryMessagesForPrompt.label', type: 'number', min: 0, max: 20, step: 1, groupKey: "settingsPanel.group.generalSystem" } as GeneralSystemConfigField,
  { key: 'temperatureLimbusInfluence', labelKey: 'settingsPanel.generalSystem.temperatureLimbusInfluence.label', type: 'number', min: -0.5, max: 0.5, step: 0.01, groupKey: "settingsPanel.group.generalSystem" } as GeneralSystemConfigField,
  { key: 'temperatureCreativusInfluence', labelKey: 'settingsPanel.generalSystem.temperatureCreativusInfluence.label', type: 'number', min: -0.5, max: 0.5, step: 0.01, groupKey: "settingsPanel.group.generalSystem" } as GeneralSystemConfigField,
  { key: 'ragChunkSize', labelKey: 'settingsPanel.generalSystem.ragChunkSize.label', type: 'number', min: 100, max: 2000, step: 50, groupKey: "settingsPanel.group.generalSystem" } as GeneralSystemConfigField,
  { key: 'ragChunkOverlap', labelKey: 'settingsPanel.generalSystem.ragChunkOverlap.label', type: 'number', min: 0, max: 500, step: 10, groupKey: "settingsPanel.group.generalSystem" } as GeneralSystemConfigField,
  { key: 'ragMaxChunksToRetrieve', labelKey: 'settingsPanel.generalSystem.ragMaxChunksToRetrieve.label', type: 'number', min: 1, max: 10, step: 1, groupKey: "settingsPanel.group.generalSystem" } as GeneralSystemConfigField,
  { key: 'maxPadHistorySize', labelKey: 'settingsPanel.generalSystem.maxPadHistorySize.label', type: 'number', min: 50, max: 1000, step: 50, groupKey: "settingsPanel.group.generalSystem" } as GeneralSystemConfigField,

  // Adaptive Fitness - Base Metric Weights
  ...Object.keys(INITIAL_CONFIG.adaptiveFitnessConfig.baseMetricWeights).map(subKey => ({
    key: subKey as keyof AdaptiveFitnessMetricWeights,
    parentKey: 'adaptiveFitnessConfig',
    subKey: 'baseMetricWeights',
    labelKey: `settingsPanel.adaptiveFitnessBase.${subKey}.label`,
    type: 'number',
    step: 0.01,
    min: -1,
    max: 1,
    groupKey: "settingsPanel.group.adaptiveFitnessBase",
  } as AdaptiveFitnessBaseWeightsField)),

  // Adaptive Fitness - Dimension Contribution Weights
  ...Object.keys(INITIAL_CONFIG.adaptiveFitnessConfig.dimensionContribWeights).flatMap(dimKey =>
      Object.keys(INITIAL_CONFIG.adaptiveFitnessConfig.dimensionContribWeights[dimKey as keyof MyraConfig['adaptiveFitnessConfig']['dimensionContribWeights']]).map(metricKey => ({
          key: metricKey,
          parentKey: 'adaptiveFitnessConfig',
          subKey: dimKey as keyof MyraConfig['adaptiveFitnessConfig']['dimensionContribWeights'],
          subSubKey: 'dimensionContribWeights',
          labelKey: `settingsPanel.adaptiveFitnessDim.${dimKey}.${metricKey}.label`,
          type: 'number',
          step: 0.01,
          min: 0,
          max: 1,
          groupKey: "settingsPanel.group.adaptiveFitnessDim"
      } as AdaptiveFitnessDimensionSubField))
  )
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, onConfigChange, t }) => {
  const [localConfig, setLocalConfig] = useState<MyraConfig>(config);
  const currentConfigFields = React.useMemo(() => getConfigFields(t, config), [t, config]); // Pass config to dynamically set options
  const [activeGroupKey, setActiveGroupKey] = useState<string | null>(currentConfigFields[0]?.groupKey || null);

  const groupIcons: Record<string, React.ReactElement> = {
    "settingsPanel.group.localization": <LanguageIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-yellow-400" />,
    "settingsPanel.group.myraAI": <CloudIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-myra-primary" />,
    "settingsPanel.group.caelumAI": <CaelumAICPUChipIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-caelum-primary" />,
    "settingsPanel.group.myraPersona": <UserCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-pink-400" />,
    "settingsPanel.group.caelumPersona": <UserCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-rose-400" />,
    "settingsPanel.group.myraSystem": <SubQGIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-green-400" />,
    "settingsPanel.group.caelumSystem": <CaelumSystemIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-teal-400" />,
    "settingsPanel.group.generalSystem": <Cog6ToothIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-gray-400" />,
    "settingsPanel.group.adaptiveFitnessBase": <ChartPieIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-indigo-400" />,
    "settingsPanel.group.adaptiveFitnessDim": <ChartPieIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-violet-400" />,
  };

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleInputChange = (
    key: string,
    value: string | number | boolean | undefined, // Allow undefined for optional seeds
    parentKey?: string,
    subKey?: string,
    subSubKey?: string
  ) => {
    setLocalConfig(prevConfig => {
      const newConfig = JSON.parse(JSON.stringify(prevConfig)) as MyraConfig;

      if (parentKey && subKey && subSubKey) {
        (newConfig[parentKey as keyof MyraConfig] as any)[subSubKey][subKey][key] = value;
      } else if (parentKey && subKey) {
        (newConfig[parentKey as keyof MyraConfig] as any)[subKey][key] = value;
      } else if (parentKey) {
        (newConfig[parentKey as keyof MyraConfig] as any)[key] = value;
      } else {
        (newConfig as any)[key] = value;
      }
      return newConfig;
    });
  };

  const handleSave = () => {
    const configToSave = JSON.parse(JSON.stringify(localConfig));

    const myraSeedValue = (configToSave.subqgSeed as any);
    configToSave.subqgSeed = myraSeedValue === '' || myraSeedValue === null || myraSeedValue === undefined || isNaN(parseFloat(myraSeedValue))
        ? undefined
        : parseFloat(myraSeedValue);

    const caelumSeedValue = (configToSave.caelumSubqgSeed as any);
    configToSave.caelumSubqgSeed = caelumSeedValue === '' || caelumSeedValue === null || caelumSeedValue === undefined || isNaN(parseFloat(caelumSeedValue))
        ? undefined
        : parseFloat(caelumSeedValue);

    onConfigChange(configToSave);
  };

  const personaEditableFieldKeys: Array<keyof MyraConfig> = [
    'myraName', 'myraRoleDescription', 'myraEthicsPrinciples', 'myraResponseInstruction', 'userName',
    'caelumName', 'caelumRoleDescription', 'caelumEthicsPrinciples', 'caelumResponseInstruction'
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
        
        currentConfigFields.filter(field => field.groupKey === groupKeyToReset).forEach(field => {
            const { key } = field as { key: keyof MyraConfig };

            if (personaEditableFieldKeys.includes(key)) {
                (newConfig as any)[key] = ""; 
                const actualKeyField = personaKeyFieldMapping[key];
                if (actualKeyField) {
                     (newConfig as any)[actualKeyField] = (initialSnapshotForLang as any)[actualKeyField];
                }
            } else if (key === 'language' || key === 'theme' || key === 'maxPadHistorySize' || key === 'activeChatAgent') { 
                 (newConfig as any)[key] = (INITIAL_CONFIG as any)[key];
            } else if ('parentKey' in field && field.parentKey && 'subKey' in field && field.subKey && 'subSubKey' in field && field.subSubKey) {
                 (newConfig[field.parentKey as keyof MyraConfig] as any)[field.subSubKey][field.subKey][field.key as string] =
                 (initialSnapshotForLang[field.parentKey as keyof MyraConfig] as any)[field.subSubKey][field.subKey][field.key as string];
            } else if ('parentKey' in field && field.parentKey && 'subKey' in field && field.subKey) {
                (newConfig[field.parentKey as keyof MyraConfig] as any)[field.subKey][key as string] =
                (initialSnapshotForLang[field.parentKey as keyof MyraConfig]as any)[field.subKey][key as string];
            } else if ('parentKey' in field && field.parentKey) {
                (newConfig[field.parentKey as keyof MyraConfig] as any)[key as string] =
                (initialSnapshotForLang[field.parentKey as keyof MyraConfig] as any)[key as string];
            } else { 
                 (newConfig as any)[key as string] = (initialSnapshotForLang as any)[key as string];
            }
        });
        return newConfig;
    });
  };

  const handleResetAll = () => {
    const currentLang = localConfig.language;
    const currentTheme = localConfig.theme;
    let fullyResetConfig = JSON.parse(JSON.stringify(INITIAL_CONFIG)) as MyraConfig;
    
    personaEditableFieldKeys.forEach(key => {
      (fullyResetConfig as any)[key] = "";
    });

    fullyResetConfig.language = currentLang;
    fullyResetConfig.theme = currentTheme;
    setLocalConfig(fullyResetConfig);
  };

  const renderField = (field: ConfigField) => {
    if (field.condition && !field.condition(localConfig)) {
      return null;
    }

    let currentValue: any;
     if ('parentKey' in field && field.parentKey && 'subKey' in field && field.subKey && 'subSubKey' in field && field.subSubKey) {
        currentValue = (localConfig[field.parentKey as keyof MyraConfig] as any)?.[field.subSubKey]?.[field.subKey]?.[field.key as string];
    } else if ('parentKey' in field && field.parentKey && 'subKey' in field && field.subKey) {
      currentValue = (localConfig[field.parentKey as keyof MyraConfig] as any)?.[field.subKey]?.[field.key as string];
    } else if ('parentKey' in field && field.parentKey) {
      currentValue = (localConfig[field.parentKey as keyof MyraConfig] as any)?.[field.key as string];
    } else {
      currentValue = localConfig[field.key as keyof MyraConfig];
    }

    if (field.type === 'number' && currentValue === undefined && (field.key === 'subqgSeed' || field.key === 'caelumSubqgSeed')) {
        currentValue = ''; // Display as empty for optional undefined seeds
    } else if (currentValue === undefined) {
        currentValue = ''; // Default to empty string if undefined, for non-seed numbers or other types
    }

    const commonInputClass = "w-full p-2 text-sm bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-150 ease-in-out text-gray-100 placeholder-gray-400";
    const commonLabelClass = "block text-sm font-medium text-gray-300 mb-1";

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <div key={field.key as string} className="mb-4">
            <label htmlFor={field.key as string} className={commonLabelClass}>{t(field.labelKey)}</label>
            <input
              type={field.type}
              id={field.key as string}
              name={field.key as string}
              value={currentValue as string | number}
              onChange={e => handleInputChange(
                field.key as string,
                field.type === 'number' ? (e.target.value === '' && (field.key === 'subqgSeed' || field.key === 'caelumSubqgSeed') ? undefined : parseFloat(e.target.value)) : e.target.value,
                (field as any).parentKey,
                (field as any).subKey,
                (field as any).subSubKey
              )}
              step={field.step}
              min={field.min}
              max={field.max}
              placeholder={field.placeholderKey ? t(field.placeholderKey) : undefined}
              className={commonInputClass}
            />
          </div>
        );
      case 'textarea':
        return (
          <div key={field.key as string} className="mb-4">
            <label htmlFor={field.key as string} className={commonLabelClass}>{t(field.labelKey)}</label>
            <textarea
              id={field.key as string}
              name={field.key as string}
              value={currentValue as string}
              onChange={e => handleInputChange(
                field.key as string,
                e.target.value,
                (field as any).parentKey,
                (field as any).subKey,
                (field as any).subSubKey
              )}
              rows={field.rows || 3}
              className={commonInputClass}
            />
          </div>
        );
      case 'select':
        let options = field.options;
        // Dynamically set labels for activeChatAgent options
        if (field.key === 'activeChatAgent') {
            options = [
                { value: 'myra', labelKey: localConfig.myraName || t('settingsPanel.generalSystem.activeChatAgent.options.myra') },
                { value: 'caelum', labelKey: localConfig.caelumName || t('settingsPanel.generalSystem.activeChatAgent.options.caelum') }
            ];
        }

        return (
          <div key={field.key as string} className="mb-4">
            <label htmlFor={field.key as string} className={commonLabelClass}>{t(field.labelKey)}</label>
            <select
              id={field.key as string}
              name={field.key as string}
              value={currentValue as string}
              onChange={e => handleInputChange(
                field.key as string,
                e.target.value,
                (field as any).parentKey,
                (field as any).subKey,
                (field as any).subSubKey
              )}
              className={commonInputClass}
            >
              {options?.map(option => (
                <option key={option.value} value={option.value}>
                    { (field.key === 'activeChatAgent') ? option.labelKey : t(option.labelKey)}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  const groupedFields = useMemo(() => {
    const groups: Record<string, ConfigField[]> = {};
    currentConfigFields.forEach(field => {
      if (!groups[field.groupKey]) {
        groups[field.groupKey] = [];
      }
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
        "settingsPanel.group.adaptiveFitnessBase", "settingsPanel.group.adaptiveFitnessDim"
    ];
    const existingKeys = Object.keys(groupedFields);
    const ordered = order.filter(key => existingKeys.includes(key));
    const unordered = existingKeys.filter(key => !order.includes(key)).sort();
    return [...ordered, ...unordered];
  }, [groupedFields]);

  useEffect(() => {
    if (!activeGroupKey && orderedGroupKeys.length > 0) {
      setActiveGroupKey(orderedGroupKeys[0]);
    }
  }, [activeGroupKey, orderedGroupKeys]);

  return (
    <div className="p-2 sm:p-3 bg-gray-700/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-600 h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-3 sm:mb-4 pb-3 border-b border-gray-600 sticky top-0 bg-gray-700/50 z-10 px-1">
        <h3 className="text-lg sm:text-xl font-semibold text-purple-300">{t('settingsPanel.title')}</h3>
        <div className="flex space-x-2">
            <button
              onClick={handleResetAll}
              className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150"
              title={t('settingsPanel.button.resetAllTooltip')}
              aria-label={t('settingsPanel.button.resetAllTooltip')}
            >
              {t('settingsPanel.button.resetAll')}
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-150"
              aria-label={t('settingsPanel.button.saveChanges')}
            >
              {t('settingsPanel.button.saveChanges')}
            </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden space-x-2 sm:space-x-3">
        <nav className="w-1/3 md:w-1/4 space-y-1.5 overflow-y-auto fancy-scrollbar pr-1 sm:pr-2 py-1">
          {orderedGroupKeys.map(groupKey => (
            <button
              key={groupKey}
              onClick={() => setActiveGroupKey(groupKey)}
              className={`w-full flex items-center text-left px-2 py-2 sm:px-3 sm:py-2.5 rounded-md text-xs sm:text-sm transition-colors duration-150
                ${activeGroupKey === groupKey
                  ? 'bg-purple-600 text-white font-semibold shadow-md'
                  : 'text-gray-300 hover:bg-gray-600/70 hover:text-white bg-gray-700'
                }`}
              role="tab"
              aria-selected={activeGroupKey === groupKey}
              aria-controls={`settings-group-panel-${groupKey}`}
            >
              {groupIcons[groupKey] || <AdjustmentsVerticalIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
              <span className="truncate">{t(groupKey)}</span>
            </button>
          ))}
        </nav>

        <main className="w-2/3 md:w-3/4 overflow-y-auto fancy-scrollbar py-1">
          {orderedGroupKeys.map(groupKey => (
            <section
              key={groupKey}
              id={`settings-group-panel-${groupKey}`}
              role="tabpanel"
              aria-labelledby={`settings-group-tab-${groupKey}`} // This would need corresponding id on button
              className={`${activeGroupKey === groupKey ? 'block' : 'hidden'}`}
            >
              <div className="bg-gray-800/30 p-3 sm:p-4 rounded-lg shadow-inner border border-gray-600/50">
                  <div className="flex justify-between items-center mb-3 sm:mb-4 pb-2 border-b border-gray-600">
                    <h4 className="text-md sm:text-lg font-semibold text-purple-400 flex items-center">
                      {groupIcons[groupKey] || <AdjustmentsVerticalIcon className="w-5 h-5 mr-2" />}
                      {t(groupKey)}
                    </h4>
                    <button
                      onClick={() => handleResetGroup(groupKey)}
                      className="px-2 py-1 text-xs bg-red-700 text-white rounded-md hover:bg-red-800 transition duration-150"
                      title={t('settingsPanel.button.resetGroupTooltip', { groupName: t(groupKey) })}
                      aria-label={t('settingsPanel.button.resetGroupTooltip', { groupName: t(groupKey) })}
                    >
                      {t('settingsPanel.button.resetGroup')}
                    </button>
                  </div>
                  {groupedFields[groupKey]?.map(field => renderField(field))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

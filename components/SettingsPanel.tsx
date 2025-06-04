import React, { useState, useEffect } from 'react';
import {
    MyraConfig,
    AdaptiveFitnessMetricWeights,
    MyraSystemConfigField,
    MyraPersonaConfigField,
    CaelumPersonaConfigField,
    CaelumSystemConfigField,
    AdaptiveFitnessBaseWeightsField,
    AdaptiveFitnessDimensionSubField,
    MyraAIProviderConfigField,
    CaelumAIProviderConfigField,
    ConfigField,
    LocalizationConfigField,
    Language,
    Theme
} from '../types';
import { Cog6ToothIcon, ServerIcon, CloudIcon, BeakerIcon as SubQGIcon, BookOpenIcon, ChartPieIcon, CpuChipIcon as CaelumAICPUChipIcon, AdjustmentsVerticalIcon as CaelumSystemIcon, AdjustmentsVerticalIcon, LanguageIcon, PaintBrushIcon } from './IconComponents';
import { INITIAL_CONFIG } from '../constants';

interface SettingsPanelProps {
  config: MyraConfig;
  onConfigChange: (newConfig: Partial<MyraConfig>) => void;
  t: (key: string, substitutions?: Record<string, string>) => string;
}


const UserCircleIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const getConfigFields = (t: SettingsPanelProps['t']): ConfigField[] => [
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

  // Myra Persona Group (using keys now)
  { key: 'myraNameKey', labelKey: 'settingsPanel.myraPersona.name.label', type: 'text', groupKey: "settingsPanel.group.myraPersona" } as MyraPersonaConfigField,
  { key: 'userNameKey', labelKey: 'settingsPanel.myraPersona.userName.label', type: 'text', groupKey: "settingsPanel.group.myraPersona" } as MyraPersonaConfigField,
  { key: 'myraRoleDescriptionKey', labelKey: 'settingsPanel.myraPersona.roleDescription.label', type: 'textarea', rows: 3, groupKey: "settingsPanel.group.myraPersona" } as MyraPersonaConfigField,
  { key: 'myraEthicsPrinciplesKey', labelKey: 'settingsPanel.myraPersona.ethicsPrinciples.label', type: 'textarea', rows: 3, groupKey: "settingsPanel.group.myraPersona" } as MyraPersonaConfigField,
  { key: 'myraResponseInstructionKey', labelKey: 'settingsPanel.myraPersona.responseInstruction.label', type: 'textarea', rows: 4, groupKey: "settingsPanel.group.myraPersona" } as MyraPersonaConfigField,

  // Caelum Persona Group
  { key: 'caelumNameKey', labelKey: 'settingsPanel.caelumPersona.name.label', type: 'text', groupKey: "settingsPanel.group.caelumPersona" } as CaelumPersonaConfigField,
  { key: 'caelumRoleDescriptionKey', labelKey: 'settingsPanel.caelumPersona.roleDescription.label', type: 'textarea', rows: 3, groupKey: "settingsPanel.group.caelumPersona" } as CaelumPersonaConfigField,
  { key: 'caelumEthicsPrinciplesKey', labelKey: 'settingsPanel.caelumPersona.ethicsPrinciples.label', type: 'textarea', rows: 3, groupKey: "settingsPanel.group.caelumPersona" } as CaelumPersonaConfigField,
  { key: 'caelumResponseInstructionKey', labelKey: 'settingsPanel.caelumPersona.responseInstruction.label', type: 'textarea', rows: 4, groupKey: "settingsPanel.group.caelumPersona" } as CaelumPersonaConfigField,

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
  { key: 'maxHistoryMessagesForPrompt', labelKey: 'settingsPanel.generalSystem.maxHistoryMessagesForPrompt.label', type: 'number', min: 0, max: 20, step: 1, groupKey: "settingsPanel.group.generalSystem" } as MyraSystemConfigField,
  { key: 'temperatureLimbusInfluence', labelKey: 'settingsPanel.generalSystem.temperatureLimbusInfluence.label', type: 'number', min: -0.5, max: 0.5, step: 0.01, groupKey: "settingsPanel.group.generalSystem" } as MyraSystemConfigField,
  { key: 'temperatureCreativusInfluence', labelKey: 'settingsPanel.generalSystem.temperatureCreativusInfluence.label', type: 'number', min: -0.5, max: 0.5, step: 0.01, groupKey: "settingsPanel.group.generalSystem" } as MyraSystemConfigField,
  { key: 'ragChunkSize', labelKey: 'settingsPanel.generalSystem.ragChunkSize.label', type: 'number', min: 100, max: 2000, step: 50, groupKey: "settingsPanel.group.generalSystem" } as MyraSystemConfigField,
  { key: 'ragChunkOverlap', labelKey: 'settingsPanel.generalSystem.ragChunkOverlap.label', type: 'number', min: 0, max: 500, step: 10, groupKey: "settingsPanel.group.generalSystem" } as MyraSystemConfigField,
  { key: 'ragMaxChunksToRetrieve', labelKey: 'settingsPanel.generalSystem.ragMaxChunksToRetrieve.label', type: 'number', min: 1, max: 10, step: 1, groupKey: "settingsPanel.group.generalSystem" } as MyraSystemConfigField,

  // Adaptive Fitness - Base Metric Weights
  ...Object.keys(INITIAL_CONFIG.adaptiveFitnessConfig.baseMetricWeights).map(subKey => ({
    key: subKey as keyof AdaptiveFitnessMetricWeights,
    parentKey: 'adaptiveFitnessConfig',
    subKey: 'baseMetricWeights',
    labelKey: `settingsPanel.adaptiveFitnessBase.${subKey}.label`, // e.g. settingsPanel.adaptiveFitnessBase.coherenceProxy.label
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
          labelKey: `settingsPanel.adaptiveFitnessDim.${dimKey}.${metricKey}.label`, // e.g. settingsPanel.adaptiveFitnessDim.knowledgeExpansion.learningEfficiency.label
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
  const currentConfigFields = React.useMemo(() => getConfigFields(t), [t]);
  const [activeGroupKey, setActiveGroupKey] = useState<string | null>(currentConfigFields[0]?.groupKey || null);

  const groupIcons: Record<string, React.ReactElement> = {
    "settingsPanel.group.localization": <LanguageIcon className="w-5 h-5 mr-2 text-icon-localization" />,
    "settingsPanel.group.myraAI": <CloudIcon className="w-5 h-5 mr-2 text-icon-myra-ai" />,
    "settingsPanel.group.caelumAI": <CaelumAICPUChipIcon className="w-5 h-5 mr-2 text-icon-caelum-ai" />,
    "settingsPanel.group.myraPersona": <UserCircleIcon className="w-5 h-5 mr-2 text-icon-myra-persona" />,
    "settingsPanel.group.caelumPersona": <UserCircleIcon className="w-5 h-5 mr-2 text-icon-caelum-persona" />,
    "settingsPanel.group.myraSystem": <SubQGIcon className="w-5 h-5 mr-2 text-icon-myra-system" />,
    "settingsPanel.group.caelumSystem": <CaelumSystemIcon className="w-5 h-5 mr-2 text-icon-caelum-system" />,
    "settingsPanel.group.generalSystem": <Cog6ToothIcon className="w-5 h-5 mr-2 text-icon-general" />,
    "settingsPanel.group.adaptiveFitnessBase": <ChartPieIcon className="w-5 h-5 mr-2 text-icon-fitness" />,
    "settingsPanel.group.adaptiveFitnessDim": <ChartPieIcon className="w-5 h-5 mr-2 text-icon-fitness-dim" />,
  };


  useEffect(() => {
    // When the global config changes (e.g., language change from hook), update local state
    // This ensures that translated persona fields in localConfig are also updated
    setLocalConfig(config);
  }, [config]);

  const handleInputChange = (
    key: string,
    value: string | number | boolean,
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

  const handleResetGroup = (groupKeyToReset: string) => {
    setLocalConfig(prevConfig => {
        const newConfig = JSON.parse(JSON.stringify(prevConfig)) as MyraConfig;
        // Use a snapshot of INITIAL_CONFIG with currently selected language for persona keys
        const initialSnapshotForLang = JSON.parse(JSON.stringify(INITIAL_CONFIG)) as MyraConfig;
        initialSnapshotForLang.language = newConfig.language; // keep current language for resolving keys from initial


        currentConfigFields.filter(field => field.groupKey === groupKeyToReset).forEach(field => {
            const { key } = field;
            if (field.key === 'language' || field.key === 'theme') { // Handle language/theme reset carefully
                 (newConfig as any)[key as string] = (INITIAL_CONFIG as any)[key as string];
            } else if ('parentKey' in field && field.parentKey && 'subKey' in field && field.subKey && 'subSubKey' in field && field.subSubKey) {
                 (newConfig[field.parentKey as keyof MyraConfig] as any)[field.subSubKey][field.subKey][field.key as string] =
                 (initialSnapshotForLang[field.parentKey as keyof MyraConfig] as any)[field.subSubKey][field.subKey][field.key as string];
            } else if ('parentKey' in field && field.parentKey && 'subKey' in field && field.subKey) {
                (newConfig[field.parentKey as keyof MyraConfig] as any)[field.subKey][key as string] =
                (initialSnapshotForLang[field.parentKey as keyof MyraConfig]as any)[field.subKey][key as string];
            } else if ('parentKey' in field && field.parentKey) {
                (newConfig[field.parentKey as keyof MyraConfig] as any)[key as string] =
                (initialSnapshotForLang[field.parentKey as keyof MyraConfig] as any)[key as string];
            } else { // Top-level (includes persona keys like myraNameKey)
                 (newConfig as any)[key as string] = (initialSnapshotForLang as any)[key as string];
            }
        });
        // After resetting keys, we must re-populate the translated fields for persona
        // This will be handled by the main setLocalConfig's useEffect dependency on 'config' or by a direct call.
        // For now, the main save will re-trigger the full translation population in useMyraState.
        // Or, more directly:
        return newConfig; // This will be passed to onConfigChange, which eventually updates the main config
    });
  };

  const handleResetAll = () => {
     // Reset to INITIAL_CONFIG but keep current language and theme to avoid jarring UI shift before save.
     // The save action will then correctly populate translated fields.
    const currentLang = localConfig.language;
    const currentTheme = localConfig.theme;
    const fullyResetConfig = JSON.parse(JSON.stringify(INITIAL_CONFIG)) as MyraConfig;
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
        currentValue = '';
    } else if (currentValue === undefined) {
        currentValue = field.type === 'number' ? 0 : field.type === 'textarea' ? '' : '';
    }


    const commonProps = {
      id: String(field.key) + (field as any).parentKey + (field as any).subKey,
      className: "w-full p-2 bg-input text-input-text border border-input-border rounded-md focus:ring-2 focus:ring-highlight focus:border-highlight outline-none placeholder-text-accent",
      value: currentValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        let val: string | number | boolean = e.target.value;
        if (field.type === 'number') {
            val = (e.target.value === '' && (field.key === 'subqgSeed' || field.key === 'caelumSubqgSeed'))
                ? ''
                : parseFloat(e.target.value)
        } else if (field.key === 'language') {
            val = e.target.value as Language;
        } else if (field.key === 'theme') {
            val = e.target.value as Theme;
        }
        handleInputChange(
            String(field.key),
            val,
            (field as any).parentKey,
            (field as any).subKey,
            (field as any).subSubKey
        );
      }
    };

    const numberProps = field.type === 'number' ? { step: field.step, min: field.min, max: field.max, placeholder: field.placeholderKey ? t(field.placeholderKey) : undefined } : {};
    const textInputProps = { placeholder: field.placeholderKey ? t(field.placeholderKey) : undefined };


    return (
      <div key={String(field.key) + (field as any).parentKey + (field as any).subKey} className="mb-3">
        <label htmlFor={String(field.key)} className="block text-sm font-medium text-text-secondary mb-1">{t(field.labelKey)}</label>
        {field.type === 'text' && <input type="text" {...commonProps} {...textInputProps} />}
        {field.type === 'number' && <input type="number" {...commonProps} {...numberProps} />}
        {field.type === 'textarea' && <textarea rows={field.rows || 3} {...commonProps} {...textInputProps} />}
        {field.type === 'select' && (
          <select {...commonProps}>
            {field.options?.map(opt => <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>)}
          </select>
        )}
      </div>
    );
  };

  const groupedFields = currentConfigFields.reduce((acc, field) => {
    const group = field.groupKey || 'settingsPanel.group.misc';
    if (!acc[group]) acc[group] = [];
    acc[group].push(field);
    return acc;
  }, {} as Record<string, ConfigField[]>);

  return (
    <div className="p-1 max-h-[calc(100vh-120px)] overflow-y-auto fancy-scrollbar text-text-primary">
        <div className="sticky top-0 bg-secondary-transparent backdrop-blur-md z-10 p-3 rounded-t-lg border-b border-accent">
             <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-highlight">{t('settingsPanel.title')}</h2>
                <div className="space-x-2">
                    <button
                        onClick={handleResetAll}
                        className="py-1.5 px-3 bg-button-warn text-button-warn-text text-xs font-semibold rounded-lg hover:bg-button-warn-hover focus:outline-none focus:ring-2 focus:ring-highlight-warn"
                    >
                        {t('settingsPanel.resetAllButton')}
                    </button>
                    <button
                        onClick={handleSave}
                        className="py-1.5 px-4 bg-button-confirm text-button-confirm-text text-xs font-semibold rounded-lg hover:bg-button-confirm-hover focus:outline-none focus:ring-2 focus:ring-highlight-confirm"
                    >
                        {t('settingsPanel.saveButton')}
                    </button>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                {Object.keys(groupedFields).map(groupKey => (
                    <button
                        key={groupKey}
                        onClick={() => setActiveGroupKey(groupKey)}
                        className={`flex items-center py-1.5 px-3 text-xs font-medium rounded-md transition-colors duration-150
                            ${activeGroupKey === groupKey ? 'bg-tab-active text-tab-active-text shadow-md' : 'bg-tab-inactive text-tab-inactive-text hover:bg-tab-hover'}`}
                    >
                        {groupIcons[groupKey] || <Cog6ToothIcon className="w-4 h-4 mr-1.5"/>}
                        {t(groupKey)}
                    </button>
                ))}
            </div>
        </div>

      {Object.entries(groupedFields).map(([groupKey, fields]) => (
        activeGroupKey === groupKey && (
          <div key={groupKey} className="mb-6 p-4 bg-accent-transparent backdrop-blur-sm rounded-b-lg shadow-lg border border-accent-light border-t-0">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-highlight flex items-center">
                     {groupIcons[groupKey] || <Cog6ToothIcon className="w-5 h-5 mr-2"/>}
                    {t(groupKey)}
                </h3>
                <button
                    onClick={() => handleResetGroup(groupKey)}
                    className="py-1 px-2.5 bg-button-warn text-button-warn-text text-xs font-semibold rounded-md hover:bg-button-warn-hover focus:outline-none focus:ring-1 focus:ring-highlight-warn"
                >
                    {t('settingsPanel.resetGroupButton')}
                </button>
            </div>
            {fields.map(renderField)}
          </div>
        )
      ))}
    </div>
  );
};
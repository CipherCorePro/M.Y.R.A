

import React, { useState, useEffect } from 'react';
import { MyraConfig, RNGType, AdaptiveFitnessMetricWeights, AdaptiveFitnessDimensionWeights, MyraConfigField, AdaptiveFitnessBaseWeightsField, AdaptiveFitnessDimensionSubField } from '../types'; 
import { Cog6ToothIcon, ServerIcon, CloudIcon, BeakerIcon as SubQGIcon, BookOpenIcon, ChartPieIcon } from './IconComponents';

interface SettingsPanelProps {
  config: MyraConfig;
  onConfigChange: (newConfig: Partial<MyraConfig>) => void;
}

// Note: MyraConfigField, AdaptiveFitnessBaseWeightsField, AdaptiveFitnessDimensionSubField are now imported from types.ts if they are defined there globally.
// If they are local helper types for this file, they should be defined here or imported if they were meant to be shared.
// Assuming they are effectively what ConfigField union implies.

type ConfigField = MyraConfigField | AdaptiveFitnessBaseWeightsField | AdaptiveFitnessDimensionSubField;


const UserCircleIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const configFields: ConfigField[] = [
  // AI Provider Group
  { key: 'aiProvider', label: 'AI Provider', type: 'select', options: [
      { value: 'gemini', label: 'Gemini API' },
      { value: 'lmstudio', label: 'LM Studio (Local)' },
    ], group: "AI Configuration"
  },
  { key: 'geminiModelName', label: 'Gemini Model', type: 'text', condition: config => config.aiProvider === 'gemini', group: "AI Configuration" },
  { key: 'lmStudioBaseUrl', label: 'LM Studio URL', type: 'text', condition: config => config.aiProvider === 'lmstudio', group: "AI Configuration" },
  { key: 'lmStudioGenerationModel', label: 'LM Studio Gen Model', type: 'text', condition: config => config.aiProvider === 'lmstudio', group: "AI Configuration" },
  
  // Myra Persona Group
  { key: 'myraName', label: 'Myra Name', type: 'text', group: "Persona & Behavior" },
  { key: 'userName', label: 'User Name', type: 'text', group: "Persona & Behavior" },
  { key: 'myraRoleDescription', label: 'Role Description', type: 'textarea', rows: 3, group: "Persona & Behavior" },
  { key: 'myraEthicsPrinciples', label: 'Ethics Principles', type: 'textarea', rows: 3, group: "Persona & Behavior" },
  { key: 'myraResponseInstruction', label: 'Response Instruction', type: 'textarea', rows: 3, group: "Persona & Behavior" },
  { key: 'temperatureBase', label: 'Base Temp.', type: 'number', step: 0.05, min: 0, max: 2.0, group: "Persona & Behavior" },
  { key: 'temperatureLimbusInfluence', label: 'Limbus Temp. Influence', type: 'number', step: 0.01, group: "Persona & Behavior" },
  { key: 'temperatureCreativusInfluence', label: 'Creativus Temp. Influence', type: 'number', step: 0.01, group: "Persona & Behavior" },
  { key: 'maxHistoryMessagesForPrompt', label: 'Max History Msgs', type: 'number', step: 1, min: 0, group: "Persona & Behavior" },
  
  // SubQG Simulation Group
  { key: 'subqgSize', label: 'SubQG Size', type: 'number', step: 1, min: 4, group: "SubQG Simulation" },
  { key: 'rngType', label: 'SubQG RNG Type', type: 'select', options: [
      { value: 'subqg', label: 'SubQG (Deterministic)' },
      { value: 'quantum', label: 'Quantum (Simulated)' },
    ], group: "SubQG Simulation"
  },
  { key: 'subqgSeed', label: 'SubQG Seed', type: 'number', condition: config => config.rngType === 'subqg', step: 1, group: "SubQG Simulation", placeholder: "Random if empty" },
  { key: 'subqgInitialEnergyNoiseStd', label: 'SubQG Noise Level', type: 'number', step: 0.0001, min: 0, max: 0.1, group: "SubQG Simulation"},
  { key: 'subqgCoupling', label: 'SubQG Coupling', type: 'number', step: 0.001, min: 0, group: "SubQG Simulation" },
  { key: 'subqgJumpQnsDirectModifierStrength', label: 'SubQG Jump Mod Strength', type: 'number', step: 0.1, min:0, group: "SubQG Simulation" },

  // Knowledge & RAG Group
  { key: 'ragChunkSize', label: 'RAG Chunk Size', type: 'number', step: 50, min: 100, max: 2000, group: "Knowledge & RAG" },
  { key: 'ragChunkOverlap', label: 'RAG Chunk Overlap', type: 'number', step: 10, min: 0, max: 500, group: "Knowledge & RAG" },
  { key: 'ragMaxChunksToRetrieve', label: 'Max RAG Chunks', type: 'number', step: 1, min: 1, max: 10, group: "Knowledge & RAG" },

  // Adaptive Fitness Group
  { key: 'adaptiveFitnessUpdateInterval', label: 'Fitness Update Interval (steps)', type: 'number', step: 1, min: 1, group: "Adaptive Fitness"},
  // Base Metric Weights
  { key: 'coherenceProxy', parentKey: 'adaptiveFitnessConfig', subKey: 'baseMetricWeights', label: 'Weight: Coherence Proxy', type: 'number', step: 0.01, min: -1, max: 1, group: "Adaptive Fitness" },
  { key: 'averageResonatorScore', parentKey: 'adaptiveFitnessConfig', subKey: 'baseMetricWeights', label: 'Weight: Avg Resonator Score', type: 'number', step: 0.01, min: -1, max: 1, group: "Adaptive Fitness" },
  { key: 'goalAchievementProxy', parentKey: 'adaptiveFitnessConfig', subKey: 'baseMetricWeights', label: 'Weight: Goal Achievement', type: 'number', step: 0.01, min: -1, max: 1, group: "Adaptive Fitness" },
  { key: 'explorationScore', parentKey: 'adaptiveFitnessConfig', subKey: 'baseMetricWeights', label: 'Weight: Exploration Score', type: 'number', step: 0.01, min: -1, max: 1, group: "Adaptive Fitness" },
  { key: 'focusScore', parentKey: 'adaptiveFitnessConfig', subKey: 'baseMetricWeights', label: 'Weight: Focus Score', type: 'number', step: 0.01, min: -1, max: 1, group: "Adaptive Fitness" },
  { key: 'creativityScore', parentKey: 'adaptiveFitnessConfig', subKey: 'baseMetricWeights', label: 'Weight: Creativity Score', type: 'number', step: 0.01, min: -1, max: 1, group: "Adaptive Fitness" },
  { key: 'conflictPenaltyFactor', parentKey: 'adaptiveFitnessConfig', subKey: 'baseMetricWeights', label: 'Weight: Conflict Penalty Factor', type: 'number', step: 0.01, min: -1, max: 0, group: "Adaptive Fitness" },
  // Dimension Contribution Weights - Knowledge Expansion
  { key: 'explorationScore', parentKey: 'adaptiveFitnessConfig', subKey: 'knowledgeExpansion', subSubKey: 'dimensionContribWeights', label: 'KE Dim: Exploration Weight', type: 'number', step: 0.01, min: 0, max: 1, group: "Adaptive Fitness" },
  // ... (add other dimension contribution weights similarly if desired)
];

const groupIcons: Record<string, React.ReactNode> = {
    "AI Configuration": <CloudIcon className="w-5 h-5 mr-2" />,
    "Persona & Behavior": <UserCircleIcon className="w-5 h-5 mr-2" />,
    "SubQG Simulation": <SubQGIcon className="w-5 h-5 mr-2" />,
    "Knowledge & RAG": <BookOpenIcon className="w-5 h-5 mr-2" />,
    "Adaptive Fitness": <ChartPieIcon className="w-5 h-5 mr-2" />
};


const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, onConfigChange }) => {
  const [localConfig, setLocalConfig] = useState<MyraConfig>(JSON.parse(JSON.stringify(config))); // Deep copy

  useEffect(() => {
    setLocalConfig(JSON.parse(JSON.stringify(config))); // Deep copy on external config change
  }, [config]);

  const handleChange = (field: ConfigField, value: string | number | undefined) => {
    let processedValue: string | number | undefined | MyraConfig[keyof MyraConfig] = value;
    
    if (field.type === 'number' && typeof value === 'string') {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            if ('key' in field && (field as MyraConfigField).key === 'subqgSeed' && value.trim() === '') {
                processedValue = undefined;
            } else {
                // Revert to original config value for this field if parsing failed and not empty seed
                if ('subSubKey' in field && field.parentKey === 'adaptiveFitnessConfig' && field.subSubKey === 'dimensionContribWeights') { // AdaptiveFitnessDimensionSubField
                    const dimKey = field.subKey as keyof MyraConfig['adaptiveFitnessConfig']['dimensionContribWeights'];
                    processedValue = (config.adaptiveFitnessConfig.dimensionContribWeights[dimKey] as any)?.[field.key];
                } else if ('subKey' in field && field.parentKey === 'adaptiveFitnessConfig' && field.subKey === 'baseMetricWeights') { // AdaptiveFitnessBaseWeightsField
                    processedValue = config.adaptiveFitnessConfig.baseMetricWeights[field.key as keyof AdaptiveFitnessMetricWeights];
                } else if ('key' in field && !('parentKey' in field)) { // MyraConfigField
                     processedValue = config[field.key as keyof MyraConfig];
                }
            }
        } else {
            processedValue = numValue;
        }
    } else if (typeof value === 'string' && 'key' in field && (field as MyraConfigField).key === 'subqgSeed' && value.trim() === '') {
      processedValue = undefined; 
    }


    setLocalConfig(prev => {
      const newConf = JSON.parse(JSON.stringify(prev)); 

      if ('subSubKey' in field && field.parentKey === 'adaptiveFitnessConfig' && field.subSubKey === 'dimensionContribWeights') { // AdaptiveFitnessDimensionSubField
          const dimKey = field.subKey as keyof MyraConfig['adaptiveFitnessConfig']['dimensionContribWeights'];
          if (!newConf.adaptiveFitnessConfig.dimensionContribWeights[dimKey]) {
               newConf.adaptiveFitnessConfig.dimensionContribWeights[dimKey] = {} as any; 
          }
          (newConf.adaptiveFitnessConfig.dimensionContribWeights[dimKey] as any)[field.key] = processedValue;
      } else if ('subKey' in field && field.parentKey === 'adaptiveFitnessConfig' && field.subKey === 'baseMetricWeights') { // AdaptiveFitnessBaseWeightsField
        (newConf.adaptiveFitnessConfig.baseMetricWeights as any)[field.key as keyof AdaptiveFitnessMetricWeights] = processedValue;
      } else if ('key' in field && !('parentKey' in field)) { // MyraConfigField
        (newConf as any)[field.key as keyof MyraConfig] = processedValue;
      }


      if ('key' in field && (field as MyraConfigField).key === 'aiProvider') {
          if (value === 'gemini' && !newConf.geminiModelName) {
              newConf.geminiModelName = 'gemini-2.5-flash-preview-04-17';
          } else if (value === 'lmstudio' && !newConf.lmStudioGenerationModel) {
              newConf.lmStudioGenerationModel = 'google/gemma-3-1b';
          }
      }
      return newConf;
    });
  };

  const handleSave = () => {
    const configToSave = JSON.parse(JSON.stringify(localConfig));
    if (typeof configToSave.subqgSeed === 'string') {
        const parsedSeed = parseInt(configToSave.subqgSeed, 10);
        configToSave.subqgSeed = isNaN(parsedSeed) ? undefined : parsedSeed;
    }
    onConfigChange(configToSave);
  };
  
  const groupedFields = configFields.reduce((acc, field) => {
    const groupName = field.group || "General";
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(field);
    return acc;
  }, {} as Record<string, ConfigField[]>);


  const getFieldValue = (field: ConfigField): string | number => {
    if ('subSubKey' in field && field.parentKey === 'adaptiveFitnessConfig' && field.subSubKey === 'dimensionContribWeights') { // AdaptiveFitnessDimensionSubField
        const dimKey = field.subKey as keyof MyraConfig['adaptiveFitnessConfig']['dimensionContribWeights'];
        return (localConfig.adaptiveFitnessConfig.dimensionContribWeights[dimKey] as any)?.[field.key] ?? '';
    } else if ('subKey' in field && field.parentKey === 'adaptiveFitnessConfig' && field.subKey === 'baseMetricWeights') { // AdaptiveFitnessBaseWeightsField
        return localConfig.adaptiveFitnessConfig.baseMetricWeights[field.key as keyof AdaptiveFitnessMetricWeights] ?? '';
    } else if ('key' in field && !('parentKey' in field)) { // MyraConfigField
      const value = localConfig[field.key as keyof MyraConfig];
      if (field.key === 'subqgSeed' && value === undefined) return '';
      return String(value ?? '');
    }
    return '';
  };


  return (
    <div className="p-3 bg-gray-700/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-600 space-y-6 max-h-[calc(100vh-150px)] overflow-y-auto fancy-scrollbar">
      <div className="flex items-center mb-1">
        <Cog6ToothIcon className="w-6 h-6 mr-2 text-purple-300"/>
        <h3 className="text-xl font-semibold text-purple-300">Configuration</h3>
      </div>
      
      {Object.entries(groupedFields).map(([groupName, fields]) => (
        <div key={groupName} className="space-y-4 p-3 bg-gray-800/30 rounded-md border border-gray-600/50">
          <h4 className="text-md font-semibold text-purple-400 mb-2 flex items-center">
            {groupIcons[groupName] || <Cog6ToothIcon className="w-4 h-4 mr-2"/>}
            {groupName}
          </h4>
          {fields.map(field => {
            if (field.condition && !field.condition(localConfig)) {
              return null;
            }
            
            let fieldId: string;
            // Check for AdaptiveFitnessDimensionSubField (most specific due to subSubKey)
            if ('subSubKey' in field && field.parentKey === 'adaptiveFitnessConfig' && field.subSubKey === 'dimensionContribWeights') {
                fieldId = `${field.parentKey}-${field.subKey}-${field.key}-${field.subSubKey}`;
            }
            // Check for AdaptiveFitnessBaseWeightsField (has parentKey, but not subSubKey)
            else if ('parentKey' in field && field.parentKey === 'adaptiveFitnessConfig' && field.subKey === 'baseMetricWeights') {
                fieldId = `${field.parentKey}-${field.subKey}-${field.key}`;
            }
            // Check for MyraConfigField (has key, but not parentKey - implicitly by falling through previous checks)
            else if ('key' in field) { // This implies it's a MyraConfigField if the above didn't match
                fieldId = field.key;
            }
            // Fallback, should be unreachable if ConfigField types are exhaustive and all have a 'key' property.
            else {
                // This path implies 'field' is 'never' or an unexpected type.
                // console.error("Error: Unhandled field type in SettingsPanel ID generation. Field:", JSON.stringify(field));
                throw new Error("Unhandled field type in SettingsPanel ID generation. This path should be unreachable if types are correct.");
            }

            const fieldValue = getFieldValue(field);

            return (
              <div key={fieldId}>
                <label htmlFor={fieldId} className="block text-sm font-medium text-gray-300 mb-1">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={fieldId}
                    rows={field.rows || 3}
                    value={fieldValue as string}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-100 placeholder-gray-400 text-sm"
                  />
                ) : field.type === 'select' ? (
                  <select
                    id={fieldId}
                    value={fieldValue as string}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-100 text-sm"
                  >
                    {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    id={fieldId}
                    value={fieldValue}
                    onChange={(e) => handleChange(field, e.target.value)} 
                    step={field.step}
                    min={field.min}
                    max={field.max}
                    placeholder={field.placeholder || ''}
                    className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-100 placeholder-gray-400 text-sm"
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
      <button
        onClick={handleSave}
        className="w-full mt-3 py-2.5 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
      >
        Apply Settings
      </button>
       <p className="text-xs text-gray-400 mt-2 italic">Note: Some settings may require a page refresh or specific interaction to fully take effect in the simulation.</p>
    </div>
  );
};

export default SettingsPanel;

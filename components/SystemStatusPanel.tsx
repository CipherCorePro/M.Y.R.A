import React from 'react';
import { EmotionState, AdaptiveFitnessState, SubQgGlobalMetrics } from '../types';
import { AcademicCapIcon, ChartBarIcon, HeartIcon, FireIcon } from './IconComponents'; 

interface SystemStatusPanelProps {
  emotionState: EmotionState;
  adaptiveFitness: AdaptiveFitnessState;
  subQgGlobalMetrics: SubQgGlobalMetrics;
  activeSubQgJumpModifier: number;
  subQgJumpModifierActiveStepsRemaining: number;
}

const MetricDisplay: React.FC<{ label: string; value: string | number; icon?: React.ReactNode; unit?: string, color?: string }> = ({ label, value, icon, unit, color="text-purple-300" }) => (
  <div className="flex justify-between items-center py-1.5 px-2 bg-gray-700/50 rounded-md hover:bg-gray-600/50 transition-colors">
    <div className="flex items-center text-sm text-gray-300">
      {icon && <span className={`mr-2 ${color}`}>{icon}</span>}
      {label}:
    </div>
    <div className={`text-sm font-semibold ${typeof value === 'number' ? 'text-green-300' : 'text-gray-200'}`}>
      {typeof value === 'number' && Number.isFinite(value) ? value.toFixed(3) : value} {unit}
    </div>
  </div>
);

const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ 
  emotionState, adaptiveFitness, subQgGlobalMetrics, activeSubQgJumpModifier, subQgJumpModifierActiveStepsRemaining
}) => {
  const dominantEmotion = Object.entries(emotionState)
    .filter(([key]) => !['pleasure', 'arousal', 'dominance'].includes(key)) 
    .reduce((max, [key, val]) => Math.abs(val) > Math.abs(emotionState[max.key as keyof EmotionState] || 0) ? { key, val } : max, { key: 'neutral', val: 0.0 });

  return (
    <div className="p-3 bg-gray-700/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-600 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-purple-300 flex items-center"><HeartIcon className="w-5 h-5 mr-2"/>Emotion State</h3>
        <div className="space-y-1 text-xs">
          <MetricDisplay label="Pleasure" value={emotionState.pleasure} />
          <MetricDisplay label="Arousal" value={emotionState.arousal} />
          <MetricDisplay label="Dominance" value={emotionState.dominance} />
          <MetricDisplay label="Dominant Affect" value={`${dominantEmotion.key} (${dominantEmotion.val.toFixed(2)})`} color="text-red-400"/>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-purple-300 flex items-center"><AcademicCapIcon className="w-5 h-5 mr-2"/>Adaptive Fitness</h3>
        <div className="space-y-1 text-xs">
          <MetricDisplay label="Overall Score" value={adaptiveFitness.overallScore} icon={<ChartBarIcon className="w-4 h-4"/>} />
          {adaptiveFitness.dimensions && Object.entries(adaptiveFitness.dimensions).map(([key, value]) => (
            <MetricDisplay 
              key={key} 
              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()} // Format dimension key for display
              value={value} 
            />
          ))}
          {/* Optional: Display individual calculated metrics from fitness.metrics if available */}
          {/* {adaptiveFitness.metrics && Object.entries(adaptiveFitness.metrics).map(([key, value]) => (
            <MetricDisplay key={`metric-${key}`} label={`Metric: ${key}`} value={value} />
          ))} */}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2 text-purple-300 flex items-center"><FireIcon className="w-5 h-5 mr-2"/>SubQG Metrics</h3>
        <div className="space-y-1 text-xs">
          <MetricDisplay label="Avg. Energy" value={subQgGlobalMetrics.avgEnergy}/>
          <MetricDisplay label="Std. Energy" value={subQgGlobalMetrics.stdEnergy}/>
          <MetricDisplay label="Phase Coherence" value={subQgGlobalMetrics.phaseCoherence}/>
           {activeSubQgJumpModifier !== 0 && (
            <MetricDisplay 
              label="Jump Modifier Active" 
              value={`${activeSubQgJumpModifier.toFixed(3)} (${subQgJumpModifierActiveStepsRemaining} steps left)`}
              color="text-yellow-400"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemStatusPanel;
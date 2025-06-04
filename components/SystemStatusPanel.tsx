
import React, { useState, useEffect, useRef } from 'react';
import { EmotionState, AdaptiveFitnessState, SubQgGlobalMetrics, SubQgJumpInfo } from '../types';
import { AcademicCapIcon, ChartBarIcon, HeartIcon, FireIcon, PulseWaveIcon } from './IconComponents'; 

interface SystemStatusPanelProps {
  emotionState: EmotionState;
  adaptiveFitness: AdaptiveFitnessState;
  subQgGlobalMetrics: SubQgGlobalMetrics;
  activeSubQgJumpModifier: number;
  subQgJumpModifierActiveStepsRemaining: number;
  myraStressLevel: number; 
  subQgJumpInfo: SubQgJumpInfo | null;
  t: (key: string, substitutions?: Record<string, string>) => string;
  agentName: string; 
}

const MetricDisplay: React.FC<{ label: string; value: string | number; icon?: React.ReactNode; unit?: string, color?: string, t: SystemStatusPanelProps['t'] }> = ({ label, value, icon, unit, color="text-purple-300", t }) => (
  <div className="flex justify-between items-center py-1.5 px-2 bg-gray-700/50 rounded-md hover:bg-gray-600/50 transition-colors">
    <div className="flex items-center text-sm text-gray-300">
      {icon && <span className={`mr-2 ${color}`}>{icon}</span>}
      {t(label)}:
    </div>
    <div className={`text-sm font-semibold ${typeof value === 'number' ? 'text-green-300' : 'text-gray-200'}`}>
      {typeof value === 'number' && Number.isFinite(value) ? value.toFixed(3) : value} {unit}
    </div>
  </div>
);

const HeartbeatDisplay: React.FC<{ stressLevel: number, t: SystemStatusPanelProps['t'] }> = ({ stressLevel, t }) => {
  const [isPulsing, setIsPulsing] = useState(false);
  const baseHeartRate = 60; 
  const maxHeartRate = 150; 

  const currentHeartRate = baseHeartRate + (stressLevel * (maxHeartRate - baseHeartRate));
  const beatInterval = currentHeartRate > 0 ? 60000 / currentHeartRate : Infinity;

  useEffect(() => {
    if (beatInterval === Infinity || isNaN(beatInterval) || beatInterval <= 0) {
      setIsPulsing(false); 
      return;
    }

    let pulseTimeoutId: number;
    let intervalId: number;

    const performPulse = () => {
      setIsPulsing(true);
      pulseTimeoutId = window.setTimeout(() => {
        setIsPulsing(false);
      }, 150); 
    };
 
    performPulse(); 
    intervalId = window.setInterval(performPulse, beatInterval);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(pulseTimeoutId);
      setIsPulsing(false); 
    };
  }, [beatInterval]);

  const heartColor = stressLevel > 0.7 ? 'text-red-500' : stressLevel > 0.4 ? 'text-red-400' : 'text-pink-400';

  return (
    <div className="flex items-center py-2 px-2 bg-gray-700/50 rounded-md mt-2">
      <HeartIcon className={`w-7 h-7 mr-3 transition-all duration-150 ease-out ${heartColor} ${isPulsing ? 'scale-125 drop-shadow-[0_0_8px_rgba(255,50,50,0.7)]' : 'scale-100'}`} />
      <div>
        <div className="text-sm font-semibold text-gray-100">
          {Math.round(currentHeartRate)} {t('systemStatusPanel.vitals.bpm')}
        </div>
        <div className="text-xs text-gray-400">
          {t('systemStatusPanel.vitals.stressLevel')}: {stressLevel.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

const SubQGPulseIndicator: React.FC<{ jumpInfo: SubQgJumpInfo | null, modifier: number, t: SystemStatusPanelProps['t'] }> = ({ jumpInfo, modifier, t }) => {
  const [isPulsing, setIsPulsing] = useState(false);
  const prevJumpTimestampRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (jumpInfo && jumpInfo.timestamp !== prevJumpTimestampRef.current) {
      setIsPulsing(true);
      prevJumpTimestampRef.current = jumpInfo.timestamp;
      const timer = setTimeout(() => setIsPulsing(false), 700);
      return () => clearTimeout(timer);
    }
  }, [jumpInfo]);

  const pulseStrength = Math.min(1, Math.abs(modifier) * 2);
  const pulseColor = `rgba(0, 200, 255, ${0.5 + pulseStrength * 0.5})`;

  return (
    <div className="flex items-center py-1.5 px-2 bg-gray-700/50 rounded-md mt-2">
      <PulseWaveIcon className={`w-6 h-6 mr-2 transition-all duration-200 ease-out ${isPulsing ? 'scale-125 text-cyan-300' : 'scale-100 text-cyan-500'}`} 
        style={isPulsing ? { filter: `drop-shadow(0 0 6px ${pulseColor})` } : {}}
      />
      <div className="text-sm">
        {isPulsing ? (
          <span className="font-semibold text-cyan-300 animate-pulse">{t('systemStatusPanel.subQg.event')}</span>
        ) : (
          <span className="text-gray-400">{t('systemStatusPanel.subQg.statusStable')}</span>
        )}
      </div>
    </div>
  );
};


const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ 
  emotionState, adaptiveFitness, subQgGlobalMetrics, 
  activeSubQgJumpModifier, subQgJumpModifierActiveStepsRemaining, myraStressLevel,
  subQgJumpInfo, t, agentName
}) => {
  const dominantEmotion = Object.entries(emotionState)
    .filter(([key]) => !['pleasure', 'arousal', 'dominance'].includes(key)) 
    .reduce((max, [key, val]) => Math.abs(val) > Math.abs(emotionState[max.key as keyof EmotionState] || 0) ? { key, val } : max, { key: 'neutral', val: 0.0 });

  return (
    <div className="p-3 bg-gray-700/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-600 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-purple-300 flex items-center"><HeartIcon className="w-5 h-5 mr-2 text-pink-400"/>{t('systemStatusPanel.emotion.title')}</h3>
        <HeartbeatDisplay stressLevel={myraStressLevel} t={t} />
        <div className="space-y-1 text-xs mt-3">
          <MetricDisplay label="systemStatusPanel.emotion.pleasure" value={emotionState.pleasure} t={t}/>
          <MetricDisplay label="systemStatusPanel.emotion.arousal" value={emotionState.arousal} t={t}/>
          <MetricDisplay label="systemStatusPanel.emotion.dominance" value={emotionState.dominance} t={t}/>
          <MetricDisplay 
            label="systemStatusPanel.emotion.dominantAffect" 
            value={`${t(`systemStatusPanel.emotion.affects.${dominantEmotion.key.toLowerCase()}`, {defaultValue: dominantEmotion.key})} (${dominantEmotion.val.toFixed(2)})`} 
            color="text-red-400"
            t={t}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-purple-300 flex items-center"><AcademicCapIcon className="w-5 h-5 mr-2"/>{t('systemStatusPanel.fitness.title')}</h3>
        <div className="space-y-1 text-xs">
          <MetricDisplay label="systemStatusPanel.fitness.overallScore" value={adaptiveFitness.overallScore} icon={<ChartBarIcon className="w-4 h-4"/>} t={t}/>
          {adaptiveFitness.dimensions && Object.entries(adaptiveFitness.dimensions).map(([key, value]) => (
            <MetricDisplay 
              key={key} 
              label={`systemStatusPanel.fitness.dimensions.${key}`}
              value={value}
              t={t} 
            />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2 text-purple-300 flex items-center"><FireIcon className="w-5 h-5 mr-2"/>{t('systemStatusPanel.subQg.title')}</h3>
        <SubQGPulseIndicator jumpInfo={subQgJumpInfo} modifier={activeSubQgJumpModifier} t={t} />
        <div className="space-y-1 text-xs mt-3">
          <MetricDisplay label="systemStatusPanel.subQg.avgEnergy" value={subQgGlobalMetrics.avgEnergy} t={t}/>
          <MetricDisplay label="systemStatusPanel.subQg.stdEnergy" value={subQgGlobalMetrics.stdEnergy} t={t}/>
          <MetricDisplay label="systemStatusPanel.subQg.phaseCoherence" value={subQgGlobalMetrics.phaseCoherence} t={t}/>
           {activeSubQgJumpModifier !== 0 && (
            <MetricDisplay 
              label="systemStatusPanel.subQg.jumpModifierActive" 
              value={t('systemStatusPanel.subQg.jumpModifierValue', { value: activeSubQgJumpModifier.toFixed(3), steps: String(subQgJumpModifierActiveStepsRemaining) })}
              color="text-yellow-400"
              t={t}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemStatusPanel;

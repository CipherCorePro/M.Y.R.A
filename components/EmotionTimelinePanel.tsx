import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2'; // Changed import path back to standard
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale, // For time-based X-axis
  TooltipItem
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Adapter for date/time scales
import { PADRecord } from '../types';
import { interpretPAD } from '../utils/uiHelpers';
import { SparklesIcon, CpuChipIcon } from './IconComponents';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface EmotionTimelinePanelProps {
  padHistoryMyra: PADRecord[];
  padHistoryCaelum: PADRecord[];
  myraName: string;
  caelumName: string;
  t: (key: string, substitutions?: Record<string, string>) => string;
}

const EmotionTimelinePanel: React.FC<EmotionTimelinePanelProps> = ({
  padHistoryMyra,
  padHistoryCaelum,
  myraName,
  caelumName,
  t,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<'myra' | 'caelum'>('myra');

  const currentHistory = selectedAgent === 'myra' ? padHistoryMyra : padHistoryCaelum;
  const currentAgentName = selectedAgent === 'myra' ? myraName : caelumName;

  const chartData = {
    labels: currentHistory.map(d => d.timestamp),
    datasets: [
      {
        label: t('emotionTimeline.chart.pleasure', {defaultValue: 'Pleasure'}),
        data: currentHistory.map(d => d.pleasure),
        borderColor: 'hsl(120, 70%, 60%)', // Green
        backgroundColor: 'hsla(120, 70%, 60%, 0.5)',
        tension: 0.1,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
      {
        label: t('emotionTimeline.chart.arousal', {defaultValue: 'Arousal'}),
        data: currentHistory.map(d => d.arousal),
        borderColor: 'hsl(30, 90%, 60%)', // Orange
        backgroundColor: 'hsla(30, 90%, 60%, 0.5)',
        tension: 0.1,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
      {
        label: t('emotionTimeline.chart.dominance', {defaultValue: 'Dominance'}),
        data: currentHistory.map(d => d.dominance),
        borderColor: 'hsl(220, 90%, 65%)', // Blue
        backgroundColor: 'hsla(220, 90%, 65%, 0.5)',
        tension: 0.1,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#A094B8' }
      },
      title: {
        display: true,
        text: t('emotionTimeline.chart.title', { agentName: currentAgentName }),
        color: '#E0D8F0',
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'line'>) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(3);
            }
            // Find the corresponding PADRecord for additional tooltip info
            const dataIndex = context.dataIndex;
            if (currentHistory && currentHistory[dataIndex]) {
                const record = currentHistory[dataIndex];
                label += ` (${record.dominantAffect})`;
            }
            return label;
          },
          title: function(tooltipItems: TooltipItem<'line'>[]) {
            if (tooltipItems.length > 0) {
                const timestamp = tooltipItems[0].parsed.x;
                return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            }
            return '';
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'second' as const,
          tooltipFormat: 'HH:mm:ss' as const,
          displayFormats: {
            second: 'HH:mm:ss' as const,
          },
        },
        title: { display: true, text: t('emotionTimeline.chart.axisTime', {defaultValue: 'Time'}), color: '#A094B8' },
        ticks: { color: '#A094B8' },
        grid: { color: 'rgba(160, 148, 184, 0.2)'}
      },
      y: {
        min: -1,
        max: 1,
        title: { display: true, text: t('emotionTimeline.chart.axisValue', {defaultValue: 'Value (-1 to 1)'}), color: '#A094B8' },
        ticks: { color: '#A094B8' },
        grid: { color: 'rgba(160, 148, 184, 0.2)'}
      },
    },
  };

  const latestPadState = currentHistory.length > 0 ? currentHistory[currentHistory.length - 1] : null;
  const interpretation = latestPadState ? interpretPAD(latestPadState, t) : t('emotionTimeline.interpretation.noData', {defaultValue: "No data yet for interpretation."});

  return (
    <div className="p-2 sm:p-3 bg-gray-700/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-600 space-y-3 sm:space-y-4 h-full flex flex-col">
      <h3 className="text-md sm:text-lg font-semibold text-purple-300">{t('emotionTimeline.title')}</h3>
      
      <div className="flex space-x-2 mb-2 sm:mb-3">
        <button
          onClick={() => setSelectedAgent('myra')}
          className={`flex-1 py-1.5 px-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 flex items-center justify-center
            ${selectedAgent === 'myra' ? 'bg-myra-primary text-white shadow-md' : 'bg-tab-inactive text-tab-inactive-text hover:bg-tab-hover'}`}
        >
          <SparklesIcon className="w-4 h-4 mr-1.5" /> {myraName}
        </button>
        <button
          onClick={() => setSelectedAgent('caelum')}
          className={`flex-1 py-1.5 px-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 flex items-center justify-center
            ${selectedAgent === 'caelum' ? 'bg-caelum-primary text-white shadow-md' : 'bg-tab-inactive text-tab-inactive-text hover:bg-tab-hover'}`}
        >
          <CpuChipIcon className="w-4 h-4 mr-1.5" /> {caelumName}
        </button>
      </div>

      <div className="flex-grow h-[250px] sm:h-[300px] bg-gray-800/40 p-2 sm:p-3 rounded-md shadow-inner">
        {currentHistory.length > 0 ? (
          <Line options={chartOptions as any} data={chartData} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 italic">{t('emotionTimeline.chart.noData', { agentName: currentAgentName })}</p>
          </div>
        )}
      </div>

      <div className="mt-2 sm:mt-3 p-2 bg-gray-800/30 rounded-md">
        <h4 className="text-sm sm:text-base font-semibold text-purple-400 mb-1">{t('emotionTimeline.interpretation.title', { agentName: currentAgentName })}</h4>
        <p className="text-xs sm:text-sm text-gray-300">{interpretation}</p>
        {latestPadState && <p className="text-xs text-gray-400 mt-1">({t('emotionTimeline.interpretation.dominantAffect')}: {latestPadState.dominantAffect})</p>}
      </div>
    </div>
  );
};

export default EmotionTimelinePanel;
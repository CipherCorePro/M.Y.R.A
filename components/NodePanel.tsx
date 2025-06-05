
import React from 'react';
import { NodeState } from '../types';
import { BeakerIcon, LightBulbIcon, CpuChipIcon, HeartIcon, ScaleIcon, ShieldCheckIcon, UserGroupIcon, Cog6ToothIcon } from './IconComponents'; 

interface NodePanelProps {
  nodeStates: Record<string, NodeState>;
  t: (key: string, substitutions?: Record<string, string>) => string;
}

const LocalChartBarIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125Z" /></svg>;
const LocalExclamationTriangleIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>;


const getNodeIcon = (type: NodeState['type']) => {
  switch(type) {
    case 'semantic': return <Cog6ToothIcon className="w-4 h-4 text-blue-400"/>;
    case 'limbus': return <HeartIcon className="w-4 h-4 text-red-400"/>;
    case 'creativus': return <LightBulbIcon className="w-4 h-4 text-yellow-400"/>;
    case 'criticus': return <ScaleIcon className="w-4 h-4 text-indigo-400"/>;
    case 'metacognitio': return <CpuChipIcon className="w-4 h-4 text-purple-400"/>;
    case 'social': return <UserGroupIcon className="w-4 h-4 text-green-400"/>;
    case 'valuation': return <LocalChartBarIcon className="w-4 h-4 text-teal-400"/>; 
    case 'conflict': return <LocalExclamationTriangleIcon className="w-4 h-4 text-orange-400"/>;
    case 'executive': return <ShieldCheckIcon className="w-4 h-4 text-cyan-400"/>;
    default: return <BeakerIcon className="w-4 h-4 text-gray-400"/>;
  }
};


const NodeCard: React.FC<{ node: NodeState }> = ({ node }) => {
  return (
    <div className="p-2.5 bg-gray-700/60 rounded-lg shadow-md border border-gray-600/80 hover:border-purple-500/70 transition-all duration-150 ease-in-out">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center min-w-0"> {/* Added min-w-0 for truncation */}
          {getNodeIcon(node.type)}
          <h4 className="ml-2 text-sm font-semibold text-purple-300 truncate" title={node.label}>{node.label}</h4>
        </div>
        <span className={`px-1.5 py-0.5 text-xs rounded-full whitespace-nowrap ${ // Added whitespace-nowrap
          node.activation > 0.7 ? 'bg-green-500/30 text-green-300' : 
          node.activation > 0.3 ? 'bg-yellow-500/30 text-yellow-300' : 
          'bg-red-500/30 text-red-300'
        }`}>
          Act: {node.activation.toFixed(2)}
        </span>
      </div>
      <div className="w-full bg-gray-600 rounded-full h-1.5 mb-1">
        <div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${node.activation * 100}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-400 space-x-2 flex flex-wrap"> {/* Added flex-wrap */}
        <span>Res: {node.resonatorScore.toFixed(2)}</span>
        <span>Foc: {node.focusScore.toFixed(2)}</span>
        <span>Exp: {node.explorationScore.toFixed(2)}</span>
      </div>
       {node.type === 'limbus' && node.specificState && (
        <div className="mt-1 text-xs text-gray-400">
          P:{(node.specificState as any).pleasure?.toFixed(1)} A:{(node.specificState as any).arousal?.toFixed(1)} D:{(node.specificState as any).dominance?.toFixed(1)}
        </div>
      )}
      {node.type === 'metacognitio' && node.specificState && (
        <div className="mt-1 text-xs text-gray-400">
          Jumps: {(node.specificState as any).lastTotalJumps || 0}
        </div>
      )}
    </div>
  );
};

const NodePanel: React.FC<NodePanelProps> = ({ nodeStates, t }) => {
  const nodes = Object.values(nodeStates);
  const modulatorTypes: NodeState['type'][] = ['limbus', 'creativus', 'criticus', 'metacognitio', 'social', 'valuation', 'conflict', 'executive'];
  
  const modulatorNodes = nodes.filter(n => modulatorTypes.includes(n.type));
  const semanticNodes = nodes.filter(n => n.type === 'semantic');

  return (
    <div className="p-2 sm:p-3 bg-gray-700/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-600 space-y-3 sm:space-y-4">
      <div>
        <h3 className="text-md sm:text-lg font-semibold mb-2 text-purple-300">{t('nodePanel.modulatorNodes.title')}</h3>
        {modulatorNodes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {modulatorNodes.map(node => <NodeCard key={node.id} node={node} />)}
          </div>
        ) : (<p className="text-sm text-gray-400 italic">{t('nodePanel.modulatorNodes.empty')}</p>)}
      </div>
      <div>
        <h3 className="text-md sm:text-lg font-semibold mb-2 text-purple-300">{t('nodePanel.semanticNodes.title')}</h3>
         {semanticNodes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {semanticNodes.slice(0,4).map(node => <NodeCard key={node.id} node={node} />)}
          </div>
        ) : (<p className="text-sm text-gray-400 italic">{t('nodePanel.semanticNodes.empty')}</p>)}
        {semanticNodes.length > 4 && <p className="text-xs text-gray-400 mt-2">{t('nodePanel.semanticNodes.showingSome', { count: String(4), total: String(semanticNodes.length) })}</p>}
      </div>
    </div>
  );
};

export default NodePanel;

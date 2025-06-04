
import React, { useState } from 'react';
import { SubQgJumpInfo } from '../types';

interface SubQGDisplayProps {
  matrix: number[][];
  phaseMatrix: number[][];
  size: number;
  onInject: (x: number, y: number, energyDelta: number, phaseValue?: number) => void;
  jumpInfo: SubQgJumpInfo | null;
  t: (key: string, substitutions?: Record<string, string>) => string;
}

const SubQGDisplay: React.FC<SubQGDisplayProps> = ({ matrix, phaseMatrix, size, onInject, jumpInfo, t }) => {
  const [injectEnergy, setInjectEnergy] = useState<string>("0.1");
  const [injectPhase, setInjectPhase] = useState<string>(""); // Optional phase

  const getEnergyColor = (energy: number, phase: number) => {
    const hue = (phase / (2 * Math.PI)) * 360;
    const saturation = 70 + Math.min(30, energy * 500);
    const lightness = 30 + Math.min(40, energy * 700);
    return `hsl(${hue.toFixed(0)}, ${saturation.toFixed(0)}%, ${lightness.toFixed(0)}%)`;
  };

  const handleCellClick = (x: number, y: number) => {
    const energy = parseFloat(injectEnergy);
    const phase = injectPhase !== "" ? parseFloat(injectPhase) : undefined;
    if (!isNaN(energy)) {
      onInject(x, y, energy, phase);
    }
  };

  if (!matrix || matrix.length === 0 || matrix.length !== size || matrix[0].length !== size) {
    return <div className="p-2 bg-gray-700/60 backdrop-blur-sm rounded-md text-center text-gray-400 border border-gray-600">{t('subqgDisplay.error.matrixUnavailable', { size: String(size) })}</div>;
  }
   if (!phaseMatrix || phaseMatrix.length === 0 || phaseMatrix.length !== size || phaseMatrix[0].length !== size) {
    return <div className="p-2 bg-gray-700/60 backdrop-blur-sm rounded-md text-center text-gray-400 border border-gray-600">{t('subqgDisplay.error.phaseMatrixUnavailable', { size: String(size) })}</div>;
  }


  const cellSize = Math.max(8, 320 / size);

  return (
    <div className="p-3 bg-gray-700/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-600">
      <h3 className="text-lg font-semibold mb-3 text-purple-300">{t('subqgDisplay.title', { size: String(size) })}</h3>
      <div className="grid gap-px mb-3 bg-gray-900/50 border border-gray-600" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
        {matrix.map((row, i) =>
          row.map((energy, j) => (
            <div
              key={`${i}-${j}`}
              className="aspect-square cursor-pointer hover:outline hover:outline-2 hover:outline-purple-400 transition-all duration-100"
              style={{ 
                backgroundColor: getEnergyColor(energy, phaseMatrix[i]?.[j] || 0),
                width: `${cellSize}px`,
                height: `${cellSize}px`
              }}
              onClick={() => handleCellClick(i, j)}
              title={`(${i},${j}) E: ${energy.toFixed(3)} P: ${(phaseMatrix[i]?.[j] || 0).toFixed(3)}`}
            />
          ))
        )}
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <label htmlFor="injectEnergy" className="text-gray-300 w-24 flex-shrink-0">{t('subqgDisplay.label.injectEnergy')}:</label>
          <input
            type="number"
            id="injectEnergy"
            value={injectEnergy}
            onChange={(e) => setInjectEnergy(e.target.value)}
            step="0.01"
            className="flex-1 p-1.5 bg-gray-600 border border-gray-500 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-100 placeholder-gray-400"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="injectPhase" className="text-gray-300 w-24 flex-shrink-0">{t('subqgDisplay.label.setPhase')}:</label>
          <input
            type="number"
            id="injectPhase"
            value={injectPhase}
            onChange={(e) => setInjectPhase(e.target.value)}
            step="0.1"
            min="0"
            max={(2 * Math.PI).toFixed(2)}
            placeholder={t('subqgDisplay.placeholder.phase', { maxPhase: (2 * Math.PI).toFixed(2) })}
            className="flex-1 p-1.5 bg-gray-600 border border-gray-500 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-100 placeholder-gray-400"
          />
        </div>
        <p className="text-xs text-gray-400 italic">{t('subqgDisplay.info.clickToInject')}</p>
      </div>
      {jumpInfo && (
        <div className="mt-3 p-2 bg-purple-600/20 border border-purple-500 rounded-md text-xs">
          <p className="font-semibold text-purple-300">{t('subqgDisplay.jump.detected')}</p>
          <p>{t('subqgDisplay.jump.type')}: {jumpInfo.type}</p>
          {jumpInfo.peakEnergyBeforeDecay !== undefined && <p>{t('subqgDisplay.jump.peakE')}: {jumpInfo.peakEnergyBeforeDecay.toFixed(4)}</p>}
          {jumpInfo.peakCoherenceBeforeDecay !== undefined && <p>{t('subqgDisplay.jump.peakC')}: {jumpInfo.peakCoherenceBeforeDecay.toFixed(4)}</p>}
        </div>
      )}
    </div>
  );
};

export default SubQGDisplay;

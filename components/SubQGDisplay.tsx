
import React, { useState, useRef, useEffect } from 'react';
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
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(20);

  useEffect(() => {
    const calculateCellSize = () => {
      if (gridContainerRef.current) {
        const containerWidth = gridContainerRef.current.offsetWidth;
        // Ensure at least a minimum size for cells, allow for slight padding/border
        const calculated = Math.max(8, (containerWidth / size) - 1); 
        setCellSize(calculated);
      } else {
        // Fallback for SSR or if ref not ready, adjust as needed
        setCellSize(Math.max(8, 300 / size)); 
      }
    };

    calculateCellSize();
    window.addEventListener('resize', calculateCellSize);
    return () => window.removeEventListener('resize', calculateCellSize);
  }, [size]);


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

  return (
    <div className="p-2 sm:p-3 bg-gray-700/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-600">
      <h3 className="text-md sm:text-lg font-semibold mb-2 sm:mb-3 text-purple-300">{t('subqgDisplay.title', { size: String(size) })}</h3>
      <div ref={gridContainerRef} className="overflow-x-auto fancy-scrollbar mb-3">
        <div className="grid gap-px bg-gray-900/50 border border-gray-600" style={{ gridTemplateColumns: `repeat(${size}, minmax(${cellSize}px, 1fr))`, width: `${size * (cellSize + 0.5)}px` /* Account for gap/border */ }}>
          {matrix.map((row, i) =>
            row.map((energy, j) => (
              <div
                key={`${i}-${j}`}
                className="aspect-square cursor-pointer hover:outline hover:outline-1 hover:outline-purple-400 transition-all duration-100"
                style={{ 
                  backgroundColor: getEnergyColor(energy, phaseMatrix[i]?.[j] || 0),
                  // width and height are implicitly set by grid cell size and aspect-square
                }}
                onClick={() => handleCellClick(i, j)}
                title={`(${i},${j}) E: ${energy.toFixed(3)} P: ${(phaseMatrix[i]?.[j] || 0).toFixed(3)}`}
              />
            ))
          )}
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
          <label htmlFor="injectEnergy" className="text-gray-300 mb-1 sm:mb-0 sm:w-28 flex-shrink-0">{t('subqgDisplay.label.injectEnergy')}:</label>
          <input
            type="number"
            id="injectEnergy"
            value={injectEnergy}
            onChange={(e) => setInjectEnergy(e.target.value)}
            step="0.01"
            className="flex-1 p-1.5 bg-gray-600 border border-gray-500 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-100 placeholder-gray-400 text-sm"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
          <label htmlFor="injectPhase" className="text-gray-300 mb-1 sm:mb-0 sm:w-28 flex-shrink-0">{t('subqgDisplay.label.setPhase')}:</label>
          <input
            type="number"
            id="injectPhase"
            value={injectPhase}
            onChange={(e) => setInjectPhase(e.target.value)}
            step="0.1"
            min="0"
            max={(2 * Math.PI).toFixed(2)}
            placeholder={t('subqgDisplay.placeholder.phase', { maxPhase: (2 * Math.PI).toFixed(2) })}
            className="flex-1 p-1.5 bg-gray-600 border border-gray-500 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-100 placeholder-gray-400 text-sm"
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

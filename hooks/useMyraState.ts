import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  MyraConfig, ChatMessage, EmotionState, NodeState, 
  AdaptiveFitnessState, SubQgGlobalMetrics, SubQgJumpInfo, 
  GeminiGenerateContentResponse, RNGType, TextChunk
} from '../types';
import { 
  INITIAL_CONFIG, INITIAL_EMOTION_STATE, INITIAL_NODE_STATES, 
  INITIAL_ADAPTIVE_FITNESS_STATE, INITIAL_SUBQG_GLOBAL_METRICS 
} from '../constants';
import { callAiApi } from '../services/aiService'; 
import { v4 as uuidv4 } from 'uuid';
import { RNG, SubQGRNG, QuantumRNG } from '../utils/rng';
import { addChunksToDB, getAllChunksFromDB, clearAllChunksFromDB } from '../utils/db';
import { AdaptiveFitnessManager } from '../utils/adaptiveFitnessManager'; // Import the manager

export const useMyraState = () => {
  const [myraConfig, setMyraConfig] = useState<MyraConfig>(INITIAL_CONFIG);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [emotionState, setEmotionState] = useState<EmotionState>(INITIAL_EMOTION_STATE);
  const [nodeStates, setNodeStates] = useState<Record<string, NodeState>>(
    INITIAL_NODE_STATES.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {} as Record<string, NodeState>)
  );
  const [adaptiveFitness, setAdaptiveFitness] = useState<AdaptiveFitnessState>(INITIAL_ADAPTIVE_FITNESS_STATE);
  
  const [subQgMatrix, setSubQgMatrix] = useState<number[][]>(
    Array(INITIAL_CONFIG.subqgSize).fill(null).map(() => 
      Array(INITIAL_CONFIG.subqgSize).fill(INITIAL_CONFIG.subqgBaseEnergy)
    )
  );
  const [subQgPhaseMatrix, setSubQgPhaseMatrix] = useState<number[][]>(
    Array(INITIAL_CONFIG.subqgSize).fill(null).map(() => 
      Array(INITIAL_CONFIG.subqgSize).fill(0).map(() => Math.random() * 2 * Math.PI)
    )
  );
  const [subQgGlobalMetrics, setSubQgGlobalMetrics] = useState<SubQgGlobalMetrics>(
    calculateSubQgMetricsInitial(subQgMatrix, subQgPhaseMatrix)
  );
  
  const [subQgJumpInfo, setSubQgJumpInfo] = useState<SubQgJumpInfo | null>(null);
  const [activeSubQgJumpModifier, setActiveSubQgJumpModifier] = useState<number>(0);
  const [subQgJumpModifierActiveStepsRemaining, setSubQgJumpModifierActiveStepsRemaining] = useState<number>(0);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);

  const [trackingPotentialJump, setTrackingPotentialJump] = useState<boolean>(false);
  const [peakEnergyAtCoherence, setPeakEnergyAtCoherence] = useState<number | null>(null);
  const [peakCoherenceValue, setPeakCoherenceValue] = useState<number | null>(null);
  const [stepsSincePeakTracked, setStepsSincePeakTracked] = useState<number>(0);

  const rngRef = useRef<RNG>(new SubQGRNG(INITIAL_CONFIG.subqgSeed)); 

  const [processedTextChunks, setProcessedTextChunks] = useState<TextChunk[]>([]);
  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState<boolean>(false);

  const fitnessManagerRef = useRef<AdaptiveFitnessManager>(
    new AdaptiveFitnessManager(myraConfig, () => ({
      nodes: nodeStates,
      emotionState: emotionState,
      subQgGlobalMetrics: subQgGlobalMetrics,
      processedTextChunksCount: processedTextChunks.length,
    }))
  );

  useEffect(() => {
    fitnessManagerRef.current.updateConfig(myraConfig);
  }, [myraConfig]);


  // Load chunks from DB on initial mount
  useEffect(() => {
    const loadInitialChunks = async () => {
      setIsLoadingKnowledge(true);
      try {
        const chunksFromDB = await getAllChunksFromDB();
        setProcessedTextChunks(chunksFromDB);
        // Initialize fitness manager's chunk count after loading from DB
        fitnessManagerRef.current = new AdaptiveFitnessManager(myraConfig, () => ({
            nodes: nodeStates, // This might be stale if nodeStates isn't updated yet, but primarily for chunk count
            emotionState: emotionState,
            subQgGlobalMetrics: subQgGlobalMetrics,
            processedTextChunksCount: chunksFromDB.length,
        }));

      } catch (error) {
        console.error("Error loading initial chunks from DB:", error);
      } finally {
        setIsLoadingKnowledge(false);
      }
    };
    loadInitialChunks();
  }, []); // myraConfig, nodeStates, emotionState, subQgGlobalMetrics removed to avoid re-creating manager too often.
           // This might mean the manager has slightly stale state on first fitness calculation if other states update before it.
           // Consider a more robust way to update the manager's getSystemState if needed.

  useEffect(() => {
    if (myraConfig.rngType === 'subqg') {
      rngRef.current = new SubQGRNG(myraConfig.subqgSeed);
    } else {
      rngRef.current = new QuantumRNG();
    }
  }, [myraConfig.rngType, myraConfig.subqgSeed]);


  const updateMyraConfig = (newConfigPartial: Partial<MyraConfig>) => {
    setMyraConfig(prevConfig => {
      const updatedConfig = { ...prevConfig, ...newConfigPartial };
      
      if (newConfigPartial.subqgSize && newConfigPartial.subqgSize !== prevConfig.subqgSize) {
        const newSize = newConfigPartial.subqgSize;
        const newEnergyMatrix = Array(newSize).fill(null).map(() =>
            Array(newSize).fill(updatedConfig.subqgBaseEnergy)
        );
        const newPhaseMatrix = Array(newSize).fill(null).map(() =>
            Array(newSize).fill(0).map(() => rngRef.current.next() * 2 * Math.PI) 
        );
        setSubQgMatrix(newEnergyMatrix);
        setSubQgPhaseMatrix(newPhaseMatrix);
        setSubQgGlobalMetrics(calculateSubQgMetricsInitial(newEnergyMatrix, newPhaseMatrix));
      }
      fitnessManagerRef.current.updateConfig(updatedConfig); // Update fitness manager config
      return updatedConfig;
    });
  };
  
  function calculateSubQgMetricsInitial(energyMatrix: number[][], phaseMatrix: number[][]): SubQgGlobalMetrics {
    if (!energyMatrix || energyMatrix.length === 0 || energyMatrix[0].length === 0) return INITIAL_SUBQG_GLOBAL_METRICS;
    const energies = energyMatrix.flat();
    const avgEnergy = energies.reduce((sum, val) => sum + val, 0) / energies.length;
    const stdEnergy = Math.sqrt(energies.reduce((sum, val) => sum + Math.pow(val - avgEnergy, 2), 0) / energies.length);

    const phases = phaseMatrix.flat();
    if (phases.length === 0) return { avgEnergy, stdEnergy, phaseCoherence: 0 };
    
    const numElements = phases.length;
    if (numElements === 0) return { avgEnergy, stdEnergy, phaseCoherence: 0 };

    let sumCos = 0;
    let sumSin = 0;
    for (const phase of phases) {
        sumCos += Math.cos(phase);
        sumSin += Math.sin(phase);
    }
    const meanComplexPhaseVectorX = sumCos / numElements;
    const meanComplexPhaseVectorY = sumSin / numElements;
    const phaseCoherence = Math.sqrt(meanComplexPhaseVectorX**2 + meanComplexPhaseVectorY**2);
    
    return { avgEnergy, stdEnergy, phaseCoherence };
  }

  const calculateSubQgMetrics = useCallback((energyMatrix: number[][], phaseMatrix: number[][]): SubQgGlobalMetrics => {
    return calculateSubQgMetricsInitial(energyMatrix, phaseMatrix);
  }, []);


  const detectSubQgJump = useCallback((currentMetrics: SubQgGlobalMetrics, config: MyraConfig) => {
    const { avgEnergy: currentAvgEnergy, phaseCoherence: currentPhaseCoherence } = currentMetrics;
    const { 
      subqgJumpMinEnergyAtPeak, subqgJumpMinCoherenceAtPeak, subqgJumpCoherenceDropFactor, 
      subqgJumpEnergyDropFactorFromPeak, subqgJumpMaxStepsToTrackPeak 
    } = config;

    let newJumpInfo: SubQgJumpInfo | null = null;
    let _trackingPotentialJump = trackingPotentialJump;
    let _peakEnergyAtCoherence = peakEnergyAtCoherence;
    let _peakCoherenceValue = peakCoherenceValue;
    let _stepsSincePeakTracked = stepsSincePeakTracked;

    if (!_trackingPotentialJump) {
      if (currentAvgEnergy > subqgJumpMinEnergyAtPeak && currentPhaseCoherence > subqgJumpMinCoherenceAtPeak) {
        _trackingPotentialJump = true;
        _peakEnergyAtCoherence = currentAvgEnergy;
        _peakCoherenceValue = currentPhaseCoherence;
        _stepsSincePeakTracked = 0;
      }
    } else if (_peakCoherenceValue !== null && _peakEnergyAtCoherence !== null) {
      _stepsSincePeakTracked += 1;
      const coherenceHasDropped = currentPhaseCoherence < _peakCoherenceValue * (1 - subqgJumpCoherenceDropFactor);
      const energyHasDropped = currentAvgEnergy < _peakEnergyAtCoherence * (1 - subqgJumpEnergyDropFactorFromPeak);

      if (coherenceHasDropped || energyHasDropped) {
        newJumpInfo = {
          type: "energy_phase_resonance_peak_decay",
          peakEnergyBeforeDecay: _peakEnergyAtCoherence,
          peakCoherenceBeforeDecay: _peakCoherenceValue,
          currentEnergyAtDecayDetection: currentAvgEnergy,
          currentCoherenceAtDecayDetection: currentPhaseCoherence,
          reasonForDecayDetection: coherenceHasDropped && !energyHasDropped ? "coherence_drop" : 
                                   energyHasDropped && !coherenceHasDropped ? "energy_drop" : 
                                   "both_coherence_and_energy_dropped",
          stepsFromPeakToDecay: _stepsSincePeakTracked,
          timestamp: Date.now()
        };
        _trackingPotentialJump = false; _peakEnergyAtCoherence = null; _peakCoherenceValue = null; _stepsSincePeakTracked = 0;
      } else if (currentAvgEnergy >= _peakEnergyAtCoherence && currentPhaseCoherence >= _peakCoherenceValue && (currentAvgEnergy > _peakEnergyAtCoherence || currentPhaseCoherence > _peakCoherenceValue)) {
         if (currentPhaseCoherence > subqgJumpMinCoherenceAtPeak) { 
            _peakEnergyAtCoherence = currentAvgEnergy; _peakCoherenceValue = currentPhaseCoherence; _stepsSincePeakTracked = 0;
         }
      }
      if (_trackingPotentialJump && _stepsSincePeakTracked >= subqgJumpMaxStepsToTrackPeak) {
        _trackingPotentialJump = false; _peakEnergyAtCoherence = null; _peakCoherenceValue = null; _stepsSincePeakTracked = 0;
      }
    }
    setTrackingPotentialJump(_trackingPotentialJump); setPeakEnergyAtCoherence(_peakEnergyAtCoherence); setPeakCoherenceValue(_peakCoherenceValue); setStepsSincePeakTracked(_stepsSincePeakTracked);
    return newJumpInfo;
  }, [trackingPotentialJump, peakEnergyAtCoherence, peakCoherenceValue, stepsSincePeakTracked]);

  const simulateSubQgStep = useCallback(() => {
    const currentConfig = myraConfig; const size = currentConfig.subqgSize; const currentRNG = rngRef.current;
    const newCalculatedEnergyMatrix = subQgMatrix.map(row => [...row]); const newCalculatedPhaseMatrix = subQgPhaseMatrix.map(row => [...row]);

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        let neighborEnergySum = 0; let neighborPhaseSumX = 0; let neighborPhaseSumY = 0; let validNeighbors = 0;
        for (const [dx, dy] of [[-1,0], [1,0], [0,-1], [0,1]]) {
          const ni = (i + dx + size) % size; const nj = (j + dy + size) % size;
          neighborEnergySum += subQgMatrix[ni][nj]; neighborPhaseSumX += Math.cos(subQgPhaseMatrix[ni][nj]); neighborPhaseSumY += Math.sin(subQgPhaseMatrix[ni][nj]); validNeighbors++;
        }
        const avgNeighborEnergy = validNeighbors > 0 ? neighborEnergySum / validNeighbors : subQgMatrix[i][j];
        const energyDelta = currentConfig.subqgCoupling * (avgNeighborEnergy - subQgMatrix[i][j]);
        newCalculatedEnergyMatrix[i][j] = Math.max(0, Math.min(1, subQgMatrix[i][j] + energyDelta));
        const avgNeighborPhase = validNeighbors > 0 ? Math.atan2(neighborPhaseSumY / validNeighbors, neighborPhaseSumX / validNeighbors) : subQgPhaseMatrix[i][j];
        const phaseDeltaFromDiffusion = currentConfig.subqgPhaseDiffusionFactor * (avgNeighborPhase - subQgPhaseMatrix[i][j]);
        const phaseDeltaFromEnergy = energyDelta * currentConfig.subqgPhaseEnergyCouplingFactor;
        newCalculatedPhaseMatrix[i][j] = (subQgPhaseMatrix[i][j] + phaseDeltaFromDiffusion + phaseDeltaFromEnergy + 2 * Math.PI) % (2 * Math.PI);
      }
    }
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        newCalculatedEnergyMatrix[i][j] = Math.max(0, Math.min(1, newCalculatedEnergyMatrix[i][j] + (currentRNG.next() - 0.5) * currentConfig.subqgInitialEnergyNoiseStd));
      }
    }
    setSubQgMatrix(newCalculatedEnergyMatrix); setSubQgPhaseMatrix(newCalculatedPhaseMatrix);
    const newGlobalMetrics = calculateSubQgMetrics(newCalculatedEnergyMatrix, newCalculatedPhaseMatrix); setSubQgGlobalMetrics(newGlobalMetrics);
    const jumpDetected = detectSubQgJump(newGlobalMetrics, currentConfig);
    if (jumpDetected) {
      setSubQgJumpInfo(jumpDetected);
      const peakE = jumpDetected.peakEnergyBeforeDecay || 0; const peakC = jumpDetected.peakCoherenceBeforeDecay || 0;
      const normPeakE = Math.tanh(peakE * 20); const jumpModifier = (normPeakE * 0.6 + peakC * 0.4) * currentConfig.subqgJumpQnsDirectModifierStrength;
      setActiveSubQgJumpModifier(jumpModifier); setSubQgJumpModifierActiveStepsRemaining(currentConfig.subqgJumpActiveDuration);
    }
  }, [myraConfig, subQgMatrix, subQgPhaseMatrix, calculateSubQgMetrics, detectSubQgJump]);

  const injectSubQgStimulus = useCallback((x: number, y: number, energyDelta: number, phaseValue?: number) => {
    const currentConfig = myraConfig;
    setSubQgMatrix(prev => { const newMatrix = prev.map(row => [...row]); if (x >= 0 && x < currentConfig.subqgSize && y >= 0 && y < currentConfig.subqgSize) { newMatrix[x][y] = Math.max(0, Math.min(1, newMatrix[x][y] + energyDelta)); } return newMatrix; });
    if (phaseValue !== undefined) { setSubQgPhaseMatrix(prev => { const newPhaseMatrix = prev.map(row => [...row]); if (x >= 0 && x < currentConfig.subqgSize && y >= 0 && y < currentConfig.subqgSize) { newPhaseMatrix[x][y] = (phaseValue + 2 * Math.PI) % (2 * Math.PI); } return newPhaseMatrix; }); }
    // Recalculate global metrics after injection might be good, but could be deferred to next sim step
    // For now, let it be updated in the next simulateSubQgStep
  }, [myraConfig]);

  const updateEmotionState = useCallback((geminiResponse?: GeminiGenerateContentResponse) => {
    const currentConfig = myraConfig; const currentRNG = rngRef.current;
    setEmotionState(prev => { const newState = { ...prev }; if (geminiResponse && !geminiResponse.text.toLowerCase().includes("error")) { newState.pleasure += 0.02; newState.arousal += 0.03; } for (const key in newState) { newState[key as keyof EmotionState] *= currentConfig.emotionDecay; newState[key as keyof EmotionState] = Math.max(-1, Math.min(1, newState[key as keyof EmotionState] + (currentRNG.next() - 0.5) * 0.05)); } return newState; });
  }, [myraConfig]);

  const updateNodeActivations = useCallback((geminiResponse?: GeminiGenerateContentResponse) => {
    const currentConfig = myraConfig; const currentRNG = rngRef.current;
    setNodeStates(prev => { 
      const newStates = { ...prev }; 
      for (const id in newStates) { 
        newStates[id].activation *= currentConfig.nodeActivationDecay; 
        newStates[id].activation = Math.max(0, Math.min(1, newStates[id].activation + (currentRNG.next() - 0.45) * 0.1)); 
        
        // Update specific states for modulator nodes
        if (newStates[id].type === 'limbus' && newStates[id].specificState) { 
          (newStates[id].specificState as EmotionState) = emotionState; // Keep specificState emotionState in sync
          newStates[id].activation = (emotionState.arousal + emotionState.pleasure + 2) / 4; // Limbus activation based on P/A
        } else if (newStates[id].type === 'creativus') {
            newStates[id].activation = Math.max(0, Math.min(1, newStates[id].activation + (currentRNG.next() - 0.4) * 0.15)); // Creativus has some randomness
            if (geminiResponse && geminiResponse.text.length > 100) newStates[id].activation += 0.05;
        } else if (newStates[id].type === 'criticus') {
             newStates[id].activation = Math.max(0, Math.min(1, newStates[id].activation + (currentRNG.next() - 0.6) * 0.1)); // Criticus more stable
        } else if (newStates[id].type === 'metacognitio') {
            if (subQgJumpInfo) newStates[id].activation += 0.2; 
            if (newStates[id].specificState) (newStates[id].specificState as {lastTotalJumps: number}).lastTotalJumps = subQgJumpInfo ? ((newStates[id].specificState as any).lastTotalJumps || 0) +1 : ((newStates[id].specificState as any).lastTotalJumps || 0);
            newStates[id].activation = Math.max(0, Math.min(1, newStates[id].activation + (Object.values(prev).reduce((sum, n) => sum + n.activation, 0) / Object.keys(prev).length - 0.5) * 0.05 )); // influenced by avg network activation
        }
        // Simplified updates for other behavioral modulators (can be made more specific)
        else if (newStates[id].type === 'social' && newStates[id].specificState) {
            (newStates[id].specificState as {empathyLevel: number}).empathyLevel = Math.max(0, Math.min(1, (emotionState.pleasure + 1)/2 * 0.6 + currentRNG.next() * 0.4));
            newStates[id].activation = (newStates[id].specificState as {empathyLevel: number}).empathyLevel;
        } else if (newStates[id].type === 'valuation' && newStates[id].specificState) {
            (newStates[id].specificState as {valuationScore: number}).valuationScore = Math.max(0, Math.min(1, (emotionState.greed + 1)/2 * 0.7 + (currentRNG.next() - 0.5) * 0.3));
            newStates[id].activation = (newStates[id].specificState as {valuationScore: number}).valuationScore;
        } else if (newStates[id].type === 'conflict' && newStates[id].specificState) {
             const conflictSource = Math.abs(emotionState.anger) * 0.3 + Math.abs(emotionState.fear) * 0.3 + Math.abs(emotionState.greed - ((newStates['SocialCognitor']?.specificState as any)?.empathyLevel || 0.5)) * 0.4;
            (newStates[id].specificState as {conflictLevel: number}).conflictLevel = Math.max(0, Math.min(1, conflictSource));
            newStates[id].activation = (newStates[id].specificState as {conflictLevel: number}).conflictLevel;
        } else if (newStates[id].type === 'executive' && newStates[id].specificState) {
             const controlSignal = (emotionState.dominance + 1)/2 * 0.5 + (1 - ((newStates['ConflictMonitor']?.specificState as any)?.conflictLevel || 0)) * 0.5;
            (newStates[id].specificState as {impulseControlLevel: number}).impulseControlLevel = Math.max(0, Math.min(1, controlSignal));
            newStates[id].activation = (newStates[id].specificState as {impulseControlLevel: number}).impulseControlLevel;
        }

        // Generic resonator/focus/exploration scores (can be refined by fitness system later)
        newStates[id].resonatorScore = currentRNG.next() * 0.4 + 0.3 + activeSubQgJumpModifier * 0.1;
        newStates[id].focusScore = currentRNG.next() * 0.3; // Placeholder
        newStates[id].explorationScore = currentRNG.next() * 0.3 + activeSubQgJumpModifier * 0.05; // Placeholder
        
        newStates[id].activation = Math.max(0, Math.min(1, newStates[id].activation + activeSubQgJumpModifier * 0.2)); 
      } 
      return newStates; 
    });
  }, [myraConfig, emotionState, subQgJumpInfo, activeSubQgJumpModifier]);


  const simulateNetworkStep = useCallback(() => {
    setSimulationStep(prev => prev + 1); 
    simulateSubQgStep(); 
    updateEmotionState(); 
    updateNodeActivations();
    
    if(subQgJumpModifierActiveStepsRemaining > 0) { 
      setSubQgJumpModifierActiveStepsRemaining(prev => prev -1); 
      if(subQgJumpModifierActiveStepsRemaining -1 === 0) { 
        setActiveSubQgJumpModifier(0); 
      } 
    }
    
    if (simulationStep % myraConfig.adaptiveFitnessUpdateInterval === 0) { 
      // Update fitness state using the manager
      const newFitnessState = fitnessManagerRef.current.calculateMetricsAndFitness();
      setAdaptiveFitness(newFitnessState);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulateSubQgStep, updateEmotionState, updateNodeActivations, myraConfig.adaptiveFitnessUpdateInterval, subQgJumpModifierActiveStepsRemaining, simulationStep]);
  // Removed fitnessManagerRef from deps to avoid re-creating interval if only its internal state changes. Config changes are handled.

  useEffect(() => { 
    const intervalId = setInterval(simulateNetworkStep, 2000); 
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulateNetworkStep]);

  const loadAndProcessFile = useCallback(async (file: File) => {
    if (!file || !file.type.startsWith('text/')) {
      alert('Please upload a valid text file.');
      return;
    }
    setIsLoadingKnowledge(true);
    try {
      const text = await file.text();
      const sourceName = file.name;
      const newChunks: TextChunk[] = [];
      let currentIdx = 0;
      const chunkSize = myraConfig.ragChunkSize;
      const chunkOverlap = myraConfig.ragChunkOverlap;

      for (let i = 0; i < text.length; i += chunkSize - chunkOverlap) {
        const chunkText = text.substring(i, i + chunkSize);
        if (chunkText.trim()) {
          newChunks.push({
            id: uuidv4(),
            source: sourceName,
            index: currentIdx++,
            text: chunkText.trim(),
          });
        }
      }
      await addChunksToDB(newChunks);
      const updatedProcessedChunks = [...processedTextChunks, ...newChunks];
      setProcessedTextChunks(updatedProcessedChunks);
      // Update fitness manager with new chunk count
       fitnessManagerRef.current = new AdaptiveFitnessManager(myraConfig, () => ({
            nodes: nodeStates,
            emotionState: emotionState,
            subQgGlobalMetrics: subQgGlobalMetrics,
            processedTextChunksCount: updatedProcessedChunks.length,
        }));

    } catch (error) {
      console.error("Error processing file and adding to DB:", error);
      alert(`Error processing file: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoadingKnowledge(false);
    }
  }, [myraConfig, processedTextChunks, nodeStates, emotionState, subQgGlobalMetrics]);

  const clearAllKnowledge = useCallback(async () => {
    setIsLoadingKnowledge(true);
    try {
      await clearAllChunksFromDB();
      setProcessedTextChunks([]);
      // Update fitness manager with zero chunk count
       fitnessManagerRef.current = new AdaptiveFitnessManager(myraConfig, () => ({
            nodes: nodeStates,
            emotionState: emotionState,
            subQgGlobalMetrics: subQgGlobalMetrics,
            processedTextChunksCount: 0,
        }));
    } catch (error) {
      console.error("Error clearing knowledge from DB:", error);
      alert(`Error clearing knowledge: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoadingKnowledge(false);
    }
  }, [myraConfig, nodeStates, emotionState, subQgGlobalMetrics]);

  const retrieveRelevantChunks = useCallback((prompt: string): TextChunk[] => {
    if (!processedTextChunks.length) return [];

    const promptKeywords = prompt.toLowerCase().split(/\s+/).filter(k => k.length > 2); 
    if (!promptKeywords.length) return [];

    const scoredChunks = processedTextChunks.map(chunk => {
      let score = 0;
      const chunkTextLower = chunk.text.toLowerCase();
      promptKeywords.forEach(keyword => {
        if (chunkTextLower.includes(keyword)) {
          score++;
        }
      });
      return { chunk, score };
    });

    scoredChunks.sort((a, b) => b.score - a.score);
    return scoredChunks.filter(sc => sc.score > 0).slice(0, myraConfig.ragMaxChunksToRetrieve).map(sc => sc.chunk);
  }, [processedTextChunks, myraConfig.ragMaxChunksToRetrieve]);


  const generateMyraResponse = useCallback(async (prompt: string) => {
    setIsLoading(true);
    const userMessage: ChatMessage = { id: uuidv4(), role: 'user', content: prompt, timestamp: Date.now() };
    setChatHistory(prevChatHistory => [...prevChatHistory, userMessage]);

    const currentGenerationConfig = myraConfig;
    let systemInstruction = `${currentGenerationConfig.myraRoleDescription}\n\nCORE PRINCIPLES:\n${currentGenerationConfig.myraEthicsPrinciples}\n\nINTERNAL STATE CONTEXT:\n`;
    systemInstruction += `Emotion State (PAD): P=${emotionState.pleasure.toFixed(2)}, A=${emotionState.arousal.toFixed(2)}, D=${emotionState.dominance.toFixed(2)}. `;
    systemInstruction += `Negative Affects: Anger=${emotionState.anger.toFixed(2)}, Disgust=${emotionState.disgust.toFixed(2)}, Fear=${emotionState.fear.toFixed(2)}, Greed=${emotionState.greed.toFixed(2)}.\n`;
    const metaNode = nodeStates['MetaCognitio']; const creativusNode = nodeStates['Creativus']; const criticusNode = nodeStates['CortexCriticus'];
    systemInstruction += `Cognitive State: MetaCognition Activation=${metaNode?.activation.toFixed(2)} (Jumps: ${metaNode?.specificState?.lastTotalJumps || 0}), Creativus Activation=${creativusNode?.activation.toFixed(2)}, Criticus Activation=${criticusNode?.activation.toFixed(2)}.\n`;
    const socialNode = nodeStates['SocialCognitor']; const valuationNode = nodeStates['ValuationSystem']; const conflictNode = nodeStates['ConflictMonitor']; const executiveNode = nodeStates['ExecutiveControl'];
    systemInstruction += `Behavioral Modulators: Empathy=${socialNode?.specificState?.empathyLevel.toFixed(2) || 'N/A'}, Valuation=${valuationNode?.specificState?.valuationScore.toFixed(2) || 'N/A'}, Conflict=${conflictNode?.specificState?.conflictLevel.toFixed(2) || 'N/A'}, ImpulseControl=${executiveNode?.specificState?.impulseControlLevel.toFixed(2) || 'N/A'}.\n`;
    
    // Use the fitness state from the AdaptiveFitnessManager
    const currentFitnessState = fitnessManagerRef.current.calculateMetricsAndFitness(); // Recalculate for freshest state
    setAdaptiveFitness(currentFitnessState); // Update state for UI consistency before AI call

    systemInstruction += `Adaptive Fitness: Overall=${currentFitnessState.overallScore.toFixed(2)} (KE: ${currentFitnessState.dimensions.knowledgeExpansion.toFixed(2)}, IC: ${currentFitnessState.dimensions.internalCoherence.toFixed(2)}, EC: ${currentFitnessState.dimensions.expressiveCreativity.toFixed(2)}, GF: ${currentFitnessState.dimensions.goalFocus.toFixed(2)}).\n`;
    if (activeSubQgJumpModifier !== 0) { systemInstruction += `SubQG Event: A significant quantum-like fluctuation (jump) was recently detected. Modifier impact: ${activeSubQgJumpModifier.toFixed(3)}. This may influence my current processing and responsiveness.\n`; }
    
    const relevantChunks = retrieveRelevantChunks(prompt);
    if (relevantChunks.length > 0) {
      systemInstruction += "\n\nRELEVANT INFORMATION FROM KNOWLEDGE BASE (use this to inform your response if applicable):\n";
      relevantChunks.forEach(chunk => {
        systemInstruction += `--- [Source: ${chunk.source}, Part ${chunk.index + 1}] ---\n${chunk.text}\n`;
      });
       systemInstruction += "--- [End of Knowledge Base Information] ---\n";
    }

    systemInstruction += `\nRESPONSE INSTRUCTION:\n${currentGenerationConfig.myraResponseInstruction}`;
    
    let currentTemperature = currentGenerationConfig.temperatureBase;
    currentTemperature += emotionState.arousal * currentGenerationConfig.temperatureLimbusInfluence;
    currentTemperature += (nodeStates['Creativus']?.activation || 0) * currentGenerationConfig.temperatureCreativusInfluence; 
    currentTemperature = Math.max(0.1, Math.min(1.0, currentTemperature)); 
    
    const apiConfigForCall = {...currentGenerationConfig, temperatureBase: currentTemperature};
    const currentChatHistory = [...chatHistory, userMessage]; 
    const response = await callAiApi(prompt, apiConfigForCall, currentChatHistory.slice(0, -1), systemInstruction); 
    
    const assistantMessage: ChatMessage = { id: uuidv4(), role: 'assistant', content: response.text, timestamp: Date.now() };
    setChatHistory(prevChatHistory => [...prevChatHistory, assistantMessage]);
    setIsLoading(false);

    updateEmotionState(response); updateNodeActivations(response);
    // Fitness is updated in simulateNetworkStep, which runs on an interval.
    // No direct call to updateAdaptiveFitness here anymore.
    setSubQgJumpInfo(null); 

  }, [myraConfig, emotionState, nodeStates, activeSubQgJumpModifier, chatHistory, updateEmotionState, updateNodeActivations, retrieveRelevantChunks, processedTextChunks]);


  return {
    myraConfig,
    chatHistory,
    emotionState,
    nodeStates,
    adaptiveFitness,
    subQgMatrix,
    subQgPhaseMatrix,
    subQgGlobalMetrics,
    subQgJumpInfo,
    activeSubQgJumpModifier,
    subQgJumpModifierActiveStepsRemaining,
    isLoading,
    simulationStep,
    generateMyraResponse,
    injectSubQgStimulus,
    updateMyraConfig,
    processedTextChunks,
    loadAndProcessFile,
    clearAllKnowledge,
    isLoadingKnowledge,
  };
};
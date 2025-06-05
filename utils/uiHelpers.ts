import { EmotionState } from '../types';

export const getDominantAffect = (emotionState: EmotionState, t: (key: string, subs?: Record<string, string>) => string): string => {
  const affects: (keyof EmotionState)[] = ['anger', 'disgust', 'fear', 'greed'];
  let dominantKey: keyof EmotionState | 'neutral' | 'joyful' | 'sad' = 'neutral';
  let maxAbsVal = 0.05; // Threshold to be considered dominant over neutral

  for (const key of affects) {
    const val = emotionState[key];
    if (typeof val === 'number' && Math.abs(val) > maxAbsVal) {
      maxAbsVal = Math.abs(val);
      dominantKey = key;
    }
  }
  
  // If no strong specific affect, check PAD for general mood
  if (dominantKey === 'neutral') {
    if (emotionState.pleasure > 0.3 && Math.abs(emotionState.arousal) < 0.3 && emotionState.dominance > -0.2) {
      dominantKey = 'joyful';
    } else if (emotionState.pleasure < -0.3 && Math.abs(emotionState.arousal) < 0.3) {
      dominantKey = 'sad';
    }
  }

  return t(`systemStatusPanel.emotion.affects.${dominantKey.toString().toLowerCase()}`, { defaultValue: dominantKey.toString() });
};


export const interpretPAD = (pad: { pleasure: number; arousal: number; dominance: number; }, t: (key: string, subs?: Record<string, string>) => string): string => {
  const { pleasure, arousal, dominance } = pad;

  // More nuanced interpretations
  if (pleasure > 0.5 && arousal > 0.5 && dominance > 0.3) return t('padInterpretations.elatedExuberant', {defaultValue: "Elated, exuberant."});
  if (pleasure > 0.4 && arousal > 0.3 && dominance < -0.2) return t('padInterpretations.happyDependent', {defaultValue: "Happy but dependent."});
  if (pleasure > 0.5 && Math.abs(arousal) < 0.3 && dominance > 0.3) return t('padInterpretations.calmConfident', {defaultValue: "Calmly confident, satisfied."});
  if (pleasure > 0.3 && Math.abs(arousal) < 0.2) return t('padInterpretations.calmContent', {defaultValue: "Generally calm and content."});


  if (pleasure < -0.5 && arousal > 0.5 && dominance < -0.3) return t('padInterpretations.distressedFrustrated', {defaultValue: "Distressed, frustrated."});
  if (pleasure < -0.3 && arousal > 0.3 && dominance > 0.2) return t('padInterpretations.tenseHostile', {defaultValue: "Tense, potentially hostile."});
  if (pleasure < -0.5 && Math.abs(arousal) < 0.3 && dominance < -0.3) return t('padInterpretations.depressedPowerless', {defaultValue: "Depressed, feeling powerless."});
  if (pleasure < -0.3 && Math.abs(arousal) < 0.2) return t('padInterpretations.unhappyPassive', {defaultValue: "Unhappy, passive."});

  if (Math.abs(pleasure) < 0.2 && arousal > 0.6 && dominance > 0.3) return t('padInterpretations.alertAssertive', {defaultValue: "Alert and assertive."});
  if (Math.abs(pleasure) < 0.2 && arousal > 0.5 && dominance < -0.2) return t('padInterpretations.arousedSubmissive', {defaultValue: "Aroused but submissive/surprised."});
  
  if (Math.abs(pleasure) < 0.2 && arousal < -0.5 && dominance > 0.3) return t('padInterpretations.boredControlling', {defaultValue: "Bored but in control."});
  if (Math.abs(pleasure) < 0.2 && arousal < -0.5 && dominance < -0.2) return t('padInterpretations.lethargicApathetic', {defaultValue: "Lethargic, apathetic."});

  // Original interpretations as fallbacks or for broader categories
  if (pleasure < -0.2 && dominance < -0.1 && arousal > 0.1) return t('padInterpretations.vulnerableControlled', {defaultValue: "Feeling of vulnerability or external control."});
  if (arousal > 0.3 && dominance > 0.2) return t('padInterpretations.activatedConfident', {defaultValue: "Activated, confident stance."});
  
  return t('padInterpretations.neutralComplex', {defaultValue: "Neutral or complex emotional state."});
};
import { RawReport, Incident } from '../types';

export const WEIGHT_TEXT = 0.40;
export const WEIGHT_LOCATION = 0.30;
export const WEIGHT_TIME = 0.20;
export const WEIGHT_CATEGORY = 0.10;
export const FUSION_THRESHOLD = 0.75; // 75% score required for automatic fusion
export const TIME_DECAY_WINDOW_MINUTES = 30;

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'near', 'at', 'in', 'on',
  'of', 'to', 'there', 'someone', 'person', 'it', 'and', 'or', 'by', 'for', 'with'
]);

const LOCATION_SYNONYMS: Record<string, string> = {
  court: 'court_area',
  ground: 'court_area',
  field: 'court_area',
  basketball: 'basketball',
  hall: 'hall',
  building: 'building',
  block: 'building',
  lab: 'lab',
  laboratory: 'lab',
  hostel: 'hostel',
  dorm: 'hostel',
  dormitory: 'hostel',
  library: 'library',
  canteen: 'canteen',
  cafeteria: 'canteen',
  mess: 'canteen',
  sports: 'sports_complex',
  gym: 'sports_complex',
  stadium: 'sports_complex',
};

const TEXT_SYNONYMS: Record<string, string> = {
  // Medical distress
  collapsed: 'medical_distress',
  collapse: 'medical_distress',
  unconscious: 'medical_distress',
  fainted: 'medical_distress',
  faint: 'medical_distress',
  passed: 'medical_distress',
  fell: 'medical_distress',
  dizzy: 'medical_distress',
  seizure: 'medical_distress',
  bleeding: 'medical_distress',
  injured: 'medical_distress',
  hurt: 'medical_distress',
  emergency: 'medical_distress',
  ambulance: 'medical_distress',
  // Fire
  fire: 'fire_event',
  burning: 'fire_event',
  flames: 'fire_event',
  smoke: 'fire_event',
  blaze: 'fire_event',
  // Violence
  fight: 'violence_event',
  fighting: 'violence_event',
  assault: 'violence_event',
  attack: 'violence_event',
  violence: 'violence_event',
  weapon: 'violence_event',
  // Water
  water: 'water_event',
  leaking: 'water_event',
  leak: 'water_event',
  flooding: 'water_event',
  flood: 'water_event',
  // Electrical
  sparking: 'electrical_event',
  spark: 'electrical_event',
  shock: 'electrical_event',
  electrical: 'electrical_event',
  wire: 'electrical_event',
  wires: 'electrical_event',
};

function tokenize(text: string): string[] {
  if (!text) return [];
  const words = text.toLowerCase().match(/[a-z0-9]+/g) || [];
  return words
    .map(w => TEXT_SYNONYMS[w] || w)
    .filter(w => !STOPWORDS.has(w));
}

function termFrequency(tokens: string[]): Record<string, number> {
  if (!tokens.length) return {};
  const tf: Record<string, number> = {};
  for (const t of tokens) {
    tf[t] = (tf[t] || 0) + 1;
  }
  const total = tokens.length;
  for (const k in tf) {
    tf[k] = tf[k] / total;
  }
  return tf;
}

function cosineSimilarity(vecA: Record<string, number>, vecB: Record<string, number>): number {
  const keysA = Object.keys(vecA);
  const keysB = new Set(Object.keys(vecB));
  if (!keysA.length || !keysB.size) return 0;

  const sharedTerms = keysA.filter(k => keysB.has(k));
  let dotProduct = 0;
  for (const term of sharedTerms) {
    dotProduct += vecA[term] * vecB[term];
  }

  const normA = Math.sqrt(Object.values(vecA).reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(Object.values(vecB).reduce((acc, val) => acc + val * val, 0));

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (normA * normB);
}

export function textSimilarity(textA: string, textB: string): number {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);
  if (!tokensA.length || !tokensB.length) return 0;

  const tfA = termFrequency(tokensA);
  const tfB = termFrequency(tokensB);
  return Math.round(cosineSimilarity(tfA, tfB) * 1000) / 1000;
}

function normalizeLocation(loc: string): string[] {
  if (!loc) return [];
  const words = loc.toLowerCase().match(/[a-z0-9]+/g) || [];
  return words
    .map(w => LOCATION_SYNONYMS[w] || w)
    .filter(w => !STOPWORDS.has(w));
}

export function locationSimilarity(locA: string, locB: string): number {
  const setA = new Set(normalizeLocation(locA));
  const setB = new Set(normalizeLocation(locB));
  if (!setA.size || !setB.size) return 0;

  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return Math.round((intersection.size / union.size) * 1000) / 1000;
}

export function timeProximity(timestampA: string, timestampB: string, windowMinutes = TIME_DECAY_WINDOW_MINUTES): number {
  if (!timestampA || !timestampB) return 0;
  try {
    const dtA = new Date(timestampA).getTime();
    const dtB = new Date(timestampB).getTime();
    if (isNaN(dtA) || isNaN(dtB)) return 0;

    const diffMinutes = Math.abs(dtA - dtB) / (1000 * 60);
    if (diffMinutes >= windowMinutes) return 0;
    return Math.round((1.0 - diffMinutes / windowMinutes) * 1000) / 1000;
  } catch {
    return 0;
  }
}

export function categoryMatch(catA: string, catB: string): number {
  if (!catA || !catB) return 0;
  return catA.trim().toUpperCase() === catB.trim().toUpperCase() ? 1.0 : 0.0;
}

export interface FusionScoreResult {
  textScore: number;
  locationScore: number;
  timeScore: number;
  categoryScore: number;
  fusionScore: number;
  matchStrength: 'Strong match' | 'Moderate match' | 'Low match';
  reasons: string[];
}

export function calculateFusionScore(report: RawReport, incident: Incident, representativeText?: string): FusionScoreResult {
  const textScore = textSimilarity(report.text, representativeText || incident.summary || incident.title);
  const locationScore = locationSimilarity(report.location, incident.location);
  const timeScore = timeProximity(report.timestamp, incident.updatedAt);
  const catScore = categoryMatch(report.category, incident.category);

  const totalScore = (
    WEIGHT_TEXT * textScore +
    WEIGHT_LOCATION * locationScore +
    WEIGHT_TIME * timeScore +
    WEIGHT_CATEGORY * catScore
  );

  const roundedTotal = Math.round(totalScore * 1000) / 1000;

  // Human-readable transparent reasons
  const reasons: string[] = [];
  if (locationScore >= 0.7) {
    reasons.push('Same campus location / immediate zone');
  } else if (locationScore >= 0.4) {
    reasons.push('Adjacent campus area');
  }

  if (timeScore >= 0.8) {
    reasons.push('Reported within the same 5-minute window');
  } else if (timeScore >= 0.5) {
    reasons.push('Reported recently (within 15 minutes)');
  }

  if (textScore >= 0.4) {
    reasons.push('Similar situational description and keywords');
  }

  if (catScore === 1.0) {
    reasons.push(`Matching emergency category (${report.category})`);
  }

  let matchStrength: 'Strong match' | 'Moderate match' | 'Low match' = 'Low match';
  if (roundedTotal >= 0.75) {
    matchStrength = 'Strong match';
  } else if (roundedTotal >= 0.45) {
    matchStrength = 'Moderate match';
  }

  return {
    textScore,
    locationScore,
    timeScore,
    categoryScore: catScore,
    fusionScore: roundedTotal,
    matchStrength,
    reasons,
  };
}

export function findMatchingIncident(
  report: RawReport,
  activeIncidents: Incident[],
  threshold = FUSION_THRESHOLD
): { matchedIncident: Incident | null; scoreResult: FusionScoreResult | null } {
  let bestIncident: Incident | null = null;
  let bestScoreResult: FusionScoreResult | null = null;

  for (const incident of activeIncidents) {
    if (incident.status === 'RESOLVED' || incident.status === 'CLOSED') continue;
    
    // Check against incident summary or the text of any fused report
    const scoreResult = calculateFusionScore(report, incident);
    if (!bestScoreResult || scoreResult.fusionScore > bestScoreResult.fusionScore) {
      bestScoreResult = scoreResult;
      bestIncident = incident;
    }
  }

  if (bestIncident && bestScoreResult && bestScoreResult.fusionScore >= threshold) {
    return { matchedIncident: bestIncident, scoreResult: bestScoreResult };
  }

  return { matchedIncident: null, scoreResult: bestScoreResult };
}

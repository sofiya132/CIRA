import { IncidentCategory, PriorityLevel, PriorityExplanation } from '../types';

const VIOLENCE_KEYWORDS = ['violence', 'fight', 'attack', 'assault', 'weapon', 'gun', 'knife', 'threat'];
const FIRE_KEYWORDS = ['active fire', 'burning', 'flames', 'smoke', 'explosion'];
const ELECTRICAL_KEYWORDS = ['sparking', 'exposed wire', 'power outage', 'shock', 'transformer'];

export function calculatePriority(
  category: IncidentCategory,
  personState?: string,
  text?: string,
  reportCount: number = 1
): PriorityExplanation {
  const cat = (category || '').trim().toUpperCase();
  const state = (personState || '').trim().toUpperCase();
  const textLower = (text || '').toLowerCase();

  // Rule 1: Medical + Unconscious => CRITICAL
  if (cat === 'MEDICAL' && (state === 'UNCONSCIOUS' || textLower.includes('unconscious') || textLower.includes('collapsed'))) {
    return {
      level: 'CRITICAL',
      headline: 'Immediate medical dispatch required. High life-safety risk.',
      signals: [
        'Medical distress reported',
        'Person reported as unconscious or collapsed',
        reportCount > 1 ? `${reportCount} matching reports reinforce urgency` : 'Single urgent report with critical indicators'
      ],
      deterministicRule: 'Rule 101: Medical Category + Unconscious/Collapsed State'
    };
  }

  // Rule 2: Active Fire => CRITICAL
  if (cat === 'FIRE' || FIRE_KEYWORDS.some(k => textLower.includes(k))) {
    return {
      level: 'CRITICAL',
      headline: 'Active fire/smoke threat to life and structure.',
      signals: [
        'Fire or severe smoke detected',
        'Potential building evacuation trigger',
        'Campus emergency services alerted automatically'
      ],
      deterministicRule: 'Rule 102: Active Fire / Smoke Hazard'
    };
  }

  // Rule 3: Violence / Weapon => CRITICAL
  if (cat === 'VIOLENCE' || VIOLENCE_KEYWORDS.some(k => textLower.includes(k))) {
    return {
      level: 'CRITICAL',
      headline: 'Active safety or security threat in progress.',
      signals: [
        'Physical altercation or weapon reported',
        'Direct risk to campus community safety',
        'Campus Police rapid response protocol triggered'
      ],
      deterministicRule: 'Rule 103: Physical Safety Threat / Altercation'
    };
  }

  // Rule 4: Electrical Hazard => HIGH
  if (cat === 'ELECTRICAL' || ELECTRICAL_KEYWORDS.some(k => textLower.includes(k))) {
    return {
      level: 'HIGH',
      headline: 'Urgent infrastructure hazard. Prompt engineering response needed.',
      signals: [
        'Electrical sparking or exposed wiring reported',
        'Fire hazard risk if left unattended',
        'Facilities & Engineering dispatched within 5 min SLA'
      ],
      deterministicRule: 'Rule 201: Active Electrical or Utility Hazard'
    };
  }

  // Rule 5: Medical with Injury (Conscious) => HIGH
  if (cat === 'MEDICAL') {
    return {
      level: 'HIGH',
      headline: 'Medical attention requested for injured or distressed person.',
      signals: [
        'Medical assistance needed',
        state === 'INJURED' ? 'Physical injury noted (conscious)' : 'First-aid or paramedic evaluation requested',
        'Medical team dispatched'
      ],
      deterministicRule: 'Rule 202: Medical Assistance (Standard / Conscious)'
    };
  }

  // Rule 6: Water Leakage / Facilities => MEDIUM
  if (cat === 'WATER' || cat === 'FACILITY') {
    return {
      level: 'MEDIUM',
      headline: 'Facility maintenance issue requiring operational triage.',
      signals: [
        'Water leakage or facility defect reported',
        'Contained hazard without immediate life risk',
        'Maintenance technician scheduled'
      ],
      deterministicRule: 'Rule 301: Facility Defect / Contained Leak'
    };
  }

  // Rule 7: Lost Item => LOW
  if (cat === 'LOST_ITEM') {
    return {
      level: 'LOW',
      headline: 'Standard campus community assistance.',
      signals: [
        'Lost property or non-emergency inquiry',
        'Logged to Campus Security Lost & Found registry'
      ],
      deterministicRule: 'Rule 401: Non-Emergency Community Report'
    };
  }

  // Default Fallback
  return {
    level: 'MEDIUM',
    headline: 'Standard priority incident pending field assessment.',
    signals: [
      `Categorized under ${cat}`,
      'Monitored by Campus Operations Command'
    ],
    deterministicRule: 'Rule 399: Standard Operational Assessment'
  };
}

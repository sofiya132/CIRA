export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus = 
  | 'NEW' 
  | 'AWAITING_ACK' 
  | 'ACKNOWLEDGED' 
  | 'EN_ROUTE' 
  | 'ON_SCENE' 
  | 'ESCALATED' 
  | 'RESOLVED' 
  | 'CLOSED';

export type IncidentCategory = 
  | 'MEDICAL' 
  | 'FIRE' 
  | 'VIOLENCE' 
  | 'ELECTRICAL' 
  | 'WATER' 
  | 'LOST_ITEM' 
  | 'FACILITY' 
  | 'GENERAL';

export type UserRole = 
  | 'STUDENT'    // Student / Community
  | 'RESPONDER'  // Emergency Responder
  | 'DISPATCHER' // Operation Dispatcher
  | 'SUPERVISOR'; // Duty Operations Chief

export interface StudentEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface StudentProfileData {
  id: string;
  name: string;
  studentId: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  residenceHall?: string;
  emergencyContact: StudentEmergencyContact;
  notificationPreferences: {
    smsUpdates: boolean;
    emergencyBroadcasts: boolean;
    defaultAnonymous: boolean;
  };
  isLoggedIn: boolean;
}

export interface EmergencyHotline {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  iconName: 'Shield' | 'HeartPulse' | 'Flame' | 'Phone';
  category: 'SECURITY' | 'MEDICAL' | 'FIRE' | 'DESK';
  serviceName: string; // e.g. "Campus Security", "Medical Response", "Fire Response", "Campus Emergency Desk"
}

export interface RawReport {
  id: string;
  reportNumber: string; // e.g. "R-8492" or "CALL-1042"
  text: string;
  location: string;
  category: IncidentCategory;
  timestamp: string; // ISO 8601
  source?: 'STUDENT_REPORT' | 'EMERGENCY_CALL';
  purpose?: string; // e.g. "Unconscious person", "Active fire", "Security threat"
  submitterId?: string; // e.g. "STU-882194"
  submitterName?: string;
  submitterRole?: 'Student' | 'Staff' | 'Faculty' | 'Visitor' | 'Anonymous';
  submitterContact?: string;
  personState?: 'UNCONSCIOUS' | 'INJURED' | 'DISTRESSED' | 'SAFE' | 'UNKNOWN';
  evidencePhotos?: string[];
  isAnonymous?: boolean;
  incidentId?: string; // Linked master incident
  fusionScoreWithIncident?: number;
  fusionExplanation?: {
    locationMatch: boolean;
    locationScore: number;
    timeDeltaMinutes: number;
    timeScore: number;
    textScore: number;
    categoryScore: number;
    matchStrength: 'Strong match' | 'Moderate match' | 'Low match';
    keySignals: string[];
  };
}

export interface TimelineEvent {
  id: string;
  timestamp: string; // e.g. "10:31"
  isoTimestamp: string;
  title: string;
  description: string;
  actor: string;
  actorRole?: string;
  type: 'REPORT_RECEIVED' | 'EMERGENCY_CALL' | 'FUSION' | 'PRIORITY_ASSIGNED' | 'DISPATCH' | 'ACKNOWLEDGED' | 'EN_ROUTE' | 'ON_SCENE' | 'ESCALATED' | 'CHIEF_INTERVENTION' | 'RESOLVED' | 'NOTE' | string;
  isAutomated?: boolean;
}

export interface Responder {
  id: string;
  name: string;
  role: 'Campus Medical Response' | 'Campus Security Police' | 'Facilities & Engineering' | 'Health Center Staff';
  category: IncidentCategory;
  phone?: string;
  radioChannel: string;
  status: 'AVAILABLE' | 'EN_ROUTE' | 'ON_SCENE' | 'BUSY' | 'OFF_DUTY';
  currentLocation: string;
  distanceMeters: number;
  activeIncidentCount: number;
  avatarUrl?: string;
  skills: string[];
  unitCode: string; // e.g. "MED-UNIT-2"
}

export interface PriorityExplanation {
  level: PriorityLevel;
  headline: string; // e.g. "Immediate response recommended."
  signals: string[];
  deterministicRule: string; // e.g. "Rule 101: Medical Category + Unconscious State = CRITICAL"
}

export interface Incident {
  id: string;
  incidentNumber: string; // e.g. "CP-1042" or "CP-CALL-1042"
  title: string;
  category: IncidentCategory;
  location: string;
  buildingZone: string; // e.g. "Sports Complex", "Science Quad", "Central Library"
  coordinates: { x: number; y: number; lat?: number; lng?: number }; // % on campus map
  priority: PriorityLevel;
  status: IncidentStatus;
  summary: string;
  fullDescription: string;
  source: 'STUDENT_REPORT' | 'EMERGENCY_CALL' | 'FUSED';
  isEmergencyCall: boolean;
  emergencyPurpose?: string;
  reportCount: number;
  emergencyCallCount: number;
  reportIds: string[];
  submitterIds: string[]; // List of student IDs associated with this incident
  reports: RawReport[];
  createdAt: string;
  updatedAt: string;
  assignedResponder?: Responder;
  assignedResponderId?: string;
  
  // Escalation & SLA
  slaSeconds: number; // e.g. 60s for Critical, 120s for High, 300s for Medium
  secondsRemaining: number;
  isEscalated: boolean;
  escalatedTo?: string; // e.g. "Duty Operations Chief"
  escalationReason?: string;
  escalationHistory?: {
    escalatedAt: string;
    escalatedBy: string;
    timeoutBreached: boolean;
    reason: string;
  }[];

  // Explainability
  priorityExplanation: PriorityExplanation;
  fusionExplanation?: {
    reasons: string[];
    matchStrength: string;
    fusedReportsCount: number;
    summaryText: string;
  };
  
  // Operational Timeline
  timeline: TimelineEvent[];
  
  // Evidence & Resolution
  evidenceUrls: string[];
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface CampusZone {
  id: string;
  name: string;
  shortCode: string;
  type: 'ACADEMIC' | 'ATHLETICS' | 'RESIDENTIAL' | 'SERVICES' | 'OUTDOOR';
  centerCoords: { x: number; y: number };
  activeIncidentCount: number;
  openReportsCount: number;
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED';
  description: string;
}

export interface SystemNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'CRITICAL' | 'EMERGENCY_CALL' | 'FUSION' | 'DISPATCH' | 'ESCALATION' | 'RESOLUTION' | 'SYSTEM';
  incidentId?: string;
  read: boolean;
  targetRole?: UserRole | 'ALL';
  targetStudentId?: string;
  channel: 'SMS' | 'APP' | 'RADIO' | 'PUSH';
}

export interface CampusSignal {
  id: string;
  timestamp: string;
  type: 'FUSION' | 'CLUSTER' | 'RESPONSE_METRIC' | 'ESCALATION' | 'WEATHER_HAZARD';
  headline: string;
  detail: string;
  metricChange?: string;
  zone?: string;
}

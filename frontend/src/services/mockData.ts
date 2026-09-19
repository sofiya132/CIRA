import { Responder, CampusZone, Incident, RawReport, SystemNotification, CampusSignal } from '../types';

export const INITIAL_RESPONDERS: Responder[] = [
  {
    id: 'resp-01',
    name: 'Arjun Kumar',
    role: 'Campus Medical Response',
    category: 'MEDICAL',
    radioChannel: 'MED-CH-1',
    status: 'AVAILABLE',
    currentLocation: 'Campus Health Annex (Near Gym)',
    distanceMeters: 120,
    activeIncidentCount: 0,
    skills: ['EMT-Paramedic', 'BLS Certified', 'First Response Mobile Unit'],
    unitCode: 'MED-UNIT-2',
  },
  {
    id: 'resp-02',
    name: 'Officer Sarah Lin',
    role: 'Campus Security Police',
    category: 'VIOLENCE',
    radioChannel: 'SEC-CH-4',
    status: 'AVAILABLE',
    currentLocation: 'Central Plaza Kiosk',
    distanceMeters: 280,
    activeIncidentCount: 0,
    skills: ['Crowd De-escalation', 'Crisis Intervention', 'Field Incident Command'],
    unitCode: 'SEC-PATROL-1',
  },
  {
    id: 'resp-03',
    name: 'David Chen',
    role: 'Facilities & Engineering',
    category: 'ELECTRICAL',
    radioChannel: 'FAC-CH-2',
    status: 'AVAILABLE',
    currentLocation: 'Physical Plant Workshop',
    distanceMeters: 450,
    activeIncidentCount: 1,
    skills: ['Master Electrician', 'HVAC Controls', 'Emergency Power Systems'],
    unitCode: 'ENG-TECH-3',
  },
  {
    id: 'resp-04',
    name: 'Nurse Emily Watson',
    role: 'Health Center Staff',
    category: 'MEDICAL',
    radioChannel: 'MED-CH-2',
    status: 'AVAILABLE',
    currentLocation: 'Student Health Pavilion',
    distanceMeters: 380,
    activeIncidentCount: 0,
    skills: ['Triage Nurse', 'CPR/AED Instructor', 'Post-Crisis Care'],
    unitCode: 'CLINIC-NURSE-1',
  }
];

export const CAMPUS_ZONES: CampusZone[] = [
  {
    id: 'zone-sports',
    name: 'Sports Complex & Courts',
    shortCode: 'ATH-01',
    type: 'ATHLETICS',
    centerCoords: { x: 74, y: 32 },
    activeIncidentCount: 1,
    openReportsCount: 3,
    riskLevel: 'ELEVATED',
    description: 'Outdoor basketball courts, athletic pavilion, stadium grandstand, and locker rooms.'
  },
  {
    id: 'zone-science',
    name: 'Science & Tech Quad',
    shortCode: 'SCI-02',
    type: 'ACADEMIC',
    centerCoords: { x: 38, y: 28 },
    activeIncidentCount: 1,
    openReportsCount: 1,
    riskLevel: 'ELEVATED',
    description: 'Science Hall A & B, chemistry laboratories, cleanroom facilities, and electrical substation.'
  },
  {
    id: 'zone-library',
    name: 'Central Library & Learning Commons',
    shortCode: 'LIB-01',
    type: 'ACADEMIC',
    centerCoords: { x: 50, y: 55 },
    activeIncidentCount: 1,
    openReportsCount: 2,
    riskLevel: 'MODERATE',
    description: '5-story library, digital media lab, underground archives, and 24/7 study hall.'
  },
  {
    id: 'zone-union',
    name: 'Student Union & Dining Plaza',
    shortCode: 'STU-01',
    type: 'SERVICES',
    centerCoords: { x: 30, y: 68 },
    activeIncidentCount: 0,
    openReportsCount: 0,
    riskLevel: 'LOW',
    description: 'Dining hall, student organizations hub, bookstore, and outdoor courtyard.'
  },
  {
    id: 'zone-dorms',
    name: 'North Residential Village',
    shortCode: 'RES-03',
    type: 'RESIDENTIAL',
    centerCoords: { x: 22, y: 22 },
    activeIncidentCount: 0,
    openReportsCount: 0,
    riskLevel: 'LOW',
    description: 'Four residential towers, dining commons, laundry facilities, and courtyards.'
  },
  {
    id: 'zone-engineering',
    name: 'Engineering & Maker Hub',
    shortCode: 'ENG-04',
    type: 'ACADEMIC',
    centerCoords: { x: 68, y: 72 },
    activeIncidentCount: 0,
    openReportsCount: 0,
    riskLevel: 'LOW',
    description: 'Robotics lab, machine workshops, faculty offices, and prototyping center.'
  }
];

export const INITIAL_REPORTS: RawReport[] = [
  {
    id: 'rep-01',
    reportNumber: 'R-8491',
    text: 'Someone collapsed near the basketball court.',
    location: 'Basketball Court',
    category: 'MEDICAL',
    timestamp: '2026-09-19T04:02:10Z',
    source: 'STUDENT_REPORT',
    submitterId: 'STU-882194',
    submitterName: 'Rohan Sharma',
    submitterRole: 'Student',
    submitterContact: '+1 (555) 012-4912',
    personState: 'UNCONSCIOUS',
    isAnonymous: false,
    incidentId: 'inc-01',
    fusionScoreWithIncident: 1.0,
    fusionExplanation: {
      locationMatch: true,
      locationScore: 1.0,
      timeDeltaMinutes: 0,
      timeScore: 1.0,
      textScore: 0.95,
      categoryScore: 1.0,
      matchStrength: 'Strong match',
      keySignals: ['Initial incident origin report', 'Person collapsed', 'Basketball Court']
    }
  },
  {
    id: 'rep-02',
    reportNumber: 'R-8492',
    text: 'Unconscious person near the sports ground.',
    location: 'Sports Ground (Near Court)',
    category: 'MEDICAL',
    timestamp: '2026-09-19T04:03:22Z',
    source: 'STUDENT_REPORT',
    submitterId: 'STU-994321',
    submitterName: 'Aanya Patel',
    submitterRole: 'Student',
    submitterContact: '+1 (555) 018-9921',
    personState: 'UNCONSCIOUS',
    isAnonymous: false,
    incidentId: 'inc-01',
    fusionScoreWithIncident: 0.94,
    fusionExplanation: {
      locationMatch: true,
      locationScore: 0.92,
      timeDeltaMinutes: 1.2,
      timeScore: 0.96,
      textScore: 0.91,
      categoryScore: 1.0,
      matchStrength: 'Strong match',
      keySignals: ['Shared location (Sports Ground / Court)', 'Identical medical distress keywords', '1 min time window']
    }
  },
  {
    id: 'rep-03',
    reportNumber: 'CALL-1042',
    text: 'Person has collapsed near the basketball court. Immediate paramedic needed.',
    location: 'Basketball Court',
    category: 'MEDICAL',
    timestamp: '2026-09-19T04:04:15Z',
    source: 'EMERGENCY_CALL',
    purpose: 'Unconscious person',
    submitterId: 'STU-773120',
    submitterName: 'Marcus Lee',
    submitterRole: 'Student',
    personState: 'UNCONSCIOUS',
    isAnonymous: false,
    incidentId: 'inc-01',
    fusionScoreWithIncident: 0.96,
    fusionExplanation: {
      locationMatch: true,
      locationScore: 1.0,
      timeDeltaMinutes: 2.0,
      timeScore: 0.93,
      textScore: 0.92,
      categoryScore: 1.0,
      matchStrength: 'Strong match',
      keySignals: ['Emergency Call stream', 'Matching medical category', 'Same physical court perimeter']
    }
  },
  {
    id: 'rep-04',
    reportNumber: 'R-8488',
    text: 'Visible sparks and smoking from the breaker box near Science Block B main entrance.',
    location: 'Science Block B Entrance',
    category: 'ELECTRICAL',
    timestamp: '2026-09-19T04:08:00Z',
    source: 'STUDENT_REPORT',
    submitterId: 'FAC-0921',
    submitterName: 'Dr. Evelyn Reed',
    submitterRole: 'Faculty',
    submitterContact: '+1 (555) 011-8842',
    personState: 'SAFE',
    isAnonymous: false,
    incidentId: 'inc-02',
    fusionScoreWithIncident: 1.0,
    fusionExplanation: {
      locationMatch: true,
      locationScore: 1.0,
      timeDeltaMinutes: 0,
      timeScore: 1.0,
      textScore: 1.0,
      categoryScore: 1.0,
      matchStrength: 'Strong match',
      keySignals: ['Breaker box sparking', 'Science Block B']
    }
  },
  {
    id: 'rep-05',
    reportNumber: 'R-8480',
    text: 'Water pouring from ceiling pipe onto carpet in Central Library Basement study nook.',
    location: 'Central Library Basement',
    category: 'WATER',
    timestamp: '2026-09-19T03:45:00Z',
    source: 'STUDENT_REPORT',
    submitterId: 'STU-882194',
    submitterName: 'Rohan Sharma',
    submitterRole: 'Student',
    personState: 'SAFE',
    isAnonymous: false,
    incidentId: 'inc-03',
  },
  {
    id: 'rep-06',
    reportNumber: 'R-8481',
    text: 'Basement flooring flooded near archive section.',
    location: 'Library Archives Level -1',
    category: 'WATER',
    timestamp: '2026-09-19T03:48:30Z',
    source: 'STUDENT_REPORT',
    submitterId: 'STU-994321',
    submitterName: 'Aanya Patel',
    submitterRole: 'Student',
    personState: 'SAFE',
    isAnonymous: false,
    incidentId: 'inc-03',
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-01',
    incidentNumber: 'CP-1042',
    title: 'Medical Emergency',
    category: 'MEDICAL',
    location: 'Basketball Court',
    buildingZone: 'Sports Complex',
    coordinates: { x: 74, y: 32 },
    priority: 'CRITICAL',
    status: 'AWAITING_ACK',
    source: 'FUSED',
    isEmergencyCall: true,
    emergencyPurpose: 'Unconscious person',
    reportCount: 3,
    emergencyCallCount: 1,
    reportIds: ['rep-01', 'rep-02', 'rep-03'],
    submitterIds: ['STU-882194', 'STU-994321', 'STU-773120'],
    reports: [INITIAL_REPORTS[0], INITIAL_REPORTS[1], INITIAL_REPORTS[2]],
    summary: 'Possible unconscious student near basketball court',
    fullDescription: 'Three converged reports (including 1 Emergency Hotline Call) confirm an individual collapsed on the outdoor court perimeter. Unresponsive but breathing. Immediate EMT triage needed.',
    createdAt: '2026-09-19T04:02:10Z',
    updatedAt: '2026-09-19T04:04:15Z',
    assignedResponder: INITIAL_RESPONDERS[0], // Arjun Kumar
    assignedResponderId: 'resp-01',
    slaSeconds: 60,
    secondsRemaining: 42,
    isEscalated: false,
    priorityExplanation: {
      level: 'CRITICAL',
      headline: 'Immediate response recommended.',
      signals: [
        'Medical emergency category',
        'Person reported as unconscious',
        'Emergency Call + 2 student reports fused within 2 minutes'
      ],
      deterministicRule: 'Rule 101: Medical Category + Unconscious Person State'
    },
    fusionExplanation: {
      matchStrength: 'Strong match',
      reasons: [
        'Same location: Basketball Court & Sports Ground area',
        'Same time window: 2 reports + 1 emergency call within 2 minutes',
        'Similar description: Collapsed / unconscious distress keywords'
      ],
      fusedReportsCount: 3,
      summaryText: '2 student reports + 1 emergency call converged into 1 master critical incident'
    },
    timeline: [
      {
        id: 'tl-01',
        timestamp: '10:31',
        isoTimestamp: '2026-09-19T04:02:10Z',
        title: 'Student report received',
        description: 'Student reported collapsed person near basketball court (R-8491)',
        actor: 'Rohan Sharma (Student)',
        type: 'REPORT_RECEIVED'
      },
      {
        id: 'tl-02',
        timestamp: '10:31',
        isoTimestamp: '2026-09-19T04:02:15Z',
        title: 'Incident created',
        description: 'Master Incident #CP-1042 registered in Operations Command',
        actor: 'CampusPulse Engine',
        type: 'PRIORITY_ASSIGNED',
        isAutomated: true
      },
      {
        id: 'tl-03',
        timestamp: '10:32',
        isoTimestamp: '2026-09-19T04:03:22Z',
        title: 'Related report consolidated',
        description: 'Aanya Patel submitted report R-8492. Fusion score 94% — linked to master event',
        actor: 'CampusPulse Fusion Engine',
        type: 'FUSION',
        isAutomated: true
      },
      {
        id: 'tl-04',
        timestamp: '10:33',
        isoTimestamp: '2026-09-19T04:04:15Z',
        title: 'Emergency call received & fused',
        description: 'Emergency hotline call from Marcus Lee (Purpose: Unconscious person) linked to #CP-1042',
        actor: 'Emergency Hotline Gateway',
        type: 'EMERGENCY_CALL',
        isAutomated: true
      },
      {
        id: 'tl-05',
        timestamp: '10:33',
        isoTimestamp: '2026-09-19T04:04:20Z',
        title: 'Critical priority confirmed',
        description: 'Deterministic Rule 101 applied: Medical emergency with unconscious state',
        actor: 'Priority Rules Engine',
        type: 'PRIORITY_ASSIGNED',
        isAutomated: true
      },
      {
        id: 'tl-06',
        timestamp: '10:34',
        isoTimestamp: '2026-09-19T04:04:25Z',
        title: 'Response team assigned',
        description: 'Dispatched Arjun Kumar (MED-UNIT-2, 120m away, Available)',
        actor: 'Operation Dispatcher',
        type: 'DISPATCH',
        isAutomated: true
      }
    ],
    evidenceUrls: []
  },
  {
    id: 'inc-02',
    incidentNumber: 'CP-1038',
    title: 'Electrical Sparking & Hazard',
    category: 'ELECTRICAL',
    location: 'Science Block B Entrance',
    buildingZone: 'Science & Tech Quad',
    coordinates: { x: 38, y: 28 },
    priority: 'HIGH',
    status: 'AWAITING_ACK',
    source: 'STUDENT_REPORT',
    isEmergencyCall: false,
    reportCount: 1,
    emergencyCallCount: 0,
    reportIds: ['rep-04'],
    submitterIds: ['FAC-0921'],
    reports: [INITIAL_REPORTS[3]],
    summary: 'Sparks and smoke from main breaker box near entry hallway',
    fullDescription: 'Faculty reported repeated electrical arcing and burning odor at the sub-panel. Potential fire hazard if not isolated promptly.',
    createdAt: '2026-09-19T04:08:00Z',
    updatedAt: '2026-09-19T04:08:00Z',
    assignedResponder: INITIAL_RESPONDERS[2], // David Chen
    assignedResponderId: 'resp-03',
    slaSeconds: 45,
    secondsRemaining: 18,
    isEscalated: false,
    priorityExplanation: {
      level: 'HIGH',
      headline: 'Urgent utility hazard requiring prompt containment.',
      signals: [
        'Active electrical arcing / sparking',
        'Science & Tech Quad academic facility'
      ],
      deterministicRule: 'Rule 201: Active Electrical or Utility Hazard'
    },
    timeline: [
      {
        id: 'tl-11',
        timestamp: '08:48',
        isoTimestamp: '2026-09-19T04:08:00Z',
        title: 'Report received',
        description: 'Breaker box sparks reported by Dr. Evelyn Reed',
        actor: 'Dr. Evelyn Reed',
        type: 'REPORT_RECEIVED'
      },
      {
        id: 'tl-12',
        timestamp: '08:48',
        isoTimestamp: '2026-09-19T04:08:10Z',
        title: 'High priority assigned',
        description: 'Rule 201 applied: Active utility hazard',
        actor: 'Priority Rules Engine',
        type: 'PRIORITY_ASSIGNED',
        isAutomated: true
      },
      {
        id: 'tl-13',
        timestamp: '08:49',
        isoTimestamp: '2026-09-19T04:08:15Z',
        title: 'Technician dispatched',
        description: 'Dispatched David Chen (ENG-TECH-3)',
        actor: 'Operation Dispatcher',
        type: 'DISPATCH',
        isAutomated: true
      }
    ],
    evidenceUrls: []
  },
  {
    id: 'inc-03',
    incidentNumber: 'CP-1035',
    title: 'Water Leakage & Flooding',
    category: 'WATER',
    location: 'Central Library Basement',
    buildingZone: 'Central Library & Learning Commons',
    coordinates: { x: 50, y: 55 },
    priority: 'MEDIUM',
    status: 'EN_ROUTE',
    source: 'FUSED',
    isEmergencyCall: false,
    reportCount: 2,
    emergencyCallCount: 0,
    reportIds: ['rep-05', 'rep-06'],
    submitterIds: ['STU-882194', 'STU-994321'],
    reports: [INITIAL_REPORTS[4], INITIAL_REPORTS[5]],
    summary: 'Active pipe burst on basement ceiling above archive collection',
    fullDescription: 'Water actively dripping onto library carpet and archive shelving. Building facilities shutoff required to prevent book damage.',
    createdAt: '2026-09-19T03:45:00Z',
    updatedAt: '2026-09-19T03:48:30Z',
    assignedResponder: INITIAL_RESPONDERS[2],
    assignedResponderId: 'resp-03',
    slaSeconds: 300,
    secondsRemaining: 0,
    isEscalated: false,
    priorityExplanation: {
      level: 'MEDIUM',
      headline: 'Facility maintenance triage required.',
      signals: ['2 reports fused', 'Basement archive location'],
      deterministicRule: 'Rule 301: Facility Defect / Contained Leak'
    },
    timeline: [
      {
        id: 'tl-31',
        timestamp: '08:15',
        isoTimestamp: '2026-09-19T03:45:00Z',
        title: 'Report received',
        description: 'Rohan Sharma submitted pipe leak report (R-8480)',
        actor: 'Rohan Sharma (Student)',
        type: 'REPORT_RECEIVED'
      },
      {
        id: 'tl-32',
        timestamp: '08:18',
        isoTimestamp: '2026-09-19T03:48:30Z',
        title: 'Related report consolidated',
        description: 'Aanya Patel report R-8481 merged (91% match)',
        actor: 'Fusion Engine',
        type: 'FUSION',
        isAutomated: true
      },
      {
        id: 'tl-33',
        timestamp: '08:20',
        isoTimestamp: '2026-09-19T03:50:00Z',
        title: 'Responder acknowledged',
        description: 'David Chen acknowledged dispatch',
        actor: 'David Chen',
        type: 'ACKNOWLEDGED'
      },
      {
        id: 'tl-34',
        timestamp: '08:25',
        isoTimestamp: '2026-09-19T03:55:00Z',
        title: 'Responder en route',
        description: 'Technician heading to Library Basement via service corridor',
        actor: 'David Chen',
        type: 'EN_ROUTE'
      }
    ],
    evidenceUrls: []
  },
  {
    id: 'inc-04',
    incidentNumber: 'CP-1029',
    title: 'Lost Item — Blue Backpack',
    category: 'LOST_ITEM',
    location: 'Student Union Dining Plaza',
    buildingZone: 'Student Union & Dining Plaza',
    coordinates: { x: 30, y: 68 },
    priority: 'LOW',
    status: 'RESOLVED',
    source: 'STUDENT_REPORT',
    isEmergencyCall: false,
    reportCount: 1,
    emergencyCallCount: 0,
    reportIds: [],
    submitterIds: ['STU-882194'],
    reports: [],
    summary: 'Blue backpack left at cafe booth table 4',
    fullDescription: 'Bag safely retrieved by campus security and logged into campus lost & found locker. Returned to student Rohan Sharma.',
    createdAt: '2026-09-19T02:10:00Z',
    updatedAt: '2026-09-19T03:00:00Z',
    assignedResponder: INITIAL_RESPONDERS[1],
    assignedResponderId: 'resp-02',
    slaSeconds: 600,
    secondsRemaining: 0,
    isEscalated: false,
    priorityExplanation: {
      level: 'LOW',
      headline: 'Standard campus community property assistance.',
      signals: ['Non-hazardous lost item', 'Student Union lounge'],
      deterministicRule: 'Rule 401: Non-Emergency Community Report'
    },
    timeline: [
      {
        id: 'tl-41',
        timestamp: '07:10',
        isoTimestamp: '2026-09-19T02:10:00Z',
        title: 'Report logged',
        description: 'Student logged unattended bag at cafe',
        actor: 'Rohan Sharma (Student)',
        type: 'REPORT_RECEIVED'
      },
      {
        id: 'tl-42',
        timestamp: '07:35',
        isoTimestamp: '2026-09-19T02:35:00Z',
        title: 'Retrieved by security',
        description: 'Officer Sarah Lin logged item into Central Security desk',
        actor: 'Officer Sarah Lin',
        type: 'ON_SCENE'
      },
      {
        id: 'tl-43',
        timestamp: '08:00',
        isoTimestamp: '2026-09-19T03:00:00Z',
        title: 'Incident resolved',
        description: 'Owner verified ID and collected backpack',
        actor: 'Officer Sarah Lin',
        type: 'RESOLVED'
      }
    ],
    evidenceUrls: [],
    resolvedAt: '2026-09-19T03:00:00Z',
    resolvedBy: 'Officer Sarah Lin'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-01',
    timestamp: 'Just now',
    title: '🚨 Critical Emergency Call received: Sports Complex',
    message: 'Medical hotline call from Marcus Lee fused into Incident #CP-1042.',
    type: 'EMERGENCY_CALL',
    incidentId: 'inc-01',
    targetRole: 'ALL',
    read: false,
    channel: 'PUSH'
  },
  {
    id: 'notif-02',
    timestamp: '2m ago',
    title: 'Response team assigned',
    message: 'Arjun Kumar (Campus Medical Response) dispatched for #CP-1042.',
    type: 'DISPATCH',
    incidentId: 'inc-01',
    targetRole: 'STUDENT',
    targetStudentId: 'STU-882194',
    read: false,
    channel: 'APP'
  },
  {
    id: 'notif-03',
    timestamp: '12m ago',
    title: 'Water leakage report consolidated with Incident #CP-1035',
    message: 'Report R-8481 merged based on library basement proximity and time match.',
    type: 'FUSION',
    incidentId: 'inc-03',
    targetRole: 'DISPATCHER',
    read: true,
    channel: 'APP'
  },
  {
    id: 'notif-04',
    timestamp: '45m ago',
    title: 'Incident #CP-1029 successfully resolved',
    message: 'Officer Sarah Lin closed lost property report at Student Union.',
    type: 'RESOLUTION',
    incidentId: 'inc-04',
    targetRole: 'STUDENT',
    targetStudentId: 'STU-882194',
    read: true,
    channel: 'APP'
  }
];

export const INITIAL_SIGNALS: CampusSignal[] = [
  {
    id: 'sig-01',
    timestamp: '08:44',
    type: 'FUSION',
    headline: '3 reports + 1 emergency call consolidated into #CP-1042',
    detail: 'Multiple signals near Basketball Court merged seamlessly into #CP-1042 without responder duplication.',
    metricChange: '+75% triage efficiency',
    zone: 'Sports Complex'
  },
  {
    id: 'sig-02',
    timestamp: '08:30',
    type: 'CLUSTER',
    headline: 'Medical incidents concentrated around sports complex',
    detail: 'High athletic activity period detected between 08:00 and 11:00 AM.',
    zone: 'Sports Complex'
  },
  {
    id: 'sig-03',
    timestamp: '08:15',
    type: 'RESPONSE_METRIC',
    headline: 'Mean time to acknowledge improved across shifts',
    detail: 'MTTA dropped from 3m 42s to 58s across active units.',
    metricChange: '-65% MTTA'
  },
  {
    id: 'sig-04',
    timestamp: '07:50',
    type: 'ESCALATION',
    headline: 'Step Functions SLA state machine monitoring active',
    detail: 'Real-time countdown and automated supervisor paging enabled.',
    metricChange: '100% SLA compliance'
  }
];

export const CAMPUS_LOCATIONS = [
  'Basketball Court (Sports Complex)',
  'Indoor Sports Pavilion',
  'Track & Stadium Field',
  'Science Block A - Lecture Hall 1',
  'Science Block B - Main Entrance',
  'Chemistry Lab 302',
  'Central Library - Ground Floor Cafe',
  'Central Library - 2nd Floor Study',
  'Central Library - Basement Archives',
  'Student Union - Dining Hall Plaza',
  'Student Union - Bookstore & Terrace',
  'North Residential Tower 1 - Lobby',
  'North Residential Tower 2 - Quad',
  'Engineering Building - Robotics Wing',
  'Campus Health Center Pavilion',
  'Main Administrative Gate & Kiosk'
];

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Incident,
  RawReport,
  Responder,
  SystemNotification,
  CampusSignal,
  CampusZone,
  UserRole,
  IncidentStatus,
  IncidentCategory,
  StudentProfileData,
  EmergencyHotline
} from '../types';
import {
  INITIAL_INCIDENTS,
  INITIAL_REPORTS,
  INITIAL_RESPONDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SIGNALS,
  CAMPUS_ZONES
} from '../services/mockData';
import { findMatchingIncident } from '../services/fusionEngine';
import { calculatePriority } from '../services/priorityEngine';
import { submitReport as submitReportToApi } from '../services/api';

interface SubmitReportInput {
  text: string;
  location: string;
  category: IncidentCategory;
  submitterName?: string;
  submitterRole?: 'Student' | 'Staff' | 'Faculty' | 'Visitor' | 'Anonymous';
  submitterContact?: string;
  personState?: 'UNCONSCIOUS' | 'INJURED' | 'DISTRESSED' | 'SAFE' | 'UNKNOWN';
  isAnonymous?: boolean;
  evidencePhotos?: string[];
}

interface SubmitEmergencyCallInput {
  category: IncidentCategory;
  purpose: string;
  description: string;
  location: string;
}

const DEFAULT_STUDENT_PROFILE: StudentProfileData = {
  id: 'stu-882194',
  name: 'Rohan Sharma',
  studentId: 'STU-882194',
  department: 'Computer Science & Engineering',
  year: '3rd Year (Junior)',
  email: 'r.sharma@university.edu',
  phone: '(555) 345-6789',
  residenceHall: 'North Quad • Hall 304',
  emergencyContact: {
    name: 'Anita Sharma',
    relationship: 'Mother / Guardian',
    phone: '(555) 987-6543'
  },
  notificationPreferences: {
    smsUpdates: true,
    emergencyBroadcasts: true,
    defaultAnonymous: false
  },
  isLoggedIn: true
};

const DEFAULT_HOTLINES: EmergencyHotline[] = [
  {
    id: 'hotline-sec',
    title: 'Campus Security',
    subtitle: 'Immediate safety threats, physical security, active perimeter escorts',
    badge: 'Immediate Dispatch',
    iconName: 'Shield',
    category: 'SECURITY',
    serviceName: 'Campus Security'
  },
  {
    id: 'hotline-med',
    title: 'Medical Emergency',
    subtitle: 'Acute injuries, medical collapse, rapid EMT defibrillator response',
    badge: 'Campus EMT',
    iconName: 'HeartPulse',
    category: 'MEDICAL',
    serviceName: 'Medical Response'
  },
  {
    id: 'hotline-fire',
    title: 'Fire / Emergency',
    subtitle: 'Active flames, heavy smoke, gas leak, hazardous material threat',
    badge: 'Fire Triage',
    iconName: 'Flame',
    category: 'FIRE',
    serviceName: 'Fire Response'
  },
  {
    id: 'hotline-desk',
    title: 'Campus Emergency Desk',
    subtitle: 'Central operations dispatch, duty supervisor, after-hours assistance',
    badge: 'Central Desk',
    iconName: 'Phone',
    category: 'DESK',
    serviceName: 'Campus Emergency Desk'
  }
];

interface CampusPulseContextType {
  incidents: Incident[];
  reports: RawReport[];
  responders: Responder[];
  notifications: SystemNotification[];
  signals: CampusSignal[];
  zones: CampusZone[];
  selectedIncidentId: string;
  selectedIncident: Incident | null;
  activeRole: UserRole;
  currentScreen: string;
  isDemoRunning: boolean;
  demoProgressMessage: string;
  
  // Student Profile & Auth
  studentProfile: StudentProfileData;
  updateStudentProfile: (updated: Partial<StudentProfileData>) => void;
  loginStudent: (student: Partial<StudentProfileData>) => void;
  logoutStudent: () => void;
  
  // Emergency Hotline & Calling
  emergencyHotlines: EmergencyHotline[];
  isCallModalOpen: boolean;
  activeCallingHotline: EmergencyHotline | null;
  openEmergencyCall: (hotline: EmergencyHotline) => void;
  closeEmergencyCall: () => void;
  submitEmergencyCall: (input: SubmitEmergencyCallInput) => { report: RawReport; incident: Incident; wasFused: boolean };

  // Actions
  setSelectedIncidentId: (id: string) => void;
  setActiveRole: (role: UserRole) => void;
  setCurrentScreen: (screen: string) => void;
  submitStudentReport: (input: SubmitReportInput) => { report: RawReport; incident: Incident; wasFused: boolean };
  acknowledgeIncident: (incidentId: string) => void;
  markEnRoute: (incidentId: string) => void;
  markOnScene: (incidentId: string) => void;
  resolveIncident: (incidentId: string, notes?: string) => void;
  reassignResponder: (incidentId: string, responderId: string) => void;
  triggerManualEscalation: (incidentId: string, reason?: string) => void;
  takeChiefCommand: (incidentId: string, actionType: 'REASSIGN' | 'TACTICAL_DEPLOY' | 'ZONE_ALERT', details?: any) => void;
  markNotificationRead: (notifId: string) => void;
  clearAllNotifications: () => void;
  
  // Signature Demos
  triggerMedicalDemo: () => Promise<void>;
  triggerEscalationDemo: () => Promise<void>;
  resetAllData: () => void;
}

const CampusPulseContext = createContext<CampusPulseContextType | undefined>(undefined);

export const CampusPulseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('campuspulse_incidents_v3');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [reports, setReports] = useState<RawReport[]>(() => {
    const saved = localStorage.getItem('campuspulse_reports_v3');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [responders, setResponders] = useState<Responder[]>(() => {
    const saved = localStorage.getItem('campuspulse_responders_v3');
    return saved ? JSON.parse(saved) : INITIAL_RESPONDERS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('campuspulse_notifications_v3');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [signals, setSignals] = useState<CampusSignal[]>(() => {
    const saved = localStorage.getItem('campuspulse_signals_v3');
    return saved ? JSON.parse(saved) : INITIAL_SIGNALS;
  });

  const [studentProfile, setStudentProfile] = useState<StudentProfileData>(() => {
    const saved = localStorage.getItem('campuspulse_student_profile_v3');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENT_PROFILE;
  });

  const [emergencyHotlines] = useState<EmergencyHotline[]>(DEFAULT_HOTLINES);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [activeCallingHotline, setActiveCallingHotline] = useState<EmergencyHotline | null>(null);

  const [zones] = useState<CampusZone[]>(CAMPUS_ZONES);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('inc-01');
  const [activeRole, setActiveRole] = useState<UserRole>('STUDENT');
  const [currentScreen, setCurrentScreen] = useState<string>('STUDENT_HOME');
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [demoProgressMessage, setDemoProgressMessage] = useState<string>('');

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('campuspulse_incidents_v3', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('campuspulse_reports_v3', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('campuspulse_responders_v3', JSON.stringify(responders));
  }, [responders]);

  useEffect(() => {
    localStorage.setItem('campuspulse_notifications_v3', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('campuspulse_signals_v3', JSON.stringify(signals));
  }, [signals]);

  useEffect(() => {
    localStorage.setItem('campuspulse_student_profile_v3', JSON.stringify(studentProfile));
  }, [studentProfile]);

  // SLA Timer Countdown Tick
  useEffect(() => {
    const interval = setInterval(() => {
      setIncidents(prevIncidents => {
        let changed = false;
        const updated = prevIncidents.map(inc => {
          if (inc.status === 'AWAITING_ACK' && inc.secondsRemaining > 0) {
            changed = true;
            const newSeconds = inc.secondsRemaining - 1;
            
            // Timeout reached -> Auto escalate
            if (newSeconds === 0 && !inc.isEscalated) {
              const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const isoNow = new Date().toISOString();
              
              // Push notification to Dispatcher and Chief
              addNotification({
                title: `🚨 SLA BREACH: Incident #${inc.incidentNumber} escalated to Chief`,
                message: `Responder acknowledgement SLA exceeded. Incident escalated automatically to Duty Operations Chief.`,
                type: 'ESCALATION',
                incidentId: inc.id,
                targetRole: 'SUPERVISOR',
                channel: 'SMS'
              });

              return {
                ...inc,
                secondsRemaining: 0,
                status: 'ESCALATED' as IncidentStatus,
                isEscalated: true,
                escalatedTo: 'Duty Operations Chief',
                escalationReason: 'Responder acknowledgement SLA timeout exceeded (60s)',
                timeline: [
                  ...inc.timeline,
                  {
                    id: `tl-esc-${Date.now()}`,
                    timestamp: nowTime,
                    isoTimestamp: isoNow,
                    title: 'Automated supervisor escalation',
                    description: 'Responder acknowledgement SLA exceeded. Incident escalated automatically to Duty Operations Chief.',
                    actor: 'AWS Step Functions Engine',
                    type: 'ESCALATED',
                    isAutomated: true
                  }
                ]
              };
            }

            return { ...inc, secondsRemaining: newSeconds };
          }
          return inc;
        });
        return changed ? updated : prevIncidents;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0] || null;

  const updateStudentProfile = (updated: Partial<StudentProfileData>) => {
    setStudentProfile(prev => ({
      ...prev,
      ...updated,
      emergencyContact: {
        ...prev.emergencyContact,
        ...(updated.emergencyContact || {})
      },
      notificationPreferences: {
        ...prev.notificationPreferences,
        ...(updated.notificationPreferences || {})
      }
    }));
  };

  const loginStudent = (student: Partial<StudentProfileData>) => {
    setStudentProfile(prev => ({
      ...prev,
      ...student,
      isLoggedIn: true
    }));
  };

  const logoutStudent = () => {
    setStudentProfile(prev => ({
      ...prev,
      isLoggedIn: false
    }));
  };

  const openEmergencyCall = (hotline: EmergencyHotline) => {
    setActiveCallingHotline(hotline);
    setIsCallModalOpen(true);
  };

  const closeEmergencyCall = () => {
    setIsCallModalOpen(false);
    setActiveCallingHotline(null);
  };

  const addNotification = (notif: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: 'Just now',
      read: false,
      ...notif,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addSignal = (sig: Omit<CampusSignal, 'id' | 'timestamp'>) => {
    const newSig: CampusSignal = {
      id: `sig-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...sig,
    };
    setSignals(prev => [newSig, ...prev]);
  };

  // Student Report Submission with Live Fusion
  const submitStudentReport = (input: SubmitReportInput) => {
    const nowIso = new Date().toISOString();
    const timeShort = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const reportNum = `R-${Math.floor(1000 + Math.random() * 9000)}`;
    const studentId = studentProfile.studentId || 'STU-882194';
    
    const newReport: RawReport = {
      id: `rep-${Date.now()}`,
      reportNumber: reportNum,
      text: input.text,
      location: input.location,
      category: input.category,
      timestamp: nowIso,
      source: 'STUDENT_REPORT',
      submitterId: studentId,
      submitterName: input.submitterName || (input.isAnonymous ? 'Anonymous Student' : studentProfile.name || 'Student'),
      submitterRole: input.isAnonymous ? 'Anonymous' : (input.submitterRole || 'Student'),
      submitterContact: input.submitterContact || (input.isAnonymous ? undefined : studentProfile.phone),
      personState: input.personState || 'UNKNOWN',
      isAnonymous: input.isAnonymous,
      evidencePhotos: input.evidencePhotos || []
    };

    // Fire the real backend call in the background — doesn't block or
    // change the local UI simulation, just proves the AWS integration works.
    submitReportToApi({
      text: input.text,
      location: input.location,
      category: input.category,
      person_state: input.personState,
    }).catch(err => console.error('Backend submitReport failed:', err));

    // Evaluate fusion against active incidents
    const { matchedIncident, scoreResult } = findMatchingIncident(newReport, incidents);

    if (matchedIncident && scoreResult && scoreResult.fusionScore >= 0.70) {
      // FUSE INTO EXISTING INCIDENT
      newReport.incidentId = matchedIncident.id;
      newReport.fusionScoreWithIncident = scoreResult.fusionScore;
      newReport.fusionExplanation = {
        locationMatch: scoreResult.locationScore >= 0.5,
        locationScore: scoreResult.locationScore,
        timeDeltaMinutes: 1,
        timeScore: scoreResult.timeScore,
        textScore: scoreResult.textScore,
        categoryScore: scoreResult.categoryScore,
        matchStrength: scoreResult.matchStrength,
        keySignals: scoreResult.reasons
      };

      // Recalculate priority if new report has higher urgency
      const newPriorityExpl = calculatePriority(
        matchedIncident.category,
        input.personState,
        `${matchedIncident.fullDescription} ${input.text}`,
        matchedIncident.reportCount + 1
      );

      const priorityOrder = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 };
      const shouldUpgradePriority = priorityOrder[newPriorityExpl.level] > priorityOrder[matchedIncident.priority];

      const updatedSubmitterIds = Array.from(new Set([...matchedIncident.submitterIds, studentId]));

      const updatedIncident: Incident = {
        ...matchedIncident,
        source: 'FUSED',
        reportCount: matchedIncident.reportCount + 1,
        reportIds: [...matchedIncident.reportIds, newReport.id],
        submitterIds: updatedSubmitterIds,
        reports: [...matchedIncident.reports, newReport],
        priority: shouldUpgradePriority ? newPriorityExpl.level : matchedIncident.priority,
        priorityExplanation: shouldUpgradePriority ? newPriorityExpl : matchedIncident.priorityExplanation,
        updatedAt: nowIso,
        fusionExplanation: {
          matchStrength: 'Strong match',
          reasons: scoreResult.reasons,
          fusedReportsCount: matchedIncident.reportCount + 1,
          summaryText: `${matchedIncident.reportCount + 1} signals consolidated into single master incident`
        },
        timeline: [
          ...matchedIncident.timeline,
          {
            id: `tl-fuse-${Date.now()}`,
            timestamp: timeShort,
            isoTimestamp: nowIso,
            title: 'Related report consolidated',
            description: `Report ${newReport.reportNumber} received from ${newReport.submitterName}. Fused with active incident (${Math.round(scoreResult.fusionScore * 100)}% match).`,
            actor: 'Fusion Engine',
            type: 'FUSION',
            isAutomated: true
          }
        ]
      };

      setReports(prev => [newReport, ...prev]);
      setIncidents(prev => prev.map(inc => inc.id === matchedIncident.id ? updatedIncident : inc));
      setSelectedIncidentId(matchedIncident.id);

      addNotification({
        title: `Report ${reportNum} consolidated with #${matchedIncident.incidentNumber}`,
        message: `Strong match detected (${Math.round(scoreResult.fusionScore * 100)}%). Consolidated into ${matchedIncident.title}.`,
        type: 'FUSION',
        incidentId: matchedIncident.id,
        targetRole: 'DISPATCHER',
        channel: 'APP'
      });

      return { report: newReport, incident: updatedIncident, wasFused: true };
    } else {
      // CREATE NEW INCIDENT
      const incNum = `CP-${Math.floor(1000 + Math.random() * 9000)}`;
      const priorityExpl = calculatePriority(input.category, input.personState, input.text, 1);
      
      const availableResponder = responders.find(r => r.category === input.category && r.status === 'AVAILABLE') 
        || responders.find(r => r.status === 'AVAILABLE') 
        || responders[0];

      const newIncident: Incident = {
        id: `inc-${Date.now()}`,
        incidentNumber: incNum,
        title: `${input.category.charAt(0) + input.category.slice(1).toLowerCase()} Incident`,
        category: input.category,
        location: input.location,
        buildingZone: 'Campus Grounds',
        coordinates: { x: 50 + (Math.random() * 20 - 10), y: 50 + (Math.random() * 20 - 10) },
        priority: priorityExpl.level,
        status: 'AWAITING_ACK',
        source: 'STUDENT_REPORT',
        isEmergencyCall: false,
        summary: input.text.slice(0, 80) + (input.text.length > 80 ? '...' : ''),
        fullDescription: input.text,
        reportCount: 1,
        emergencyCallCount: 0,
        reportIds: [newReport.id],
        submitterIds: [studentId],
        reports: [newReport],
        createdAt: nowIso,
        updatedAt: nowIso,
        assignedResponder: availableResponder,
        assignedResponderId: availableResponder?.id,
        slaSeconds: priorityExpl.level === 'CRITICAL' ? 60 : priorityExpl.level === 'HIGH' ? 120 : 300,
        secondsRemaining: priorityExpl.level === 'CRITICAL' ? 60 : priorityExpl.level === 'HIGH' ? 120 : 300,
        isEscalated: false,
        priorityExplanation: priorityExpl,
        timeline: [
          {
            id: `tl-create-${Date.now()}`,
            timestamp: timeShort,
            isoTimestamp: nowIso,
            title: 'Report received',
            description: `Initial report ${reportNum} logged by ${newReport.submitterName}`,
            actor: newReport.submitterName || 'Student',
            type: 'REPORT_RECEIVED'
          },
          {
            id: `tl-prio-${Date.now()}`,
            timestamp: timeShort,
            isoTimestamp: nowIso,
            title: `${priorityExpl.level} priority assigned`,
            description: priorityExpl.headline,
            actor: 'Priority Rules Engine',
            type: 'PRIORITY_ASSIGNED',
            isAutomated: true
          },
          {
            id: `tl-disp-${Date.now()}`,
            timestamp: timeShort,
            isoTimestamp: nowIso,
            title: 'Response team assigned',
            description: `${availableResponder?.name} (${availableResponder?.role}) dispatched`,
            actor: 'Operation Dispatcher',
            type: 'DISPATCH',
            isAutomated: true
          }
        ],
        evidenceUrls: input.evidencePhotos || []
      };

      newReport.incidentId = newIncident.id;

      setReports(prev => [newReport, ...prev]);
      setIncidents(prev => [newIncident, ...prev]);
      setSelectedIncidentId(newIncident.id);

      addNotification({
        title: `New ${priorityExpl.level} Incident #${incNum}`,
        message: `${newIncident.title} reported at ${input.location}. Responder dispatched.`,
        type: priorityExpl.level === 'CRITICAL' ? 'CRITICAL' : 'DISPATCH',
        incidentId: newIncident.id,
        targetRole: 'DISPATCHER',
        channel: 'PUSH'
      });

      return { report: newReport, incident: newIncident, wasFused: false };
    }
  };

  // Emergency Call Submission (Enters the Same Master Incident Pipeline)
  const submitEmergencyCall = (input: SubmitEmergencyCallInput) => {
    const nowIso = new Date().toISOString();
    const timeShort = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const callNum = `CALL-${Math.floor(1000 + Math.random() * 9000)}`;
    const studentId = studentProfile.studentId || 'STU-882194';

    const newCallReport: RawReport = {
      id: `call-rep-${Date.now()}`,
      reportNumber: callNum,
      text: input.description || `Emergency Call: ${input.purpose} at ${input.location}`,
      location: input.location,
      category: input.category,
      timestamp: nowIso,
      source: 'EMERGENCY_CALL',
      purpose: input.purpose,
      submitterId: studentId,
      submitterName: studentProfile.name,
      submitterRole: 'Student',
      submitterContact: studentProfile.phone,
      personState: input.purpose.toLowerCase().includes('unconscious') ? 'UNCONSCIOUS' : 'INJURED',
      isAnonymous: false
    };

    // Run fusion against existing active incidents
    const { matchedIncident, scoreResult } = findMatchingIncident(newCallReport, incidents);

    if (matchedIncident && scoreResult && scoreResult.fusionScore >= 0.65) {
      // FUSE CALL INTO MASTER INCIDENT
      newCallReport.incidentId = matchedIncident.id;
      newCallReport.fusionScoreWithIncident = scoreResult.fusionScore;

      const priorityExpl = calculatePriority(input.category, newCallReport.personState, `${matchedIncident.fullDescription} ${input.description}`, matchedIncident.reportCount + 1);

      const updatedSubmitterIds = Array.from(new Set([...matchedIncident.submitterIds, studentId]));

      const updatedIncident: Incident = {
        ...matchedIncident,
        isEmergencyCall: true,
        emergencyPurpose: input.purpose,
        emergencyCallCount: (matchedIncident.emergencyCallCount || 0) + 1,
        reportCount: matchedIncident.reportCount + 1,
        reportIds: [...matchedIncident.reportIds, newCallReport.id],
        submitterIds: updatedSubmitterIds,
        reports: [...matchedIncident.reports, newCallReport],
        priority: priorityExpl.level === 'CRITICAL' ? 'CRITICAL' : matchedIncident.priority,
        updatedAt: nowIso,
        timeline: [
          ...matchedIncident.timeline,
          {
            id: `tl-call-${Date.now()}`,
            timestamp: timeShort,
            isoTimestamp: nowIso,
            title: '🚨 Emergency call received & fused',
            description: `Hotline call initiated by ${studentProfile.name}. Purpose: ${input.purpose}. Fused into active incident #${matchedIncident.incidentNumber}.`,
            actor: 'Emergency Hotline Dispatch',
            type: 'EMERGENCY_CALL',
            isAutomated: true
          }
        ]
      };

      setReports(prev => [newCallReport, ...prev]);
      setIncidents(prev => prev.map(inc => inc.id === matchedIncident.id ? updatedIncident : inc));
      setSelectedIncidentId(matchedIncident.id);

      addNotification({
        title: `🚨 Emergency Call fused into #${matchedIncident.incidentNumber}`,
        message: `Emergency Call (${input.purpose}) connected to ${matchedIncident.title} at ${input.location}.`,
        type: 'EMERGENCY_CALL',
        incidentId: matchedIncident.id,
        targetRole: 'DISPATCHER',
        channel: 'PUSH'
      });

      return { report: newCallReport, incident: updatedIncident, wasFused: true };
    } else {
      // CREATE STANDALONE EMERGENCY CALL INCIDENT
      const incNum = `CP-CALL-${Math.floor(1000 + Math.random() * 9000)}`;
      const priorityExpl = calculatePriority(input.category, newCallReport.personState, input.description || input.purpose, 1);

      const availableResponder = responders.find(r => r.category === input.category && r.status === 'AVAILABLE') 
        || responders.find(r => r.status === 'AVAILABLE') 
        || responders[0];

      const newIncident: Incident = {
        id: `inc-call-${Date.now()}`,
        incidentNumber: incNum,
        title: `Emergency Call: ${input.purpose}`,
        category: input.category,
        location: input.location,
        buildingZone: 'Sports Complex',
        coordinates: { x: 74, y: 32 },
        priority: priorityExpl.level,
        status: 'AWAITING_ACK',
        source: 'EMERGENCY_CALL',
        isEmergencyCall: true,
        emergencyPurpose: input.purpose,
        summary: `Emergency request for ${input.purpose} at ${input.location}`,
        fullDescription: input.description || `Immediate hotline call: ${input.purpose} reported at ${input.location}. Caller: ${studentProfile.name} (${studentProfile.studentId}).`,
        reportCount: 1,
        emergencyCallCount: 1,
        reportIds: [newCallReport.id],
        submitterIds: [studentId],
        reports: [newCallReport],
        createdAt: nowIso,
        updatedAt: nowIso,
        assignedResponder: availableResponder,
        assignedResponderId: availableResponder?.id,
        slaSeconds: 60,
        secondsRemaining: 60,
        isEscalated: false,
        priorityExplanation: priorityExpl,
        timeline: [
          {
            id: `tl-call-init-${Date.now()}`,
            timestamp: timeShort,
            isoTimestamp: nowIso,
            title: '🚨 Emergency call initiated',
            description: `Emergency request initiated by ${studentProfile.name} (${studentProfile.studentId})`,
            actor: studentProfile.name,
            type: 'EMERGENCY_CALL'
          },
          {
            id: `tl-call-prio-${Date.now()}`,
            timestamp: timeShort,
            isoTimestamp: nowIso,
            title: 'Critical priority assigned',
            description: `Immediate dispatch protocol active: ${priorityExpl.headline}`,
            actor: 'Priority Rules Engine',
            type: 'PRIORITY_ASSIGNED',
            isAutomated: true
          },
          {
            id: `tl-call-disp-${Date.now()}`,
            timestamp: timeShort,
            isoTimestamp: nowIso,
            title: 'Response team assigned',
            description: `Dispatched ${availableResponder?.name} (${availableResponder?.role})`,
            actor: 'Operation Dispatcher',
            type: 'DISPATCH',
            isAutomated: true
          }
        ],
        evidenceUrls: []
      };

      newCallReport.incidentId = newIncident.id;

      setReports(prev => [newCallReport, ...prev]);
      setIncidents(prev => [newIncident, ...prev]);
      setSelectedIncidentId(newIncident.id);

      addNotification({
        title: `🚨 EMERGENCY CALL: ${input.purpose}`,
        message: `High-priority emergency call from ${studentProfile.name} at ${input.location}. Responder dispatched.`,
        type: 'EMERGENCY_CALL',
        incidentId: newIncident.id,
        targetRole: 'DISPATCHER',
        channel: 'PUSH'
      });

      return { report: newCallReport, incident: newIncident, wasFused: false };
    }
  };

  const acknowledgeIncident = (incidentId: string) => {
    const timeShort = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = new Date().toISOString();

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const respName = inc.assignedResponder?.name || 'Assigned Responder';
        return {
          ...inc,
          status: 'ACKNOWLEDGED' as IncidentStatus,
          secondsRemaining: 0,
          timeline: [
            ...inc.timeline,
            {
              id: `tl-ack-${Date.now()}`,
              timestamp: timeShort,
              isoTimestamp: nowIso,
              title: 'Response team acknowledged',
              description: `${respName} confirmed dispatch and started field preparation`,
              actor: respName,
              type: 'ACKNOWLEDGED'
            }
          ]
        };
      }
      return inc;
    }));

    addNotification({
      title: `Response team acknowledged`,
      message: `Responder acknowledged incident. Response timer completed.`,
      type: 'DISPATCH',
      incidentId,
      channel: 'APP'
    });
  };

  const markEnRoute = (incidentId: string) => {
    const timeShort = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = new Date().toISOString();

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const respName = inc.assignedResponder?.name || 'Assigned Responder';
        return {
          ...inc,
          status: 'EN_ROUTE' as IncidentStatus,
          timeline: [
            ...inc.timeline,
            {
              id: `tl-enroute-${Date.now()}`,
              timestamp: timeShort,
              isoTimestamp: nowIso,
              title: 'Responder en route',
              description: `${respName} is currently en route to ${inc.location}`,
              actor: respName,
              type: 'EN_ROUTE'
            }
          ]
        };
      }
      return inc;
    }));
  };

  const markOnScene = (incidentId: string) => {
    const timeShort = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = new Date().toISOString();

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const respName = inc.assignedResponder?.name || 'Assigned Responder';
        return {
          ...inc,
          status: 'ON_SCENE' as IncidentStatus,
          timeline: [
            ...inc.timeline,
            {
              id: `tl-onscene-${Date.now()}`,
              timestamp: timeShort,
              isoTimestamp: nowIso,
              title: 'Responder on scene',
              description: `${respName} arrived on scene at ${inc.location} and established safety perimeter`,
              actor: respName,
              type: 'ON_SCENE'
            }
          ]
        };
      }
      return inc;
    }));
  };

  const resolveIncident = (incidentId: string, notes?: string) => {
    const timeShort = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = new Date().toISOString();

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const respName = inc.assignedResponder?.name || 'Operations Lead';
        return {
          ...inc,
          status: 'RESOLVED' as IncidentStatus,
          resolvedAt: nowIso,
          resolvedBy: respName,
          resolutionNotes: notes || 'Scene triaged, emergency verified safe, and closed by campus responders.',
          timeline: [
            ...inc.timeline,
            {
              id: `tl-res-${Date.now()}`,
              timestamp: timeShort,
              isoTimestamp: nowIso,
              title: 'Incident resolved',
              description: notes || 'Incident safely triaged, addressed, and closed by campus responders.',
              actor: respName,
              type: 'RESOLVED'
            }
          ]
        };
      }
      return inc;
    }));

    addNotification({
      title: `Incident successfully resolved`,
      message: `Operations command recorded resolution. Scene verified safe.`,
      type: 'RESOLUTION',
      incidentId,
      channel: 'APP'
    });
  };

  const reassignResponder = (incidentId: string, responderId: string) => {
    const newResponder = responders.find(r => r.id === responderId);
    if (!newResponder) return;
    const timeShort = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = new Date().toISOString();

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          assignedResponder: newResponder,
          assignedResponderId: newResponder.id,
          status: 'AWAITING_ACK' as IncidentStatus,
          secondsRemaining: inc.slaSeconds,
          timeline: [
            ...inc.timeline,
            {
              id: `tl-reassign-${Date.now()}`,
              timestamp: timeShort,
              isoTimestamp: nowIso,
              title: 'Responder reassigned',
              description: `Operations Command dispatched ${newResponder.name} (${newResponder.role})`,
              actor: 'Operation Dispatcher',
              type: 'DISPATCH'
            }
          ]
        };
      }
      return inc;
    }));

    addNotification({
      title: `Unit reassigned`,
      message: `${newResponder.name} assigned to Incident.`,
      type: 'DISPATCH',
      incidentId,
      channel: 'RADIO'
    });
  };

  const triggerManualEscalation = (incidentId: string, reason = 'Manual dispatcher supervisor escalation') => {
    const timeShort = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = new Date().toISOString();

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'ESCALATED' as IncidentStatus,
          isEscalated: true,
          escalatedTo: 'Duty Operations Chief',
          escalationReason: reason,
          timeline: [
            ...inc.timeline,
            {
              id: `tl-man-esc-${Date.now()}`,
              timestamp: timeShort,
              isoTimestamp: nowIso,
              title: 'Manual supervisor escalation',
              description: `Escalated to Duty Operations Chief. Command priority override active.`,
              actor: 'Operation Dispatcher',
              type: 'ESCALATED'
            }
          ]
        };
      }
      return inc;
    }));

    addNotification({
      title: `Supervisor Escalation Triggered`,
      message: `Incident escalated. Duty Operations Chief alerted via high-priority channel.`,
      type: 'ESCALATION',
      incidentId,
      targetRole: 'SUPERVISOR',
      channel: 'SMS'
    });
  };

  // Duty Operations Chief Command Intervention
  const takeChiefCommand = (incidentId: string, actionType: 'REASSIGN' | 'TACTICAL_DEPLOY' | 'ZONE_ALERT', details?: any) => {
    const timeShort = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = new Date().toISOString();

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        let actionDesc = 'Duty Operations Chief took direct command of the escalated incident.';
        let updatedResponder = inc.assignedResponder;

        if (actionType === 'REASSIGN') {
          // Reassign senior responder
          const senior = responders.find(r => r.skills.includes('Master Electrician') || r.skills.includes('Field Incident Command')) || responders[0];
          updatedResponder = senior;
          actionDesc = `Duty Operations Chief reassigned senior unit ${senior.name} (${senior.unitCode}) with priority override.`;
        } else if (actionType === 'TACTICAL_DEPLOY') {
          actionDesc = 'Duty Operations Chief deployed secondary tactical backup team to secure perimeter.';
        } else if (actionType === 'ZONE_ALERT') {
          actionDesc = `Duty Operations Chief authorized campus-wide perimeter alert for ${inc.location}.`;
        }

        return {
          ...inc,
          assignedResponder: updatedResponder,
          assignedResponderId: updatedResponder?.id,
          status: 'ACKNOWLEDGED' as IncidentStatus,
          isEscalated: false,
          timeline: [
            ...inc.timeline,
            {
              id: `tl-chief-${Date.now()}`,
              timestamp: timeShort,
              isoTimestamp: nowIso,
              title: '⭐ Command Intervention by Duty Chief',
              description: actionDesc,
              actor: 'Dr. Marcus Vance (Duty Operations Chief)',
              type: 'CHIEF_INTERVENTION'
            }
          ]
        };
      }
      return inc;
    }));

    addNotification({
      title: `⭐ Chief Command Intervention`,
      message: `Duty Operations Chief intervened on Incident #${incidentId}.`,
      type: 'CRITICAL',
      incidentId,
      channel: 'RADIO'
    });
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetAllData = () => {
    localStorage.removeItem('campuspulse_incidents_v3');
    localStorage.removeItem('campuspulse_reports_v3');
    localStorage.removeItem('campuspulse_responders_v3');
    localStorage.removeItem('campuspulse_notifications_v3');
    localStorage.removeItem('campuspulse_signals_v3');
    localStorage.removeItem('campuspulse_student_profile_v3');
    setIncidents(INITIAL_INCIDENTS);
    setReports(INITIAL_REPORTS);
    setResponders(INITIAL_RESPONDERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSignals(INITIAL_SIGNALS);
    setStudentProfile(DEFAULT_STUDENT_PROFILE);
    setSelectedIncidentId('inc-01');
    setIsDemoRunning(false);
    setDemoProgressMessage('');
  };

  // SIGNATURE DEMO 1: Complete Medical Fusion + Emergency Call Workflow
  const triggerMedicalDemo = async () => {
    setIsDemoRunning(true);
    setCurrentScreen('FUSION');

    setDemoProgressMessage('Step 1/5: Student 1 reports "Someone collapsed near basketball court"...');
    resetAllData();
    await new Promise(r => setTimeout(r, 1200));

    setDemoProgressMessage('Step 2/5: Student 2 reports "Unconscious person near sports ground" → Fused into Master Incident...');
    await new Promise(r => setTimeout(r, 1400));

    setDemoProgressMessage('Step 3/5: Student 3 uses Emergency Help → CALL MEDICAL RESPONSE (Purpose: "Unconscious person")...');
    await new Promise(r => setTimeout(r, 1500));

    setDemoProgressMessage('Step 4/5: Fusion Engine confirms 3 reports + 1 emergency call → ONE Critical Incident (#CP-1042)...');
    setSelectedIncidentId('inc-01');
    await new Promise(r => setTimeout(r, 1500));

    setDemoProgressMessage('Step 5/5: Dispatcher alerts Arjun Kumar (MED-UNIT-2) → Acknowledged → En Route → Resolved.');
    await new Promise(r => setTimeout(r, 1500));

    setIsDemoRunning(false);
  };

  // SIGNATURE DEMO 2: Automated Escalation & Duty Chief Command Intervention
  const triggerEscalationDemo = async () => {
    setIsDemoRunning(true);
    setCurrentScreen('ESCALATION');
    setSelectedIncidentId('inc-02'); // The electrical incident

    setDemoProgressMessage('Step 1/4: Monitoring SLA timer on Incident #CP-1038 (45s SLA)...');
    await new Promise(r => setTimeout(r, 1200));

    setDemoProgressMessage('Step 2/4: Responder unacknowledged → SLA Timeout (0s) → Auto-escalated to Duty Operations Chief...');
    
    // Force timeout on inc-02
    setIncidents(prev => prev.map(inc => {
      if (inc.id === 'inc-02') {
        return {
          ...inc,
          secondsRemaining: 0,
          status: 'ESCALATED',
          isEscalated: true,
          escalatedTo: 'Duty Operations Chief',
          escalationReason: 'Responder acknowledgement SLA timeout exceeded',
          timeline: [
            ...inc.timeline,
            {
              id: `tl-demo-esc-${Date.now()}`,
              timestamp: '10:48',
              isoTimestamp: new Date().toISOString(),
              title: 'Automated supervisor escalation',
              description: 'Response SLA timeout exceeded. Step Functions auto-escalated to Duty Operations Chief.',
              actor: 'AWS Step Functions Engine',
              type: 'ESCALATED',
              isAutomated: true
            }
          ]
        };
      }
      return inc;
    }));

    addNotification({
      title: '🚨 SLA BREACH: Incident #CP-1038',
      message: 'Electrical hazard timed out without acknowledgement. Paging Duty Operations Chief.',
      type: 'ESCALATION',
      incidentId: 'inc-02',
      targetRole: 'SUPERVISOR',
      channel: 'SMS'
    });

    await new Promise(r => setTimeout(r, 1600));

    setDemoProgressMessage('Step 3/4: Duty Operations Chief intervenes → Reassigns Senior Engineer David Chen...');
    takeChiefCommand('inc-02', 'REASSIGN');
    await new Promise(r => setTimeout(r, 1600));

    setDemoProgressMessage('Step 4/4: Senior Unit acknowledges & heads En Route. Incident secured.');
    await new Promise(r => setTimeout(r, 1400));

    setIsDemoRunning(false);
  };

  return (
    <CampusPulseContext.Provider
      value={{
        incidents,
        reports,
        responders,
        notifications,
        signals,
        zones,
        selectedIncidentId,
        selectedIncident,
        activeRole,
        currentScreen,
        isDemoRunning,
        demoProgressMessage,
        studentProfile,
        updateStudentProfile,
        loginStudent,
        logoutStudent,
        emergencyHotlines,
        isCallModalOpen,
        activeCallingHotline,
        openEmergencyCall,
        closeEmergencyCall,
        submitEmergencyCall,
        setSelectedIncidentId,
        setActiveRole,
        setCurrentScreen,
        submitStudentReport,
        acknowledgeIncident,
        markEnRoute,
        markOnScene,
        resolveIncident,
        reassignResponder,
        triggerManualEscalation,
        takeChiefCommand,
        markNotificationRead,
        clearAllNotifications,
        triggerMedicalDemo,
        triggerEscalationDemo,
        resetAllData,
      }}
    >
      {children}
    </CampusPulseContext.Provider>
  );
};

export const useCampusPulse = () => {
  const context = useContext(CampusPulseContext);
  if (!context) {
    throw new Error('useCampusPulse must be used within a CampusPulseProvider');
  }
  return context;
};
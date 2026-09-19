import React, { useState } from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { UserRole } from '../../types';
import { 
  Shield, 
  Bell, 
  RotateCcw, 
  UserCheck, 
  MapPin, 
  ChevronDown, 
  HeartPulse, 
  Zap,
  CheckCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    triggerMedicalDemo,
    triggerEscalationDemo,
    resetAllData,
    isDemoRunning,
    demoProgressMessage,
    incidents,
    setCurrentScreen,
    setSelectedIncidentId
  } = useCampusPulse();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // If student, filter to student notifications
  const relevantNotifications = activeRole === 'STUDENT'
    ? notifications.filter(n => 
        n.channel === 'SMS' || 
        n.channel === 'PUSH' || 
        n.type === 'RESOLUTION' || 
        n.type === 'CRITICAL' ||
        n.title.toLowerCase().includes('report') ||
        n.title.toLowerCase().includes('received') ||
        n.title.toLowerCase().includes('assigned')
      )
    : notifications;

  const unreadCount = relevantNotifications.filter(n => !n.read).length;
  const criticalCount = incidents.filter(i => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length;

  const roleLabels: Record<UserRole, { label: string; desc: string; color: string }> = {
    STUDENT: { label: 'Student / Community', desc: 'Mobile Incident Portal', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    RESPONDER: { label: 'Emergency Responder', desc: 'Field Medical & Safety Units', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    DISPATCHER: { label: 'Operations Dispatcher', desc: 'Command Center Control', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    SUPERVISOR: { label: 'Duty Operations Chief', desc: 'Executive Incident Authority', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  };

  const handleRoleSelect = (role: UserRole) => {
    setActiveRole(role);
    setShowRoleMenu(false);
    if (role === 'STUDENT') {
      setCurrentScreen('STUDENT_HOME');
    } else if (role === 'RESPONDER') {
      setCurrentScreen('RESPONDER');
    } else {
      setCurrentScreen('COMMAND');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-white/50 shadow-md transition-all">
      {/* Demo Progress Alert Banner */}
      {isDemoRunning && (
        <div className="bg-brand-600/95 backdrop-blur-md text-white px-4 py-2 text-xs font-medium flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white animate-ping" />
            <span className="font-semibold uppercase tracking-wider">Interactive Hackathon Demo Active:</span>
            <span>{demoProgressMessage}</span>
          </div>
          <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded text-white font-mono">LIVE SIMULATION</span>
        </div>
      )}

      {/* Critical Incidents Warning Ticker (Only for Operations/Responder roles) */}
      {!isDemoRunning && activeRole !== 'STUDENT' && criticalCount > 0 && (
        <div className="bg-rose-50/90 backdrop-blur-md border-b border-rose-200/70 text-rose-900 px-4 py-1.5 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
            <span className="font-bold">CRITICAL INCIDENT ACTIVE:</span>
            <span>{criticalCount} high-urgency emergency requires immediate responder attention</span>
          </div>
          <button 
            onClick={() => {
              const crit = incidents.find(i => i.priority === 'CRITICAL' && i.status !== 'RESOLVED');
              if (crit) {
                setSelectedIncidentId(crit.id);
                setCurrentScreen('COMMAND');
              }
            }}
            className="text-rose-700 hover:text-rose-900 font-semibold underline text-xs cursor-pointer"
          >
            View Critical Incident &rarr;
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div 
            onClick={() => {
              if (activeRole === 'STUDENT') {
                setCurrentScreen('STUDENT_HOME');
              } else {
                setCurrentScreen('HOME');
              }
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-brand-600/20">
              <Shield className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900">CampusPulse</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE OPERATIONS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                One campus. One signal. One coordinated response.
              </p>
            </div>
          </div>

          {/* Center Actions: Demo Controls (Available for testing / demoing across views) */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => triggerMedicalDemo()}
              disabled={isDemoRunning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white text-brand-700 border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
              title="Demo: 3 Fragmented Reports Converging into 1 Critical Medical Incident"
            >
              <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
              <span>Demo 1: Medical Fusion</span>
            </button>

            <button
              onClick={() => triggerEscalationDemo()}
              disabled={isDemoRunning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white text-slate-700 border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
              title="Demo: Unanswered Incident Timer -> Step Function Supervisor Escalation"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Demo 2: Auto-Escalation</span>
            </button>

            <button
              onClick={resetAllData}
              disabled={isDemoRunning}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white transition-all cursor-pointer"
              title="Reset Demo State"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Header Area: Campus Selector, Notifications, Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Campus selector */}
            <div className="hidden lg:flex items-center gap-1 text-xs text-slate-600 font-medium bg-slate-100/80 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Main University Campus</span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {activeRole === 'STUDENT' ? 'Safety Updates' : 'Operational Dispatch Log'}
                      </span>
                      <span className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">
                        {relevantNotifications.length}
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-brand-600 hover:text-brand-800 font-bold cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                    {relevantNotifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No recent alerts</p>
                    ) : (
                      relevantNotifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (activeRole === 'STUDENT') {
                              if (n.incidentId) {
                                setSelectedIncidentId(n.incidentId);
                                setCurrentScreen('STUDENT_TRACKING');
                              } else {
                                setCurrentScreen('STUDENT_NOTIFICATIONS');
                              }
                            } else {
                              if (n.incidentId) {
                                setSelectedIncidentId(n.incidentId);
                                setCurrentScreen('COMMAND');
                              }
                            }
                            setShowNotifications(false);
                          }}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                            n.read ? 'bg-white border-slate-100 text-slate-600' : 'bg-brand-50/40 border-brand-100 text-slate-900 font-medium'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 truncate">{n.title}</span>
                            <span className="text-[10px] text-slate-400 ml-2 whitespace-nowrap">{n.timestamp}</span>
                          </div>
                          <p className="text-slate-500 mt-1 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${roleLabels[activeRole].color}`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{roleLabels[activeRole].label}</span>
                <span className="sm:hidden">{activeRole}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-fade-in">
                  <p className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Switch Role Perspective</p>
                  {(Object.keys(roleLabels) as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex flex-col gap-0.5 transition-colors cursor-pointer ${
                        activeRole === role ? 'bg-brand-50 text-brand-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-bold text-slate-900">{roleLabels[role].label}</span>
                      <span className="text-[10px] text-slate-400">{roleLabels[role].desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

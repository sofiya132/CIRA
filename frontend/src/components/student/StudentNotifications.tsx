import React from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { 
  Bell, 
  CheckCircle2, 
  HeartPulse, 
  Shield, 
  AlertCircle, 
  Clock, 
  ArrowRight,
  Radio,
  CheckCheck
} from 'lucide-react';

export const StudentNotifications: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    clearAllNotifications, 
    setCurrentScreen, 
    setSelectedIncidentId,
    incidents 
  } = useCampusPulse();

  // Filter student-safe notifications (their reports, status updates, safety announcements)
  // Student role must NEVER see internal AWS logs, dispatcher technical queue notes, or raw fusion logs
  const studentSafeNotifications = notifications.filter(n => 
    n.channel === 'SMS' || 
    n.channel === 'PUSH' || 
    n.type === 'RESOLUTION' || 
    n.type === 'CRITICAL' ||
    n.title.toLowerCase().includes('report') ||
    n.title.toLowerCase().includes('received') ||
    n.title.toLowerCase().includes('assigned') ||
    n.title.toLowerCase().includes('resolved')
  );

  const unreadCount = studentSafeNotifications.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Notifications & Updates
            </h1>
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-600 text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status updates, responder assignments, and campus safety alerts for your submissions.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={clearAllNotifications}
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {studentSafeNotifications.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-400 shadow-sm">
            <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No new notifications</h3>
            <p className="mt-0.5">You will receive notifications when your reports update or emergency alerts are broadcasted.</p>
          </div>
        ) : (
          studentSafeNotifications.map((notif) => {
            const isCritical = notif.type === 'CRITICAL';
            const isResolved = notif.type === 'RESOLUTION';

            return (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.incidentId) {
                    setSelectedIncidentId(notif.incidentId);
                    setCurrentScreen('STUDENT_TRACKING');
                  }
                }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md flex items-start gap-4 ${
                  notif.read
                    ? 'bg-white border-slate-200 opacity-90'
                    : 'bg-white border-brand-300 ring-1 ring-brand-100'
                }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isCritical 
                    ? 'bg-rose-100 text-rose-600' 
                    : isResolved 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-brand-50 text-brand-600'
                }`}>
                  {isCritical ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : isResolved ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Bell className="w-5 h-5" />
                  )}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-900 truncate">
                      {notif.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 shrink-0 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{notif.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold text-brand-600">
                    <span className="flex items-center gap-1">
                      <span>View Status</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    {!notif.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

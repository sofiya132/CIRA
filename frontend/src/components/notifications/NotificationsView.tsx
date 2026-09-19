import React from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { 
  Bell, 
  CheckCheck, 
  ShieldAlert, 
  GitMerge, 
  Radio, 
  Phone, 
  CheckCircle2, 
  AlertTriangle,
  Smartphone
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, clearAllNotifications, setSelectedIncidentId, setCurrentScreen } = useCampusPulse();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'CRITICAL': return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'FUSION': return <GitMerge className="w-4 h-4 text-brand-600" />;
      case 'DISPATCH': return <Radio className="w-4 h-4 text-indigo-600" />;
      case 'ESCALATION': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'RESOLUTION': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default: return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Operational Dispatch Feed
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit log of all Amazon SNS SMS, mobile push alerts, and automated dispatch communications.
          </p>
        </div>

        <button
          onClick={clearAllNotifications}
          className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1.5 cursor-pointer"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700">No notifications logged.</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.incidentId) {
                  setSelectedIncidentId(notif.incidentId);
                  setCurrentScreen('COMMAND');
                }
              }}
              className={`p-4 transition-colors cursor-pointer flex items-start gap-3.5 ${
                notif.read ? 'bg-white hover:bg-slate-50/70' : 'bg-brand-50/30 hover:bg-brand-50/60'
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-100 shrink-0">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{notif.title}</h4>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded font-semibold text-slate-600">
                    Channel: {notif.channel}
                  </span>
                  {notif.incidentId && (
                    <span className="text-brand-700 font-semibold hover:underline">
                      View Linked Incident &rarr;
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

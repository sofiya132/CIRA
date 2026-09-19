import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Radio, 
  Bell, 
  Award, 
  Star,
  Activity
} from 'lucide-react';

export const ChiefProfile: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in relative z-10">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/70 shadow-lg flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-900 text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0">
          MV
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-900">Dr. Marcus Vance</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              Duty Operations Chief
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Officer ID: <span className="font-mono text-slate-900 font-bold">CHIEF-INCIDENT-COMMAND-01</span> &bull; Executive Operations Authority
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Shift: Executive Incident Duty (Active 24/7)</span>
            </span>
            <span className="flex items-center gap-1.5 font-bold text-purple-700">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Campus Emergency Executive Command</span>
            </span>
          </div>
        </div>
      </div>

      {/* Executive Command Powers */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/70 shadow-sm space-y-3">
        <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-purple-600" />
          <span>Executive Command Powers</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
            <span className="font-bold text-slate-900 block">SLA Timeout Escalation Intervention</span>
            <span className="text-[11px] text-slate-500">Directly override and reallocate tactical response units</span>
          </div>
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
            <span className="font-bold text-slate-900 block">Campus Perimeter Lockdown & Broadcast</span>
            <span className="text-[11px] text-slate-500">Authorize mass campus push notifications and police cordon</span>
          </div>
        </div>
      </div>
    </div>
  );
};

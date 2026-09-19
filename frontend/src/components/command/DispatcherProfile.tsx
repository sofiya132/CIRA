import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Clock, 
  Radio, 
  Bell, 
  UserCheck, 
  Activity,
  Layers
} from 'lucide-react';

export const DispatcherProfile: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in relative z-10">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/70 shadow-lg flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-brand-700 text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0">
          DP
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-900">Dispatcher Console Lead</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Station Lead #04
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Operator ID: <span className="font-mono text-slate-900 font-bold">DISP-OPERATOR-104</span> &bull; Campus Safety Operations Center
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Shift: Day Operations (07:00 – 19:00)</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Full Incident Dispatch Authority</span>
            </span>
          </div>
        </div>
      </div>

      {/* Operational Capabilities */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/70 shadow-sm space-y-3">
        <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Dispatch & Triage Permissions</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
            <span className="font-bold text-slate-900 block">Incident Fusion Review</span>
            <span className="text-[11px] text-slate-500">Authorized to inspect multi-report signal convergence</span>
          </div>
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
            <span className="font-bold text-slate-900 block">Responder Fleet Allocation</span>
            <span className="text-[11px] text-slate-500">Direct unit assignment and radio paging</span>
          </div>
        </div>
      </div>
    </div>
  );
};

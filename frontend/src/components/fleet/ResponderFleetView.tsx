import React from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { 
  Users, 
  Radio, 
  Phone, 
  MapPin, 
  Activity, 
  CheckCircle2, 
  ShieldCheck, 
  Award,
  Zap
} from 'lucide-react';

export const ResponderFleetView: React.FC = () => {
  const { responders } = useCampusPulse();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Responder Fleet Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active campus medical response, police patrol, and facility engineering units on duty.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            4 Units On-Duty Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {responders.map(resp => (
          <div key={resp.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {resp.role}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{resp.name}</h3>
                <span className="text-xs font-mono font-bold text-brand-700">{resp.unitCode}</span>
              </div>

              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 ${
                resp.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${resp.status === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {resp.status}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{resp.currentLocation}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <Radio className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{resp.radioChannel}</span>
              </div>
            </div>

            {/* Certifications and Skills */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Verified Certifications:
              </span>
              <div className="flex flex-wrap gap-1">
                {resp.skills.map((skill, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Unit Status & Workload Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Active Run: {resp.activeIncidentCount} incidents</span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-mono font-bold rounded-lg text-[10px]">
                Radio: {resp.radioChannel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

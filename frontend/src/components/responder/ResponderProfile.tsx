import React from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { 
  Radio, 
  ShieldCheck, 
  Award, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Phone, 
  LogOut,
  Bell,
  Activity
} from 'lucide-react';

export const ResponderProfile: React.FC = () => {
  const { responders } = useCampusPulse();
  const currentUnit = responders[0]; // Arjun Kumar (MED-UNIT-2)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in relative z-10">
      {/* Profile Header */}
      <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/70 shadow-lg flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0">
          AK
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-900">{currentUnit.name}</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Active Field Unit
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Unit Code: <span className="font-mono text-slate-900 font-bold">{currentUnit.unitCode}</span> &bull; {currentUnit.role}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <Radio className="w-4 h-4" />
              <span>Channel: {currentUnit.radioChannel}</span>
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{currentUnit.currentLocation}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Certifications & Skills */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/70 shadow-sm space-y-3">
        <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Verified Field Certifications</span>
        </h2>

        <div className="flex flex-wrap gap-2">
          {currentUnit.skills.map((skill, idx) => (
            <span key={idx} className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
              ✓ {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Operational Dispatch Settings */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/70 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-600" />
          <span>Dispatch & Alert Settings</span>
        </h2>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div>
              <span className="font-bold text-slate-900 block">High-Priority Paging Chime</span>
              <span className="text-[11px] text-slate-500">Audio chime when assigned a critical emergency incident</span>
            </div>
            <span className="text-xs font-bold text-emerald-700">Enabled</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div>
              <span className="font-bold text-slate-900 block">Real-time GPS Tracking</span>
              <span className="text-[11px] text-slate-500">Broadcast location coordinates to Command Center map</span>
            </div>
            <span className="text-xs font-bold text-emerald-700">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

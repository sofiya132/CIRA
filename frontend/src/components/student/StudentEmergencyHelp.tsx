import React from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { 
  PhoneCall, 
  ShieldAlert, 
  HeartPulse, 
  Flame, 
  Shield, 
  Phone, 
  Info,
  Send,
  LifeBuoy
} from 'lucide-react';

export const StudentEmergencyHelp: React.FC = () => {
  const { setCurrentScreen, emergencyHotlines, openEmergencyCall } = useCampusPulse();

  const getHotlineIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6 text-rose-600" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-orange-600" />;
      case 'Shield':
        return <Shield className="w-6 h-6 text-indigo-600" />;
      default:
        return <Phone className="w-6 h-6 text-brand-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in relative z-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950/90 via-slate-900/95 to-slate-950/90 backdrop-blur-lg p-6 sm:p-8 rounded-3xl text-white shadow-2xl border border-rose-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-extrabold border border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>🚨 EMERGENCY HELP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Immediate Emergency Assistance
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            For active life safety, medical collapse, fires, or physical threats. Initiating an emergency call connects directly to campus emergency operations and dispatches the nearest response team.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <button
            onClick={() => setCurrentScreen('STUDENT_REPORT')}
            className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-2xl shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-rose-400/40"
          >
            <Send className="w-4 h-4" />
            <span>Report Non-Urgent Incident</span>
          </button>
        </div>
      </div>

      {/* Emergency Action Buttons (No Phone Numbers Exposed!) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Emergency Services</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Direct dispatch activation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyHotlines.map((contact) => (
            <div
              key={contact.id}
              className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                  {getHotlineIcon(contact.iconName)}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {contact.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {contact.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Button: CALL {SERVICE_NAME} */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">
                  {contact.badge}
                </span>

                <button
                  onClick={() => openEmergencyCall(contact)}
                  className="px-5 py-3 rounded-2xl text-xs font-black shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer bg-rose-600 hover:bg-rose-500 text-white border border-rose-500/40"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>CALL {contact.serviceName.toUpperCase()}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Guidelines */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/70 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-brand-600" />
          <h2 className="text-sm font-extrabold text-slate-900">
            Emergency Guidelines
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">1. Medical Collapse</span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Do not move an unconscious person unless immediate danger exists. Press CALL MEDICAL RESPONSE for immediate paramedic dispatch.
            </p>
          </div>

          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">2. Fire Alarm / Smoke</span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Evacuate immediately via designated stairwells. Do not use elevators. Press CALL FIRE RESPONSE to alert the operations desk.
            </p>
          </div>

          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">3. Safety Threat</span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Silence devices and seek safe shelter. Press CALL CAMPUS SECURITY or submit a report to alert officers with coordinates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

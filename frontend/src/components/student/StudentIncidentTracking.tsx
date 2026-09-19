import React from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  HeartPulse, 
  Activity, 
  PhoneCall,
  Shield,
  Flame,
  Wrench,
  Package,
  AlertTriangle
} from 'lucide-react';

export const StudentIncidentTracking: React.FC = () => {
  const { selectedIncident, setCurrentScreen } = useCampusPulse();

  const inc = selectedIncident || {
    title: 'Medical Emergency',
    category: 'MEDICAL',
    incidentNumber: 'CP-1042',
    location: 'Basketball Court',
    priority: 'CRITICAL',
    status: 'EN_ROUTE',
    summary: 'Medical response unit dispatched to Basketball Court.',
    createdAt: new Date().toISOString()
  };

  const isResolved = inc.status === 'RESOLVED';
  const isOnScene = inc.status === 'ON_SCENE' || isResolved;
  const isEnRoute = inc.status === 'EN_ROUTE' || isOnScene;
  const isAcknowledged = inc.status === 'ACKNOWLEDGED' || isEnRoute;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'MEDICAL': return <HeartPulse className="w-6 h-6 text-rose-600" />;
      case 'FIRE': return <Flame className="w-6 h-6 text-orange-600" />;
      case 'VIOLENCE': return <Shield className="w-6 h-6 text-indigo-600" />;
      default: return <AlertTriangle className="w-6 h-6 text-amber-600" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in relative z-10">
      {/* Back Button */}
      <button
        onClick={() => setCurrentScreen('STUDENT_MY_REPORTS')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer bg-white/90 px-3 py-1.5 rounded-xl border border-white/70 shadow-2xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Reports</span>
      </button>

      {/* Incident Status Card */}
      <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/70 shadow-lg space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                Incident Status
              </span>
              <span className="font-mono text-xs text-slate-400 font-bold">
                #{inc.incidentNumber}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              {getCategoryIcon(inc.category)}
              <span>{inc.title}</span>
            </h1>
          </div>

          <div className="text-right">
            <span className={`text-xs font-extrabold px-3.5 py-1.5 rounded-xl border ${
              isResolved 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-brand-50 text-brand-700 border-brand-200'
            }`}>
              {isResolved ? 'Incident Resolved' : isOnScene ? 'Responder On Scene' : isEnRoute ? 'Responder En Route' : 'Response Team Assigned'}
            </span>
            {isResolved && inc.resolvedAt && (
              <p className="text-[10px] text-slate-400 font-mono mt-1">
                Resolved: {new Date(inc.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>

        {/* Location & Safe Response Team Designation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location</span>
            <p className="font-extrabold text-slate-800 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>{inc.location}</span>
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Response Team</span>
            <p className="font-extrabold text-slate-800 mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{inc.category === 'MEDICAL' ? 'Medical Response Team' : inc.category === 'FIRE' ? 'Fire & Safety Unit' : 'Campus Safety Team'} assigned</span>
            </p>
          </div>
        </div>

        {/* Student-Safe Live Timeline */}
        <div className="pt-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-5">
            Timeline
          </h2>

          <div className="space-y-4 relative pl-7 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
            {/* 1. Report Submitted */}
            <div className="relative">
              <span className="absolute -left-7 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
              <div>
                <span className="font-bold text-slate-900">Report submitted</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Your report was logged into CampusPulse dispatch.</p>
              </div>
            </div>

            {/* 2. Incident Created */}
            <div className="relative">
              <span className="absolute -left-7 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
              <div>
                <span className="font-bold text-slate-900">Incident created</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Incident coordinates registered with campus emergency operations.</p>
              </div>
            </div>

            {/* 3. Response Team Assigned */}
            <div className="relative">
              <span className="absolute -left-7 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
              <div>
                <span className="font-bold text-slate-900">Response team assigned</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Assigned nearest unit for fastest arrival.</p>
              </div>
            </div>

            {/* 4. Response Team Acknowledged */}
            <div className="relative">
              <span className={`absolute -left-7 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isAcknowledged ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                {isAcknowledged ? '✓' : '○'}
              </span>
              <div>
                <span className={`font-bold ${isAcknowledged ? 'text-slate-900' : 'text-slate-400'}`}>Response team acknowledged</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Field unit confirmed emergency dispatch.</p>
              </div>
            </div>

            {/* 5. Responder En Route */}
            <div className="relative">
              <span className={`absolute -left-7 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isEnRoute ? (isOnScene ? 'bg-emerald-500 text-white' : 'bg-brand-600 text-white animate-pulse') : 'bg-slate-200 text-slate-400'
              }`}>
                {isOnScene ? '✓' : isEnRoute ? '●' : '○'}
              </span>
              <div>
                <span className={`font-bold ${isEnRoute ? 'text-brand-700' : 'text-slate-400'}`}>Responder en route</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Field unit is traveling to the location.</p>
              </div>
            </div>

            {/* 6. On Scene */}
            <div className={`relative ${isOnScene ? '' : 'opacity-60'}`}>
              <span className={`absolute -left-7 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isOnScene ? (isResolved ? 'bg-emerald-500 text-white' : 'bg-brand-600 text-white animate-pulse') : 'bg-slate-200 text-slate-400'
              }`}>
                {isResolved ? '✓' : isOnScene ? '●' : '○'}
              </span>
              <div>
                <span className={`font-bold ${isOnScene ? 'text-slate-900' : 'text-slate-500'}`}>On scene</span>
                <p className="text-[11px] text-slate-400 mt-0.5">First responder arrived and established perimeter assistance.</p>
              </div>
            </div>

            {/* 7. Resolved */}
            <div className={`relative ${isResolved ? '' : 'opacity-40'}`}>
              <span className={`absolute -left-7 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isResolved ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                {isResolved ? '✓' : '○'}
              </span>
              <div>
                <span className={`font-bold ${isResolved ? 'text-emerald-700' : 'text-slate-500'}`}>Resolved</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isResolved ? `Incident resolved and verified safe${inc.resolvedAt ? ` at ${new Date(inc.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}.` : 'Emergency addressed and archived.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Direct Action */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/80 p-4 rounded-2xl">
          <div>
            <p className="font-bold text-slate-800">Need immediate assistance right now?</p>
            <p className="text-[11px] text-slate-500">Trigger immediate emergency assistance.</p>
          </div>
          <button
            onClick={() => setCurrentScreen('STUDENT_HELP')}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency Help</span>
          </button>
        </div>
      </div>
    </div>
  );
};

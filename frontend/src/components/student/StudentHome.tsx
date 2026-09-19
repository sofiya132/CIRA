import React, { useState } from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { 
  Send, 
  FileText, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  HeartPulse, 
  Flame, 
  Shield, 
  Sparkles,
  PhoneCall,
  Clock,
  Radio,
  AlertTriangle,
  User,
  ShieldAlert,
  LifeBuoy
} from 'lucide-react';
import { StudentAuthModal } from './StudentAuthModal';

export const StudentHome: React.FC = () => {
  const { 
    setCurrentScreen, 
    reports, 
    setSelectedIncidentId, 
    incidents, 
    studentProfile, 
    openEmergencyCall, 
    emergencyHotlines 
  } = useCampusPulse();

  const [showAuthModal, setShowAuthModal] = useState(false);

  // Student active reports (ONLY display reports/incidents submitted by currently logged-in student)
  const studentReports = reports.filter(r => 
    r.submitterId === studentProfile.studentId || 
    r.submitterName === studentProfile.name
  );

  const handleReportClick = () => {
    if (!studentProfile.isLoggedIn) {
      setShowAuthModal(true);
    } else {
      setCurrentScreen('STUDENT_REPORT');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in relative z-10">
      {/* Student Profile Quick Banner */}
      <div className="bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border border-white/70 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-700 text-white flex items-center justify-center text-sm font-black shadow-sm">
            {studentProfile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-900">{studentProfile.name}</span>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {studentProfile.studentId}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {studentProfile.department} &bull; {studentProfile.year}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Switch Profile
          </button>

          <button
            onClick={() => setCurrentScreen('STUDENT_PROFILE')}
            className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-colors cursor-pointer border border-brand-200"
          >
            My Profile
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-950/90 via-slate-900/95 to-slate-950/90 backdrop-blur-lg text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-indigo-500/30 relative overflow-hidden space-y-4">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold text-brand-200 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>Campus Community Safety Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            See something? Tell CampusPulse.
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            Report an incident or request emergency assistance. CampusPulse connects reports and coordinates the right response.
          </p>

          {/* Two Prominent Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleReportClick}
              className="px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-black shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-brand-400/40"
            >
              <Send className="w-4 h-4" />
              <span>REPORT AN INCIDENT</span>
            </button>

            <button
              onClick={() => setCurrentScreen('STUDENT_HELP')}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-rose-400/40"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>EMERGENCY HELP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Hotline Quick Trigger Strip (No Numbers Exposed) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {emergencyHotlines.map((hotline) => (
          <button
            key={hotline.id}
            onClick={() => openEmergencyCall(hotline)}
            className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/70 shadow-sm hover:border-rose-400 hover:shadow-md transition-all text-left flex flex-col justify-between space-y-2 cursor-pointer group"
          >
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {hotline.badge}
              </span>
              <h3 className="text-xs font-bold text-slate-900 mt-2">
                {hotline.title}
              </h3>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-black text-rose-600 group-hover:text-rose-700">
              <span>CALL {hotline.serviceName.toUpperCase()}</span>
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>

      {/* My Active Reports Section (Only Reports Submitted by Current Student) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              My Active Reports
            </h2>
            <p className="text-xs text-slate-500">
              Only incidents and reports submitted by your account (<strong className="text-slate-700">{studentProfile.name}</strong>) are visible here.
            </p>
          </div>

          <button
            onClick={() => setCurrentScreen('STUDENT_MY_REPORTS')}
            className="text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors flex items-center gap-1 cursor-pointer bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {studentReports.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-white/70 text-center text-xs text-slate-400 shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No active reports</p>
            <p className="mt-0.5">You have not submitted any pending incident reports.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {studentReports.map((rep, idx) => {
              const linkedInc = incidents.find(i => i.id === rep.incidentId || i.reportIds.includes(rep.id));
              const statusText = linkedInc?.status === 'RESOLVED' 
                ? 'Resolved' 
                : linkedInc?.status === 'ON_SCENE' 
                  ? 'Responder On Scene' 
                  : linkedInc?.status === 'EN_ROUTE' 
                    ? 'Responder En Route' 
                    : 'Responder Assigned';

              return (
                <div
                  key={rep.id || idx}
                  onClick={() => {
                    if (linkedInc) {
                      setSelectedIncidentId(linkedInc.id);
                      setCurrentScreen('STUDENT_TRACKING');
                    }
                  }}
                  className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-white/70 shadow-sm hover:border-brand-300 hover:shadow-md transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {rep.category === 'MEDICAL' ? 'Medical Emergency' : `${rep.category} Incident`}
                      </span>
                      {rep.source === 'EMERGENCY_CALL' && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                          🚨 Emergency Call
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        #{rep.reportNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                        {linkedInc?.priority || 'CRITICAL'}
                      </span>
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                        {statusText}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium italic">
                    "{rep.text}"
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {rep.location}
                    </span>

                    <span className="text-brand-600 font-bold flex items-center gap-1">
                      <span>Track Live Status</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Student Status Progression Bar */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span className="text-emerald-700">Reported</span>
                      <span className="text-emerald-700">Assigned</span>
                      <span className="text-brand-700">Responding</span>
                      <span className={linkedInc?.status === 'RESOLVED' ? 'text-emerald-700' : 'text-slate-400'}>Resolved</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 w-1/3" />
                      <div className="bg-emerald-500 w-1/3" />
                      <div className={`w-1/3 ${linkedInc?.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-brand-600 animate-pulse'}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Student Auth Modal */}
      <StudentAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onConfirm={() => {
          setShowAuthModal(false);
          setCurrentScreen('STUDENT_REPORT');
        }}
      />
    </div>
  );
};

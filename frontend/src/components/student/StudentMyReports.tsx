import React from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { 
  FileText, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Send,
  HeartPulse,
  Flame,
  ShieldAlert,
  Zap,
  Droplets,
  Package,
  Wrench,
  HelpCircle
} from 'lucide-react';

export const StudentMyReports: React.FC = () => {
  const { reports, incidents, setSelectedIncidentId, setCurrentScreen, studentProfile } = useCampusPulse();

  const studentReports = reports.filter(r => !r.isAnonymous || r.submitterRole === 'Student');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in relative z-10">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-md p-6 rounded-3xl border border-white/70 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            My Submitted Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active response progress and live updates for reports submitted by <strong className="text-slate-800">{studentProfile.name}</strong>.
          </p>
        </div>

        <button
          onClick={() => setCurrentScreen('STUDENT_REPORT')}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>New Report</span>
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {studentReports.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-md p-12 rounded-3xl border border-white/70 text-center text-xs text-slate-400 shadow-sm">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No reports on file</h3>
            <p className="mt-0.5">You have not submitted any active incident reports yet.</p>
          </div>
        ) : (
          studentReports.map((rep, idx) => {
            const linkedInc = incidents.find(i => i.id === rep.incidentId || i.reportIds.includes(rep.id));

            return (
              <div
                key={rep.id || idx}
                onClick={() => {
                  if (linkedInc) {
                    setSelectedIncidentId(linkedInc.id);
                    setCurrentScreen('STUDENT_TRACKING');
                  }
                }}
                className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/70 shadow-sm hover:border-brand-400 hover:shadow-md transition-all cursor-pointer space-y-4"
              >
                {/* Header: Category & Tracking ID */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">
                      {rep.category === 'MEDICAL' ? 'Medical Emergency' : `${rep.category} Report`}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{rep.reportNumber}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {linkedInc?.status === 'RESOLVED' ? 'Resolved' : 'Active Response Dispatched'}
                  </span>
                </div>

                {/* Submitter Description */}
                <p className="text-xs text-slate-700 font-medium leading-relaxed italic bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  "{rep.text}"
                </p>

                {/* Location, Timestamp, and Responder Role */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{rep.location}</span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="flex items-center justify-end text-brand-600 font-bold gap-1">
                    <span>View Live Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Status Progression Workflow */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1.5">
                    <span className="text-emerald-700 flex items-center gap-1">✓ Reported</span>
                    <span className="text-emerald-700 flex items-center gap-1">✓ Responding</span>
                    <span className="text-brand-700 flex items-center gap-1 animate-pulse">● On Scene</span>
                    <span className="text-slate-400">○ Resolved</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 w-1/3" />
                    <div className="bg-emerald-500 w-1/3" />
                    <div className="bg-brand-600 w-1/6" />
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

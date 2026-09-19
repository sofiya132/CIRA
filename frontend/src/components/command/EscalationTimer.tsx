import React from 'react';
import { Incident } from '../../types';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { Timer, AlertTriangle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface EscalationTimerProps {
  incident: Incident;
}

export const EscalationTimer: React.FC<EscalationTimerProps> = ({ incident }) => {
  const { triggerManualEscalation, acknowledgeIncident } = useCampusPulse();

  const isAwaiting = incident.status === 'AWAITING_ACK';
  const isEscalated = incident.status === 'ESCALATED' || incident.isEscalated;
  const isResolved = incident.status === 'RESOLVED';

  // Format seconds as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = incident.slaSeconds > 0 
    ? Math.max(0, Math.min(100, (incident.secondsRemaining / incident.slaSeconds) * 100))
    : 0;

  return (
    <div className={`p-4 rounded-2xl border backdrop-blur-xl shadow-lg transition-all ${
      isEscalated
        ? 'bg-rose-50/80 border-rose-300'
        : isAwaiting
        ? 'bg-amber-50/80 border-amber-300'
        : 'bg-white/85 border-white/60'
    }`}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <Timer className={`w-4 h-4 ${isEscalated ? 'text-rose-600' : isAwaiting ? 'text-amber-600' : 'text-slate-500'}`} />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Response SLA & Escalation
          </h4>
        </div>
        
        {isAwaiting && (
          <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
            Awaiting Acknowledgement
          </span>
        )}
        {isEscalated && (
          <span className="text-[10px] font-mono font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
            Supervisor Escalated
          </span>
        )}
        {isResolved && (
          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
            SLA Met
          </span>
        )}
      </div>

      {/* Main Timer Display */}
      {isAwaiting && (
        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-600 font-medium">Response SLA Countdown:</span>
            <span className={`text-2xl font-mono font-bold ${incident.secondsRemaining <= 15 ? 'text-rose-600 animate-pulse' : 'text-amber-700'}`}>
              {formatTime(incident.secondsRemaining)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${
                incident.secondsRemaining <= 15 ? 'bg-rose-600' : 'bg-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            If no responder acknowledges this incident, it will be automatically escalated to the campus operations supervisor via AWS Step Functions.
          </p>

          <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-amber-100">
            <button
              onClick={() => acknowledgeIncident(incident.id)}
              className="text-xs font-bold text-brand-700 hover:text-brand-900 cursor-pointer"
            >
              Acknowledge Dispatch
            </button>
            <button
              onClick={() => triggerManualEscalation(incident.id, 'Dispatcher manual escalation override')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
            >
              Escalate Immediately &rarr;
            </button>
          </div>
        </div>
      )}

      {isEscalated && (
        <div className="mt-3 space-y-2">
          <div className="flex items-start gap-2 bg-rose-100/60 p-2.5 rounded-lg border border-rose-200 text-xs text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Supervisor Paging Active</p>
              <p className="text-[11px] mt-0.5">{incident.escalationReason || 'SLA breached without acknowledgement.'}</p>
              <p className="text-[10px] text-rose-700 font-mono mt-1">Notified: {incident.escalatedTo || 'Dr. Marcus Vance'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Visual Workflow Steps */}
      <div className="mt-3 pt-2.5 border-t border-slate-200/60">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Escalation Architecture
        </p>
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium overflow-x-auto pb-1">
          <span className="text-slate-700 font-semibold">Incident</span>
          <ArrowRight className="w-3 h-3 text-slate-300" />
          <span className="text-slate-700 font-semibold">Timer</span>
          <ArrowRight className="w-3 h-3 text-slate-300" />
          <span className="text-amber-700 font-semibold">Timeout</span>
          <ArrowRight className="w-3 h-3 text-slate-300" />
          <span className="text-rose-700 font-semibold">Supervisor</span>
          <ArrowRight className="w-3 h-3 text-slate-300" />
          <span className="text-emerald-700 font-semibold">Resolution</span>
        </div>
      </div>
    </div>
  );
};

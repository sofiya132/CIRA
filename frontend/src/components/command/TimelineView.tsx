import React from 'react';
import { Incident, TimelineEvent } from '../../types';
import { 
  Clock, 
  GitMerge, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Radio, 
  ShieldAlert,
  Zap,
  Activity
} from 'lucide-react';

interface TimelineViewProps {
  incident: Incident;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ incident }) => {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'REPORT_RECEIVED':
        return <User className="w-3.5 h-3.5 text-slate-600" />;
      case 'FUSION':
        return <GitMerge className="w-3.5 h-3.5 text-brand-600" />;
      case 'PRIORITY_ASSIGNED':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />;
      case 'DISPATCH':
        return <Radio className="w-3.5 h-3.5 text-indigo-600" />;
      case 'ACKNOWLEDGED':
        return <Activity className="w-3.5 h-3.5 text-blue-600" />;
      case 'EN_ROUTE':
      case 'ON_SCENE':
        return <Clock className="w-3.5 h-3.5 text-purple-600" />;
      case 'ESCALATED':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
      case 'RESOLVED':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getEventDotStyle = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'FUSION':
        return 'bg-brand-50 border-brand-300 ring-2 ring-brand-100';
      case 'PRIORITY_ASSIGNED':
        return 'bg-rose-50 border-rose-300 ring-2 ring-rose-100';
      case 'ESCALATED':
        return 'bg-rose-100 border-rose-500 ring-2 ring-rose-200';
      case 'RESOLVED':
        return 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-100';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white/85 backdrop-blur-xl rounded-2xl border border-white/60 p-4 shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Human-Readable Timeline
          </h4>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {incident.timeline.length} events logged
        </span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {incident.timeline.map((event, idx) => (
          <div key={event.id || idx} className="relative group">
            {/* Timeline Icon Node */}
            <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center bg-white ${getEventDotStyle(event.type)}`}>
              {getEventIcon(event.type)}
            </div>

            {/* Event Content */}
            <div className="text-xs">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-bold text-slate-900">{event.title}</span>
                <span className="font-mono text-[10px] text-slate-400 shrink-0">{event.timestamp}</span>
              </div>
              <p className="text-slate-600 mt-0.5 text-[11px] leading-relaxed">
                {event.description}
              </p>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                <span>Actor: {event.actor}</span>
                {event.isAutomated && (
                  <span className="bg-slate-100 text-slate-500 px-1 rounded text-[9px] font-medium">Automated</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

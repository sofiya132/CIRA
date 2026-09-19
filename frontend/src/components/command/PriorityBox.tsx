import React from 'react';
import { Incident } from '../../types';
import { PriorityBadge } from '../common/Badge';
import { AlertCircle, CheckCircle, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

interface PriorityBoxProps {
  incident: Incident;
}

export const PriorityBox: React.FC<PriorityBoxProps> = ({ incident }) => {
  const { priorityExplanation, priority } = incident;

  const bgStyles = {
    CRITICAL: 'bg-rose-50/80 border-rose-200/90',
    HIGH: 'bg-amber-50/80 border-amber-200/90',
    MEDIUM: 'bg-sky-50/80 border-sky-200/90',
    LOW: 'bg-white/80 border-white/60',
  }[priority] || 'bg-white/80 border-white/60';

  return (
    <div className={`p-4 rounded-2xl border ${bgStyles} backdrop-blur-xl shadow-lg transition-all`}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Why this priority?
          </h4>
        </div>
        <PriorityBadge priority={priority} size="sm" />
      </div>

      <div className="mt-2.5">
        <p className="text-xs font-bold text-slate-800">
          {priorityExplanation?.headline || 'Operational assessment determines response level.'}
        </p>

        {/* Signals List */}
        <div className="mt-2 space-y-1.5">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Evaluated Signals:
          </p>
          <ul className="space-y-1">
            {priorityExplanation?.signals?.map((signal, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>{signal}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Deterministic backend rule verification */}
        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
          <span>Standardized Protocol:</span>
          <span className="font-mono font-medium text-slate-700 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
            {priorityExplanation?.deterministicRule || 'Standard Protocol Matrix'}
          </span>
        </div>
      </div>
    </div>
  );
};

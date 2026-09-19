import React from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { Activity, Sparkles, TrendingUp, Compass, ShieldAlert, GitMerge } from 'lucide-react';

export const CampusSignals: React.FC = () => {
  const { signals } = useCampusPulse();

  return (
    <div className="bg-white/85 backdrop-blur-xl rounded-2xl border border-white/60 p-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-500" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Campus Signals
          </h4>
        </div>
        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          Quiet Telemetry
        </span>
      </div>

      <div className="mt-3 space-y-2.5">
        {signals.map(sig => (
          <div 
            key={sig.id} 
            className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors text-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-bold text-slate-800 leading-snug">{sig.headline}</span>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">{sig.timestamp}</span>
            </div>
            <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
              {sig.detail}
            </p>
            {sig.metricChange && (
              <span className="inline-block mt-1.5 text-[10px] font-semibold text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded border border-brand-100">
                {sig.metricChange}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

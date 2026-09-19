import React from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { 
  AlertCircle, 
  Clock, 
  Flame, 
  GitMerge, 
  CheckCircle2, 
  ShieldAlert,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';

export const KPIHeader: React.FC = () => {
  const { incidents, reports } = useCampusPulse();

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length;
  const awaitingAck = incidents.filter(i => i.status === 'AWAITING_ACK').length;
  const criticalCount = incidents.filter(i => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const escalations = incidents.filter(i => i.status === 'ESCALATED' || i.isEscalated).length;
  const resolvedCount = incidents.filter(i => i.status === 'RESOLVED').length + 8; // Including earlier shift resolutions
  const totalFusedReports = incidents.reduce((acc, inc) => acc + (inc.reportCount > 1 ? inc.reportCount - 1 : 0), 0) + 4;

  const kpis = [
    {
      label: 'Active Incidents',
      value: activeIncidents,
      sub: 'Campus wide',
      icon: AlertCircle,
      textColor: 'text-slate-900',
      badge: 'Live',
      badgeColor: 'bg-indigo-50 text-indigo-700'
    },
    {
      label: 'Awaiting Response',
      value: awaitingAck,
      sub: 'Response timers active',
      icon: Clock,
      textColor: awaitingAck > 0 ? 'text-amber-600 font-bold' : 'text-slate-900',
      badge: awaitingAck > 0 ? 'Urgent' : 'Clear',
      badgeColor: awaitingAck > 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
    },
    {
      label: 'Critical Priority',
      value: criticalCount,
      sub: 'Immediate action',
      icon: ShieldAlert,
      textColor: criticalCount > 0 ? 'text-rose-600 font-bold' : 'text-slate-900',
      badge: criticalCount > 0 ? 'P1' : 'None',
      badgeColor: criticalCount > 0 ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
    },
    {
      label: 'Avg Response Time',
      value: '1m 18s',
      sub: 'Target: < 3m 00s',
      icon: TrendingDown,
      textColor: 'text-emerald-700 font-semibold',
      badge: '-65% today',
      badgeColor: 'bg-emerald-50 text-emerald-700'
    },
    {
      label: 'Reports Fused',
      value: totalFusedReports,
      sub: 'Duplicate signals eliminated',
      icon: GitMerge,
      textColor: 'text-brand-700 font-semibold',
      badge: '68% Fusion',
      badgeColor: 'bg-brand-50 text-brand-700'
    },
    {
      label: 'Resolved Today',
      value: resolvedCount,
      sub: 'All shifts',
      icon: CheckCircle2,
      textColor: 'text-slate-900',
      badge: '98% SLA',
      badgeColor: 'bg-slate-100 text-slate-700'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div 
            key={idx} 
            className="bg-white/85 backdrop-blur-xl p-3.5 rounded-2xl border border-white/60 shadow-lg hover:bg-white/95 hover:border-white/90 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600 truncate">{kpi.label}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${kpi.badgeColor}`}>
                {kpi.badge}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className={`text-xl font-extrabold tracking-tight ${kpi.textColor}`}>{kpi.value}</span>
              <Icon className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-1 truncate">{kpi.sub}</p>
          </div>
        );
      })}
    </div>
  );
};

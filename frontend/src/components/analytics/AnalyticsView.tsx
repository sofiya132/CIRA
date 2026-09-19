import React from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  TrendingDown, 
  GitMerge, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  AlertCircle,
  Award
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { incidents, reports } = useCampusPulse();

  // Restrained professional color palette
  const COLORS = {
    indigo: '#4F46E5',
    cobalt: '#2563EB',
    slate: '#475569',
    amber: '#D97706',
    rose: '#DC2626',
    emerald: '#16A34A',
    sky: '#0284C7'
  };

  // 1. Hourly Incident Volume Trend
  const hourlyData = [
    { time: '04:00', reports: 1, fusedIncidents: 1 },
    { time: '06:00', reports: 2, fusedIncidents: 1 },
    { time: '08:00', reports: 7, fusedIncidents: 3 },
    { time: '10:00', reports: 9, fusedIncidents: 4 },
    { time: '12:00', reports: 14, fusedIncidents: 5 },
    { time: '14:00', reports: 12, fusedIncidents: 4 },
    { time: '16:00', reports: 8, fusedIncidents: 3 },
  ];

  // 2. Category Distribution
  const categoryData = [
    { name: 'Medical', count: 18, fill: '#DC2626' },
    { name: 'Electrical', count: 9, fill: '#D97706' },
    { name: 'Water/Plumbing', count: 12, fill: '#0284C7' },
    { name: 'Security', count: 6, fill: '#4F46E5' },
    { name: 'Lost Property', count: 15, fill: '#64748B' },
  ];

  // 3. Priority Distribution
  const priorityData = [
    { name: 'Critical', count: 6, color: '#DC2626' },
    { name: 'High', count: 11, color: '#D97706' },
    { name: 'Medium', count: 24, color: '#0284C7' },
    { name: 'Low', count: 19, color: '#64748B' },
  ];

  // 4. Response Time MTTA Trend (Minutes)
  const mttaData = [
    { day: 'Mon', target: 3.0, actual: 2.8 },
    { day: 'Tue', target: 3.0, actual: 2.4 },
    { day: 'Wed', target: 3.0, actual: 2.1 },
    { day: 'Thu', target: 3.0, actual: 1.8 },
    { day: 'Fri', target: 3.0, actual: 1.4 },
    { day: 'Sat', target: 3.0, actual: 1.3 },
    { day: 'Today', target: 3.0, actual: 1.18 },
  ];

  // 5. Campus Hotspots
  const hotspotData = [
    { zone: 'Sports Complex', incidents: 14, reports: 32 },
    { zone: 'Science Quad', incidents: 11, reports: 19 },
    { zone: 'Central Library', incidents: 8, reports: 16 },
    { zone: 'Student Union', incidents: 6, reports: 9 },
    { zone: 'North Dorms', incidents: 5, reports: 8 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Operational Analytics
            </h1>
            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
              Real-Time Metrics
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Restrained, audit-ready operational telemetry across campus emergency dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
            Timeframe: Past 7 Days
          </span>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Incident Fusion Rate</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-brand-700">68.4%</span>
            <GitMerge className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Duplicate dispatch calls prevented</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Mean Time to Acknowledge</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-700">1m 18s</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">-65% vs campus SLA target</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Mean Time to Resolve (MTTR)</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">8m 42s</span>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all high priority events</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">SLA Compliance Rate</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">98.6%</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Zero unmanaged timeouts</p>
        </div>
      </div>

      {/* Row 1: Volume Trend & MTTA Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports vs Fused Incidents */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Signal Volume: Reports vs Master Incidents
              </h3>
              <p className="text-[11px] text-slate-500">
                Shows how multiple fragmented reports condense into single operational work orders.
              </p>
            </div>
          </div>

          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="reports" stroke="#4F46E5" fill="#EEF2FF" name="Incoming Reports" />
                <Area type="monotone" dataKey="fusedIncidents" stroke="#0F172A" fill="#E2E8F0" name="Master Incidents" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Response Time Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Mean Time to Acknowledge (MTTA) Trend
              </h3>
              <p className="text-[11px] text-slate-500">
                Average responder dispatch-to-acknowledgement duration in minutes.
              </p>
            </div>
          </div>

          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mttaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} unit="m" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="actual" stroke="#16A34A" strokeWidth={2.5} name="Actual Time" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="target" stroke="#DC2626" strokeDasharray="5 5" name="SLA Ceiling (3m)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Category Distribution & Campus Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Emergency Category Distribution
            </h3>
            <p className="text-[11px] text-slate-500">Incident breakdown across campus services.</p>
          </div>

          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#334155' }} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="count" name="Incidents" radius={[0, 6, 6, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hotspot Concentration */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Geographic Concentration by Zone
            </h3>
            <p className="text-[11px] text-slate-500">Signals vs Fused Work Orders per Zone.</p>
          </div>

          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hotspotData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="zone" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="reports" fill="#C7D2FE" name="Raw Reports" radius={[4, 4, 0, 0]} />
                <Bar dataKey="incidents" fill="#4F46E5" name="Fused Incidents" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

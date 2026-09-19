import React, { useState } from 'react';
import { KPIHeader } from './KPIHeader';
import { IncidentList } from './IncidentList';
import { IncidentDetail } from './IncidentDetail';
import { CampusMap } from './CampusMap';
import { CampusSignals } from './CampusSignals';
import { LayoutDashboard, ListOrdered, Map, Activity, ShieldCheck } from 'lucide-react';

export const OperationsCommandCenter: React.FC = () => {
  const [viewMode, setViewMode] = useState<'UNIFIED' | 'QUEUE' | 'MAP' | 'SIGNALS'>('UNIFIED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10 animate-fade-in">
      {/* Page Title & Subtitle */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Operations Command Center
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time incident intelligence, multi-signal fusion, dispatcher allocation & tactical geospatial monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Operations Shift
          </span>
        </div>
      </div>

      {/* Top Compact KPI Metric Cards (Full Width) */}
      <KPIHeader />

      {/* Horizontal View Mode Switcher Tabs (Spread across full width) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
        {[
          { id: 'UNIFIED', label: 'Unified Command Deck', icon: LayoutDashboard },
          { id: 'QUEUE', label: 'Incident Queue & Triage', icon: ListOrdered },
          { id: 'MAP', label: 'Tactical Campus Grounds', icon: Map },
          { id: 'SIGNALS', label: 'Telemetry & Quiet Signals', icon: Activity },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = viewMode === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as any)}
              className={`w-full justify-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 text-center ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white/90 backdrop-blur-md text-slate-700 border border-white/70 hover:bg-white'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic View Mode Content */}
      {viewMode === 'UNIFIED' && (
        <div className="space-y-6">
          {/* Section 1: Active Incidents Queue (Full Width Horizontal Grid) */}
          <div className="w-full">
            <IncidentList variant="horizontal" />
          </div>

          {/* Section 2: Selected Incident Full Dossier & Explainability (Full Width) */}
          <div className="w-full">
            <IncidentDetail />
          </div>

          {/* Section 3: Tactical Map & Quiet Signals Side-by-Side (Full Width) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
            <div className="md:col-span-7">
              <CampusMap />
            </div>
            <div className="md:col-span-5">
              <CampusSignals />
            </div>
          </div>
        </div>
      )}

      {viewMode === 'QUEUE' && (
        <div className="w-full space-y-6">
          <IncidentList variant="horizontal" />
          <IncidentDetail />
        </div>
      )}

      {viewMode === 'MAP' && (
        <div className="w-full space-y-4">
          <CampusMap fullScreen={true} />
        </div>
      )}

      {viewMode === 'SIGNALS' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
          <div className="md:col-span-7">
            <CampusSignals />
          </div>
          <div className="md:col-span-5">
            <CampusMap />
          </div>
        </div>
      )}
    </div>
  );
};

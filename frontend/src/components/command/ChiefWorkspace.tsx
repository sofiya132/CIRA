import React, { useState } from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Timer, 
  Users, 
  Radio, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  PhoneCall, 
  MapPin, 
  Activity, 
  Star,
  Layers,
  Sparkles
} from 'lucide-react';
import { PriorityBadge, StatusBadge, CategoryIcon } from '../common/Badge';

export const ChiefWorkspace: React.FC = () => {
  const { incidents, responders, takeChiefCommand, setSelectedIncidentId, setCurrentScreen } = useCampusPulse();

  const [filter, setFilter] = useState<'EXCEPTIONS' | 'CRITICAL' | 'ESCALATED' | 'ALL'>('EXCEPTIONS');

  // Chief metrics focusing on exceptions
  const criticalIncidents = incidents.filter(i => i.priority === 'CRITICAL' && i.status !== 'RESOLVED');
  const escalatedIncidents = incidents.filter(i => (i.isEscalated || i.status === 'ESCALATED') && i.status !== 'RESOLVED');
  const emergencyCalls = incidents.filter(i => i.isEmergencyCall && i.status !== 'RESOLVED');
  const unacknowledgedIncidents = incidents.filter(i => i.status === 'AWAITING_ACK');
  
  const availableResponders = responders.filter(r => r.status === 'AVAILABLE');
  const busyResponders = responders.filter(r => r.status !== 'AVAILABLE');

  const exceptionIncidents = incidents.filter(i => 
    (i.priority === 'CRITICAL' || i.isEscalated || i.status === 'ESCALATED' || i.isEmergencyCall) && i.status !== 'RESOLVED'
  );

  const getFilteredList = () => {
    switch (filter) {
      case 'EXCEPTIONS': return exceptionIncidents;
      case 'CRITICAL': return criticalIncidents;
      case 'ESCALATED': return escalatedIncidents;
      default: return incidents.filter(i => i.status !== 'RESOLVED');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10 animate-fade-in">
      {/* Executive Command Banner */}
      <div className="bg-gradient-to-r from-purple-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur-md p-6 sm:p-7 rounded-3xl text-white shadow-xl border border-purple-500/40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 shadow-lg">
            <Star className="w-7 h-7 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">Duty Operations Chief Command</h1>
              <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                EXECUTIVE OVERSIGHT
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Campus-wide exception monitoring, Step Functions SLA oversight, and command intervention authority.
            </p>
          </div>
        </div>

        {/* Quick Chief Action */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Logged as Dr. Marcus Vance</span>
        </div>
      </div>

      {/* Exception-Focused KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/70 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Critical Emergencies</span>
          <p className="text-2xl font-black text-rose-600 mt-1">{criticalIncidents.length}</p>
          <span className="text-[10px] text-slate-500 font-semibold">{emergencyCalls.length} Emergency calls</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/70 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Escalations</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{escalatedIncidents.length}</p>
          <span className="text-[10px] text-amber-600 font-semibold">SLA breached</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/70 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Unacknowledged</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">{unacknowledgedIncidents.length}</p>
          <span className="text-[10px] text-slate-500 font-semibold">Timer ticking</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/70 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fleet Ready</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{availableResponders.length}</p>
          <span className="text-[10px] text-slate-500 font-semibold">{busyResponders.length} on active run</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/70 shadow-sm col-span-2 sm:col-span-4 lg:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Campus Status</span>
          <p className="text-sm font-black text-slate-800 mt-2">Active Surveillance</p>
          <span className="text-[10px] text-emerald-700 font-bold">● Operations nominal</span>
        </div>
      </div>

      {/* Exception Filter Tabs Grid Spread */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
        {[
          { id: 'EXCEPTIONS', label: 'Priority Exceptions', count: exceptionIncidents.length },
          { id: 'CRITICAL', label: 'Critical Incidents', count: criticalIncidents.length },
          { id: 'ESCALATED', label: 'SLA Escalations', count: escalatedIncidents.length },
          { id: 'ALL', label: 'All Active Incidents', count: incidents.filter(i => i.status !== 'RESOLVED').length },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={`w-full justify-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              filter === t.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white/90 backdrop-blur-md text-slate-700 border border-white/70 hover:bg-white'
            }`}
          >
            <span>{t.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
              filter === t.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700 font-bold'
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Chief Incident Cards with Command Intervention Buttons */}
      <div className="space-y-4">
        {getFilteredList().length === 0 ? (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-12 text-center text-xs text-slate-400 border border-white/70 shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-slate-700 text-sm">No operational exceptions</p>
            <p className="mt-0.5">All incidents are currently being handled normally within response SLAs.</p>
          </div>
        ) : (
          getFilteredList().map(inc => {
            const isEscalated = inc.isEscalated || inc.status === 'ESCALATED';

            return (
              <div
                key={inc.id}
                className={`bg-white/95 backdrop-blur-md rounded-3xl border p-6 shadow-md transition-all space-y-4 ${
                  isEscalated ? 'border-amber-400 ring-2 ring-amber-300' : inc.priority === 'CRITICAL' ? 'border-rose-300' : 'border-white/70'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <CategoryIcon category={inc.category} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono font-bold text-slate-400">#{inc.incidentNumber}</span>
                        {inc.isEmergencyCall && (
                          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-600 text-white shadow-xs">
                            🚨 EMERGENCY CALL
                          </span>
                        )}
                        <PriorityBadge priority={inc.priority} />
                        <StatusBadge status={inc.status} />
                      </div>
                      <h2 className="text-base font-black text-slate-900">{inc.title}</h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedIncidentId(inc.id);
                        setCurrentScreen('COMMAND');
                      }}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Open Dossier
                    </button>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50/90 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location</span>
                    <p className="font-extrabold text-slate-900 mt-0.5">{inc.location} ({inc.buildingZone})</p>
                  </div>
                  <div className="bg-slate-50/90 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Unit</span>
                    <p className="font-extrabold text-slate-900 mt-0.5">{inc.assignedResponder?.name || 'Unassigned'}</p>
                  </div>
                  <div className="bg-slate-50/90 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Signals Fused</span>
                    <p className="font-extrabold text-slate-900 mt-0.5">{inc.reportCount} reports {inc.isEmergencyCall ? '(incl. Emergency Call)' : ''}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {inc.fullDescription}
                </p>

                {/* Duty Chief Command Intervention Controls */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-black text-purple-900 flex items-center gap-1 mr-2">
                    <Star className="w-3.5 h-3.5 fill-purple-700 text-purple-700" />
                    <span>Chief Command Actions:</span>
                  </span>

                  <button
                    onClick={() => takeChiefCommand(inc.id, 'REASSIGN')}
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    ⭐ Reassign Senior Unit
                  </button>

                  <button
                    onClick={() => takeChiefCommand(inc.id, 'TACTICAL_DEPLOY')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Deploy Tactical Team
                  </button>

                  <button
                    onClick={() => takeChiefCommand(inc.id, 'ZONE_ALERT')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Broadcast Zone Perimeter Alert
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

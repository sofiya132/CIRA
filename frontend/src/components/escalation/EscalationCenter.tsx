import React, { useState } from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { 
  Timer, 
  AlertTriangle, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Zap, 
  Play, 
  RotateCcw,
  Clock,
  Radio,
  UserCheck,
  Building2,
  Workflow
} from 'lucide-react';

export const EscalationCenter: React.FC = () => {
  const { incidents, triggerEscalationDemo, isDemoRunning, acknowledgeIncident, reassignResponder, triggerManualEscalation } = useCampusPulse();

  const escalatedIncidents = incidents.filter(i => i.status === 'ESCALATED' || i.isEscalated);
  const awaitingAckIncidents = incidents.filter(i => i.status === 'AWAITING_ACK');
  const acknowledgedIncidents = incidents.filter(i => i.status === 'ACKNOWLEDGED' || i.status === 'EN_ROUTE' || i.status === 'ON_SCENE');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Escalation & SLA Center
            </h1>
            <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
              AWS Step Functions Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Deterministic timeout monitors protecting campus life safety. Automatic supervisor escalation when responders don't acknowledge.
          </p>
        </div>

        <button
          onClick={() => triggerEscalationDemo()}
          disabled={isDemoRunning}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Simulate SLA Timeout & Escalation</span>
        </button>
      </div>

      {/* STATE MACHINE WORKFLOW DIAGRAM */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Workflow className="w-4 h-4 text-brand-600" />
          <span>Automated Escalation State Machine Workflow</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <span className="text-[10px] font-mono text-slate-400 block mb-1">STATE 1</span>
            <span className="font-bold text-slate-900 block">Incident Ingestion</span>
            <p className="text-[10px] text-slate-500 mt-1">Report verified & priority assigned</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <span className="text-[10px] font-mono text-slate-400 block mb-1">STATE 2</span>
            <span className="font-bold text-slate-900 block">Unit Dispatched</span>
            <p className="text-[10px] text-slate-500 mt-1">Mobile push & radio channel alert</p>
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs">
            <span className="text-[10px] font-mono text-amber-700 font-bold block mb-1">STATE 3</span>
            <span className="font-bold text-amber-900 block">Response Timer</span>
            <p className="text-[10px] text-amber-700 mt-1">45s–120s countdown active</p>
          </div>

          <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs">
            <span className="text-[10px] font-mono text-rose-700 font-bold block mb-1">STATE 4</span>
            <span className="font-bold text-rose-900 block">SLA Timeout</span>
            <p className="text-[10px] text-rose-700 mt-1">Breach detected without ack</p>
          </div>

          <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-xs">
            <span className="text-[10px] font-mono text-purple-700 font-bold block mb-1">STATE 5</span>
            <span className="font-bold text-purple-900 block">Supervisor Paging</span>
            <p className="text-[10px] text-purple-700 mt-1">Duty Officer notified via SMS/Radio</p>
          </div>

          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs">
            <span className="text-[10px] font-mono text-emerald-700 font-bold block mb-1">STATE 6</span>
            <span className="font-bold text-emerald-900 block">Resolved</span>
            <p className="text-[10px] text-emerald-700 mt-1">Hazard cleared and closed</p>
          </div>
        </div>
      </div>

      {/* ACTIVE ESCALATIONS QUEUE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Escalated Incidents */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">Active Supervisor Escalations</h3>
            </div>
            <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
              {escalatedIncidents.length} Breached
            </span>
          </div>

          {escalatedIncidents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
              <p className="font-bold text-slate-700">Zero active SLA breaches</p>
              <p className="mt-0.5">All incidents have been acknowledged within response limits.</p>
            </div>
          ) : (
            escalatedIncidents.map(inc => (
              <div key={inc.id} className="p-4 rounded-xl border-2 border-rose-300 bg-rose-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={inc.priority} size="sm" />
                    <span className="font-mono font-bold text-xs text-slate-800">#{inc.incidentNumber}</span>
                  </div>
                  <span className="text-[11px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                    SUPERVISOR PAGED
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900">{inc.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">{inc.location}</p>
                  <p className="text-xs text-rose-900 font-semibold mt-1">
                    Reason: {inc.escalationReason || 'SLA response limit expired without responder acknowledgement.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-rose-200/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">Notified: {inc.escalatedTo || 'Duty Operations Chief'}</span>
                  <button
                    onClick={() => acknowledgeIncident(inc.id)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Supervisor Override & Acknowledge
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Awaiting Acknowledgement (Active Timers) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Awaiting Response (Timer Active)</h3>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              {awaitingAckIncidents.length} Pending
            </span>
          </div>

          {awaitingAckIncidents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
              <p className="font-bold text-slate-700">All dispatches acknowledged</p>
              <p className="mt-0.5">No active countdown timers running.</p>
            </div>
          ) : (
            awaitingAckIncidents.map(inc => (
              <div key={inc.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={inc.priority} size="sm" />
                    <span className="font-mono font-bold text-xs text-slate-800">#{inc.incidentNumber}</span>
                  </div>
                  <span className="font-mono font-extrabold text-sm text-amber-700">
                    {inc.secondsRemaining}s remaining
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900">{inc.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">{inc.location}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Assigned: {inc.assignedResponder?.name} ({inc.assignedResponder?.role})
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-100 flex items-center justify-between">
                  <button
                    onClick={() => triggerManualEscalation(inc.id, 'Manual command override')}
                    className="text-xs text-rose-600 font-semibold hover:text-rose-800 cursor-pointer"
                  >
                    Escalate Now &rarr;
                  </button>
                  <button
                    onClick={() => acknowledgeIncident(inc.id)}
                    className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Acknowledge Dispatch
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { Incident } from '../../types';
import { PriorityBadge, StatusBadge, CategoryIcon } from '../common/Badge';
import { 
  Radio, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Navigation2, 
  ShieldAlert, 
  AlertTriangle, 
  Phone, 
  UserCheck,
  ChevronRight,
  GitMerge,
  FileText,
  HeartPulse,
  Flame,
  Shield,
  Zap
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const ResponderWorkspace: React.FC = () => {
  const { incidents, acknowledgeIncident, markEnRoute, markOnScene, resolveIncident } = useCampusPulse();
  const [activeTab, setActiveTab] = useState<'IMMEDIATE' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED'>('IMMEDIATE');
  const [resolveModalInc, setResolveModalInc] = useState<Incident | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Responder units filter (showing incidents assigned to field responder)
  const immediateIncidents = incidents.filter(i => (i.status === 'AWAITING_ACK' || i.status === 'ESCALATED'));
  const assignedIncidents = incidents.filter(i => i.status === 'ACKNOWLEDGED');
  const inProgressIncidents = incidents.filter(i => i.status === 'EN_ROUTE' || i.status === 'ON_SCENE');
  const resolvedIncidents = incidents.filter(i => i.status === 'RESOLVED');

  const getActiveList = () => {
    switch (activeTab) {
      case 'IMMEDIATE': return immediateIncidents;
      case 'ASSIGNED': return assignedIncidents;
      case 'IN_PROGRESS': return inProgressIncidents;
      case 'RESOLVED': return resolvedIncidents;
      default: return immediateIncidents;
    }
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resolveModalInc) {
      resolveIncident(resolveModalInc.id, resolutionNotes || 'On-scene responder verified hazard cleared.');
      setResolveModalInc(null);
      setResolutionNotes('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 relative z-10 animate-fade-in">
      {/* Top Banner: Responder Unit Status */}
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Radio className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight">Responder Field Tablet</h1>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                ACTIVE ON DUTY
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Unit: <span className="font-extrabold text-white">MED-UNIT-2 (Arjun Kumar)</span> &bull; Campus Medical Response &bull; Radio: <span className="font-mono text-emerald-400 font-bold">MED-CH-1</span>
            </p>
          </div>
        </div>

        {/* Quick telemetry badges */}
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-slate-800/90 px-3.5 py-2 rounded-2xl border border-slate-700">
            <span className="text-slate-400 block text-[10px] font-bold">Awaiting Action</span>
            <span className="text-base font-black text-rose-400">{immediateIncidents.length}</span>
          </div>
          <div className="bg-slate-800/90 px-3.5 py-2 rounded-2xl border border-slate-700">
            <span className="text-slate-400 block text-[10px] font-bold">Active In-Progress</span>
            <span className="text-base font-black text-indigo-400">{inProgressIncidents.length}</span>
          </div>
        </div>
      </div>

      {/* Large Tactile Filter Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { id: 'IMMEDIATE', label: '1. Awaiting Response', count: immediateIncidents.length, color: 'text-rose-700 bg-rose-50 border-rose-200' },
          { id: 'ASSIGNED', label: '2. Acknowledged', count: assignedIncidents.length, color: 'text-blue-700 bg-blue-50 border-blue-200' },
          { id: 'IN_PROGRESS', label: '3. En Route / On Scene', count: inProgressIncidents.length, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
          { id: 'RESOLVED', label: '4. Resolved Today', count: resolvedIncidents.length, color: 'text-slate-700 bg-slate-100 border-slate-200' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`p-4 rounded-2xl border font-black text-xs flex items-center justify-between transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-lg border-slate-900 scale-102'
                : 'bg-white/90 backdrop-blur-md text-slate-700 border-white/70 hover:border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
              activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-800'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Responder Incidents Feed */}
      <div className="space-y-4">
        {getActiveList().length === 0 ? (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-12 text-center text-xs text-slate-400 border border-white/70 shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-extrabold text-slate-700 text-sm">No incidents in this queue</p>
            <p className="mt-0.5">You are currently clear and available for priority dispatch.</p>
          </div>
        ) : (
          getActiveList().map(inc => {
            const isAwaitingAck = inc.status === 'AWAITING_ACK' || inc.status === 'ESCALATED';
            const isAck = inc.status === 'ACKNOWLEDGED';
            const isEnRoute = inc.status === 'EN_ROUTE';
            const isOnScene = inc.status === 'ON_SCENE';

            return (
              <div 
                key={inc.id}
                className={`bg-white/95 backdrop-blur-md rounded-3xl border p-6 shadow-md transition-all space-y-4 ${
                  inc.priority === 'CRITICAL' ? 'border-rose-300 ring-1 ring-rose-200' : 'border-white/70'
                }`}
              >
                {/* Header: Title, Emergency Call Badge, Priority */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <CategoryIcon category={inc.category} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono font-bold text-slate-400">#{inc.incidentNumber}</span>
                        {inc.isEmergencyCall && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-600 text-white shadow-xs animate-pulse">
                            <Phone className="w-3 h-3" />
                            <span>🚨 EMERGENCY CALL</span>
                          </span>
                        )}
                        <PriorityBadge priority={inc.priority} />
                        <StatusBadge status={inc.status} />
                      </div>
                      <h2 className="text-base font-black text-slate-900">{inc.title}</h2>
                    </div>
                  </div>

                  {/* SLA Timer Indicator if Awaiting Ack */}
                  {isAwaitingAck && inc.secondsRemaining > 0 && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-900 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-pulse">
                      <Clock className="w-3.5 h-3.5 text-rose-600" />
                      <span>SLA: {inc.secondsRemaining}s remaining</span>
                    </div>
                  )}
                </div>

                {/* Location & Emergency Purpose Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Incident Location</span>
                    <p className="font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                      <span>{inc.location} ({inc.buildingZone})</span>
                    </p>
                  </div>

                  <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {inc.isEmergencyCall ? 'Emergency Call Purpose' : 'Incident Summary'}
                    </span>
                    <p className="font-extrabold text-slate-900 mt-1 truncate">
                      {inc.emergencyPurpose ? `Purpose: ${inc.emergencyPurpose}` : inc.summary}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50/60 p-3 rounded-2xl border border-slate-100">
                  {inc.fullDescription}
                </p>

                {/* Lifecycle Action Buttons: ACKNOWLEDGE → EN ROUTE → ON SCENE → RESOLVE */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {isAwaitingAck && (
                    <button
                      onClick={() => acknowledgeIncident(inc.id)}
                      className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-xs font-black shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ACKNOWLEDGE INCIDENT</span>
                    </button>
                  )}

                  {isAck && (
                    <button
                      onClick={() => markEnRoute(inc.id)}
                      className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Navigation2 className="w-4 h-4" />
                      <span>MARK EN ROUTE</span>
                    </button>
                  )}

                  {isEnRoute && (
                    <button
                      onClick={() => markOnScene(inc.id)}
                      className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>MARK ON SCENE</span>
                    </button>
                  )}

                  {isOnScene && (
                    <button
                      onClick={() => setResolveModalInc(inc)}
                      className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>RESOLVE INCIDENT</span>
                    </button>
                  )}

                  {inc.status === 'RESOLVED' && (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Incident Triaged and Resolved</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resolve Incident Confirmation Modal */}
      <Modal
        isOpen={!!resolveModalInc}
        onClose={() => setResolveModalInc(null)}
        title="Resolve & Archive Incident"
      >
        {resolveModalInc && (
          <form onSubmit={handleResolveSubmit} className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="font-mono text-[10px] text-slate-400 font-bold block">#{resolveModalInc.incidentNumber}</span>
              <p className="font-bold text-slate-900 mt-0.5">{resolveModalInc.title} at {resolveModalInc.location}</p>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                Resolution Action Notes
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Patient evaluated and transferred to clinic. Scene cleared safe."
                value={resolutionNotes}
                onChange={e => setResolutionNotes(e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-xs"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setResolveModalInc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition-all cursor-pointer"
              >
                Confirm Resolution
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

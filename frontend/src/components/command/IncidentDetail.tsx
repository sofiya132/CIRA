import React from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { PriorityBadge, StatusBadge, CategoryIcon } from '../common/Badge';
import { FusionVisualizer } from './FusionVisualizer';
import { PriorityBox } from './PriorityBox';
import { ResponderDispatcher } from './ResponderDispatcher';
import { TimelineView } from './TimelineView';
import { EscalationTimer } from './EscalationTimer';
import { 
  MapPin, 
  Clock, 
  GitMerge, 
  ShieldAlert, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2,
  FileText,
  User,
  Share2,
  AlertCircle
} from 'lucide-react';

export const IncidentDetail: React.FC = () => {
  const { selectedIncident } = useCampusPulse();

  if (!selectedIncident) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-bold text-slate-700">No Incident Selected</p>
        <p className="text-xs text-slate-400 mt-1">Select an incident from the feed to inspect operational details.</p>
      </div>
    );
  }

  const inc = selectedIncident;

  return (
    <div className="space-y-4">
      {/* Top Banner: Master Header */}
      <div className="bg-white/85 backdrop-blur-2xl rounded-2xl border border-white/60 p-5 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-white/40">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-slate-500">
                INCIDENT #{inc.incidentNumber}
              </span>
              {inc.isEmergencyCall && (
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-600 text-white shadow-xs animate-pulse">
                  🚨 EMERGENCY CALL
                </span>
              )}
              <PriorityBadge priority={inc.priority} size="md" />
              <StatusBadge status={inc.status} />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <CategoryIcon category={inc.category} className="w-5 h-5" />
              <span>{inc.title}</span>
            </h1>
            {inc.isEmergencyCall && inc.emergencyPurpose && (
              <div className="mt-1 text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 inline-block">
                Emergency Purpose: {inc.emergencyPurpose}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-lg border border-white/60 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Created {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* The 6 Core Operational Answers Grid */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 bg-white/70 backdrop-blur-md p-3 rounded-xl border border-white/60 text-xs shadow-2xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">1. WHAT Happened</span>
            <p className="font-bold text-slate-900 mt-0.5 truncate">{inc.title}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">2. WHERE</span>
            <p className="font-bold text-slate-900 mt-0.5 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-brand-600 shrink-0" />
              <span>{inc.location}</span>
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">3. HOW IMPORTANT</span>
            <p className="font-bold text-slate-900 mt-0.5">
              <span className={`inline-block px-1.5 py-0.2 rounded text-[11px] font-bold ${
                inc.priority === 'CRITICAL' ? 'text-rose-700 bg-rose-50' : 'text-amber-700 bg-amber-50'
              }`}>
                {inc.priority} Priority
              </span>
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">4. WHO is Handling</span>
            <p className="font-bold text-slate-900 mt-0.5 truncate">
              {inc.assignedResponder?.name || 'Assigned Unit'}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">5. STATUS</span>
            <p className="font-bold text-slate-900 mt-0.5 truncate">
              {inc.status.replace('_', ' ')}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">6. NEXT ACTION</span>
            <p className="font-bold text-brand-700 mt-0.5 truncate">
              {inc.status === 'AWAITING_ACK' ? 'Acknowledge dispatch' : inc.status === 'ACKNOWLEDGED' ? 'Travel to scene' : 'On-scene triage'}
            </p>
          </div>
        </div>

        {/* Detailed Full Description */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-700 leading-relaxed">
            {inc.fullDescription}
          </p>
        </div>
      </div>

      {/* SIGNATURE SECTION: Incident Fusion Visualizer */}
      <FusionVisualizer incident={inc} />

      {/* Two Column Section: Priority Explanation & Escalation Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PriorityBox incident={inc} />
        <EscalationTimer incident={inc} />
      </div>

      {/* Two Column Section: Responder Dispatch & Incident Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResponderDispatcher incident={inc} />
        <TimelineView incident={inc} />
      </div>
    </div>
  );
};

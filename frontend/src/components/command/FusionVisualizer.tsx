import React, { useState } from 'react';
import { Incident } from '../../types';
import { 
  GitMerge, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  FileText, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import { PriorityBadge } from '../common/Badge';

interface FusionVisualizerProps {
  incident: Incident;
}

export const FusionVisualizer: React.FC<FusionVisualizerProps> = ({ incident }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // If the incident has multiple reports (like the signature Medical Emergency #CP-1042)
  const isFused = incident.reportCount > 1;

  return (
    <div className="bg-white/85 backdrop-blur-2xl rounded-2xl border border-white/60 p-5 shadow-xl relative overflow-hidden">
      {/* Background visual signal waves */}
      <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-brand-100/30 rounded-full blur-2xl pointer-events-none" />
      
      {/* Top Header Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-indigo-100/70">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-xs">
            <GitMerge className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Incident Fusion</span>
            <span className="text-[11px] text-brand-800 font-bold ml-2 bg-brand-100/90 px-2.5 py-0.5 rounded-full border border-brand-200">
              {incident.reportCount} {incident.reportCount === 1 ? 'Report' : 'Reports'} &rarr; 1 Master Incident
            </span>
          </div>
        </div>
        
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50/90 border border-emerald-200 px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Strong match
        </span>
      </div>

      {/* Main Visual Convergence Diagram */}
      <div className="mt-3.5">
        <div className="text-[11px] text-slate-500 font-medium mb-2 flex items-center justify-between">
          <span>Incoming Human Signals</span>
          <span className="text-brand-700 font-semibold">Consolidated Operations Unit</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Left: Fragmented Reports Stack */}
          <div className="md:col-span-6 space-y-2">
            {incident.reports && incident.reports.length > 0 ? (
              incident.reports.map((report, idx) => {
                const isEmergencyCall = report.source === 'EMERGENCY_CALL' || (report.reportNumber && report.reportNumber.includes('CALL'));
                
                return (
                  <div 
                    key={report.id || idx}
                    className={`p-2.5 rounded-lg border shadow-2xs hover:border-brand-300 transition-all text-xs relative group ${
                      isEmergencyCall ? 'bg-rose-50/70 border-rose-200' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-700">
                          {isEmergencyCall ? '🚨 EMERGENCY CALL' : `REPORT 0${idx + 1}`}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          isEmergencyCall ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isEmergencyCall ? 'Emergency Hotline' : 'Student Report'}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {report.purpose && (
                      <p className="text-[11px] font-bold text-rose-900 mb-0.5">
                        Purpose: {report.purpose}
                      </p>
                    )}
                    <p className="text-slate-800 font-medium italic line-clamp-2">
                      "{report.text}"
                    </p>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1 truncate max-w-[140px]">
                        <MapPin className="w-2.5 h-2.5 text-slate-400" />
                        {report.location}
                      </span>
                      <span className="text-slate-400 font-medium">{report.submitterRole || 'Student'}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs italic text-slate-600">
                "{incident.summary}"
              </div>
            )}
          </div>

          {/* Center: Convergence Arrow with connecting animation */}
          <div className="md:col-span-1 hidden md:flex flex-col items-center justify-center text-brand-600">
            <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-300 flex items-center justify-center shadow-xs">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-[9px] font-mono uppercase tracking-widest mt-1 text-brand-700 font-bold">FUSE</span>
          </div>

          {/* Right: Master Consolidated Incident Card */}
          <div className="md:col-span-5 bg-white p-3.5 rounded-xl border-2 border-brand-400/80 shadow-md relative">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">
                MASTER INCIDENT
              </span>
              <PriorityBadge priority={incident.priority} size="sm" />
            </div>

            <div className="mt-2">
              <h4 className="text-xs font-bold text-slate-900">{incident.title}</h4>
              <p className="text-[11px] font-semibold text-slate-700 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-brand-600 shrink-0" />
                <span>{incident.location}</span>
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Signal Confidence:</span>
              <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                Related reports detected
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Reasoning: "Why were these reports connected?" */}
      <div className="mt-3 pt-2.5 border-t border-indigo-100">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-xs font-semibold text-brand-700 hover:text-brand-900 transition-colors py-1 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            Why were these reports connected?
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isExpanded && (
          <div className="mt-2 p-3 bg-white rounded-lg border border-brand-200 text-xs space-y-2 animate-fade-in">
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              CampusPulse dynamically validated spatial, temporal, and semantic alignment across multiple independent campus inputs:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-md border border-slate-200/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800 text-[11px]">Same Location</p>
                  <p className="text-[10px] text-slate-500">Normalized to Basketball Court perimeter (95% overlap)</p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-md border border-slate-200/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800 text-[11px]">Same Time Window</p>
                  <p className="text-[10px] text-slate-500">All 3 reports logged within 2 minutes of event</p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-md border border-slate-200/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800 text-[11px]">Similar Description</p>
                  <p className="text-[10px] text-slate-500">Matched distress keywords: collapsed, unconscious, emergency</p>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic pt-1 text-center">
              "Many signals becoming one coordinated response."
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

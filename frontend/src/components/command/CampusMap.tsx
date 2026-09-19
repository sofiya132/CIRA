import React, { useState } from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { Incident, CampusZone } from '../../types';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Radio, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  HeartPulse,
  Flame,
  Zap,
  Droplets,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { PriorityBadge } from '../common/Badge';

export const CampusMap: React.FC<{ fullScreen?: boolean }> = ({ fullScreen = false }) => {
  const { incidents, zones, responders, selectedIncidentId, setSelectedIncidentId } = useCampusPulse();
  const [activeLayer, setActiveLayer] = useState<'ALL' | 'INCIDENTS' | 'RESPONDERS' | 'ZONES'>('ALL');
  const [selectedZone, setSelectedZone] = useState<CampusZone | null>(null);

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');

  return (
    <div className={`bg-white/85 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl overflow-hidden flex flex-col ${
      fullScreen ? 'h-[calc(100vh-12rem)] min-h-[600px]' : 'h-80'
    }`}>
      {/* Map Control Bar */}
      <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-brand-600" />
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Tactical Campus Grounds
          </span>
          <span className="text-[11px] font-mono text-slate-500">Grid Lat/Lng 42.3601 N, 71.0942 W</span>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 text-xs">
          {(['ALL', 'INCIDENTS', 'RESPONDERS'] as const).map(layer => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                activeLayer === layer
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative flex-1 bg-slate-100 overflow-hidden select-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Subtle Grid Lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E2E8F0" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Campus Zones / Building Footprints */}
          {/* Zone: Sports Complex */}
          <polygon
            points="65,15 90,15 90,45 65,45"
            fill="#E0E7FF"
            stroke="#A5B4FC"
            strokeWidth="0.5"
            className="cursor-pointer hover:fill-indigo-200 transition-colors opacity-80"
          />
          {/* Zone: Science Quad */}
          <polygon
            points="25,15 50,15 50,42 25,42"
            fill="#F1F5F9"
            stroke="#CBD5E1"
            strokeWidth="0.5"
            className="cursor-pointer hover:fill-slate-200 transition-colors opacity-80"
          />
          {/* Zone: Central Library */}
          <polygon
            points="40,48 60,48 60,65 40,65"
            fill="#F8FAFC"
            stroke="#CBD5E1"
            strokeWidth="0.5"
            className="cursor-pointer hover:fill-slate-200 transition-colors opacity-80"
          />
          {/* Zone: Student Union */}
          <polygon
            points="15,55 35,55 35,80 15,80"
            fill="#F1F5F9"
            stroke="#CBD5E1"
            strokeWidth="0.5"
            className="cursor-pointer hover:fill-slate-200 transition-colors opacity-80"
          />
          {/* Zone: Engineering Hub */}
          <polygon
            points="60,60 85,60 85,85 60,85"
            fill="#F1F5F9"
            stroke="#CBD5E1"
            strokeWidth="0.5"
            className="cursor-pointer hover:fill-slate-200 transition-colors opacity-80"
          />

          {/* Roadways & Pathways */}
          <path d="M 0 50 Q 50 48 100 50" fill="none" stroke="#CBD5E1" strokeWidth="1.2" />
          <path d="M 55 0 L 55 100" fill="none" stroke="#CBD5E1" strokeWidth="1.2" />
          <path d="M 20 0 L 20 100" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
          <path d="M 80 0 L 80 100" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />

          {/* Text Labels on Map */}
          <text x="77" y="28" fill="#4338CA" fontSize="2.8" fontWeight="bold" textAnchor="middle">Sports Complex</text>
          <text x="77" y="32" fill="#6366F1" fontSize="2.0" textAnchor="middle">Basketball Courts</text>

          <text x="37.5" y="26" fill="#334155" fontSize="2.8" fontWeight="bold" textAnchor="middle">Science & Tech Quad</text>
          <text x="37.5" y="30" fill="#64748B" fontSize="2.0" textAnchor="middle">Block A & B</text>

          <text x="50" y="56" fill="#334155" fontSize="2.6" fontWeight="bold" textAnchor="middle">Central Library</text>

          <text x="25" y="66" fill="#334155" fontSize="2.6" fontWeight="bold" textAnchor="middle">Student Union</text>
          <text x="72.5" y="72" fill="#334155" fontSize="2.6" fontWeight="bold" textAnchor="middle">Engineering Hub</text>
        </svg>

        {/* Dynamic Incident Markers Overlay */}
        {(activeLayer === 'ALL' || activeLayer === 'INCIDENTS') &&
          activeIncidents.map(inc => {
            const isSelected = inc.id === selectedIncidentId;
            const isCritical = inc.priority === 'CRITICAL';
            
            return (
              <div
                key={inc.id}
                onClick={() => setSelectedIncidentId(inc.id)}
                style={{
                  left: `${inc.coordinates.x}%`,
                  top: `${inc.coordinates.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute cursor-pointer transition-all z-20 group ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
              >
                {/* Pulsing ring for critical emergencies */}
                {isCritical && (
                  <span className="absolute -inset-2 rounded-full bg-rose-500/40 animate-ping" />
                )}

                {/* Marker Pin */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 text-white font-bold text-xs ${
                  inc.priority === 'CRITICAL'
                    ? 'bg-rose-600 border-white ring-2 ring-rose-500'
                    : inc.priority === 'HIGH'
                    ? 'bg-amber-500 border-white'
                    : 'bg-sky-600 border-white'
                }`}>
                  {inc.category === 'MEDICAL' ? (
                    <HeartPulse className="w-4 h-4" />
                  ) : inc.category === 'ELECTRICAL' ? (
                    <Zap className="w-4 h-4" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                </div>

                {/* Tooltip on hover */}
                <div className="absolute left-1/2 -top-8 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  #{inc.incidentNumber} - {inc.title} ({inc.reportCount} reports)
                </div>
              </div>
            );
          })}

        {/* Dynamic Responder Locations Overlay */}
        {(activeLayer === 'ALL' || activeLayer === 'RESPONDERS') &&
          responders.map((resp, idx) => {
            // Preset locations on map
            const respCoords = [
              { x: 70, y: 38 }, // Arjun Kumar near gym
              { x: 45, y: 52 }, // Sarah Lin near library plaza
              { x: 32, y: 25 }, // David Chen near science block
              { x: 55, y: 40 }, // Nurse Watson
            ][idx] || { x: 50, y: 50 };

            return (
              <div
                key={resp.id}
                style={{
                  left: `${respCoords.x}%`,
                  top: `${respCoords.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-15 group cursor-pointer"
                title={`${resp.name} (${resp.unitCode})`}
              >
                <div className="w-5 h-5 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-md">
                  <UserCheck className="w-3 h-3" />
                </div>
                <div className="absolute left-1/2 -bottom-5 -translate-x-1/2 bg-white/90 border border-slate-200 text-slate-800 text-[9px] font-bold px-1.5 py-0.2 rounded shadow-2xs whitespace-nowrap">
                  {resp.unitCode}
                </div>
              </div>
            );
          })}
      </div>

      {/* Map Legend Footer */}
      <div className="px-3 py-2 border-t border-slate-200 bg-white flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span>Critical Incident</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>High Priority</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Active Unit</span>
          </span>
        </div>
        <span className="font-semibold text-slate-700">Click any marker to inspect</span>
      </div>
    </div>
  );
};

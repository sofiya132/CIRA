import React, { useState } from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { Incident, PriorityLevel } from '../../types';
import { PriorityBadge, StatusBadge, CategoryIcon } from '../common/Badge';
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Clock, 
  GitMerge, 
  UserCheck, 
  AlertTriangle,
  Flame,
  Zap,
  HeartPulse,
  Droplets
} from 'lucide-react';

interface IncidentListProps {
  variant?: 'vertical' | 'horizontal';
}

export const IncidentList: React.FC<IncidentListProps> = ({ variant = 'horizontal' }) => {
  const { incidents, selectedIncidentId, setSelectedIncidentId } = useCampusPulse();
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredIncidents = incidents.filter(inc => {
    // Search query match
    const matchesSearch = 
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.incidentNumber.toLowerCase().includes(searchQuery.toLowerCase());

    // Priority filter match
    const matchesPriority = priorityFilter === 'ALL' || inc.priority === priorityFilter;

    // Category filter match
    const matchesCategory = categoryFilter === 'ALL' || inc.category === categoryFilter;

    return matchesSearch && matchesPriority && matchesCategory;
  });

  const isHorizontal = variant === 'horizontal';

  return (
    <div className={`bg-white/85 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-xl flex flex-col overflow-hidden w-full ${
      isHorizontal ? 'h-auto min-h-0 p-4 space-y-4' : 'h-[calc(100vh-14.5rem)] min-h-[580px]'
    }`}>
      {/* Header & Controls Bar */}
      <div className={`${isHorizontal ? 'flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/40' : 'p-4 border-b border-white/40 space-y-2.5 bg-white/40 rounded-t-2xl'}`}>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Active Incidents Queue</h2>
          <span className="text-[11px] font-mono font-bold bg-slate-900/10 text-slate-800 px-2.5 py-0.5 rounded-full">
            {filteredIncidents.length} active
          </span>
        </div>

        {/* Search & Filter Controls */}
        <div className={`flex flex-wrap items-center gap-2 ${isHorizontal ? 'flex-1 justify-end max-w-2xl' : 'w-full'}`}>
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search incident, location, #CP code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/80 border border-white/80 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(prio => (
              <button
                key={prio}
                onClick={() => setPriorityFilter(prio)}
                className={`px-2.5 py-1.5 rounded-lg font-bold text-[10px] sm:text-[11px] transition-all cursor-pointer whitespace-nowrap ${
                  priorityFilter === prio
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white/70 text-slate-700 border border-white/60 hover:bg-white'
                }`}
              >
                {prio === 'ALL' ? 'All' : prio}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Cards Grid / Feed */}
      <div className={`${
        isHorizontal 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5' 
          : 'flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-2'
      }`}>
        {filteredIncidents.length === 0 ? (
          <div className="text-center py-12 px-4 col-span-full">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
              <Filter className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700">No matching incidents</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Try clearing your filters or search terms.</p>
          </div>
        ) : (
          filteredIncidents.map(inc => {
            const isSelected = inc.id === selectedIncidentId;
            const isAwaitingAck = inc.status === 'AWAITING_ACK';
            
            return (
              <div
                key={inc.id}
                onClick={() => setSelectedIncidentId(inc.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-50/95 border-brand-500 ring-2 ring-brand-500/50 shadow-md'
                    : 'bg-white/80 border-white/60 hover:bg-white hover:border-white hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Row: Priority, CP Code, Emergency Call badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <PriorityBadge priority={inc.priority} size="sm" />
                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        #{inc.incidentNumber}
                      </span>
                      {inc.isEmergencyCall && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-600 text-white shadow-xs animate-pulse flex items-center gap-1">
                          🚨 EMERGENCY CALL
                        </span>
                      )}
                    </div>
                    <StatusBadge status={inc.status} size="sm" />
                  </div>

                  {/* Incident Title & Summary */}
                  <div className="mt-2">
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <CategoryIcon category={inc.category} className="w-3.5 h-3.5" />
                      <span>{inc.title}</span>
                    </h3>
                    {inc.isEmergencyCall && inc.emergencyPurpose && (
                      <div className="mt-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
                        Purpose: {inc.emergencyPurpose}
                      </div>
                    )}
                    <p className="text-[11px] text-slate-700 font-medium mt-1 line-clamp-2 leading-relaxed">
                      "{inc.summary}"
                    </p>
                  </div>
                </div>

                <div>
                  {/* Metadata Row: Location, Report Count, Time Elapsed */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1 text-slate-800 font-bold truncate max-w-[140px]">
                      <MapPin className="w-3 h-3 text-brand-600 shrink-0" />
                      <span className="truncate">{inc.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Fused Reports Tag */}
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        inc.reportCount > 1 ? 'text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded border border-brand-200' : 'text-slate-400'
                      }`}>
                        <GitMerge className="w-3 h-3" />
                        <span>{inc.reportCount}</span>
                      </span>

                      {/* Elapsed Time */}
                      <span className="flex items-center gap-1 text-slate-500 font-mono text-[10px] font-semibold">
                        <Clock className="w-3 h-3" />
                        <span>02:14</span>
                      </span>
                    </div>
                  </div>

                  {/* Responder Tag */}
                  <div className="mt-2 flex items-center justify-between text-[11px] bg-slate-100/70 px-2.5 py-1 rounded-lg border border-slate-200/50">
                    <span className="text-slate-500 font-medium">Responder:</span>
                    <span className="font-bold text-slate-900 truncate">
                      {inc.assignedResponder?.role || 'Unassigned'}
                    </span>
                  </div>

                  {/* Urgent Response SLA warning if awaiting ack */}
                  {isAwaitingAck && inc.secondsRemaining > 0 && (
                    <div className="mt-2 flex items-center justify-between text-[10px] bg-amber-50/90 text-amber-900 px-2 py-1 rounded-lg border border-amber-200 font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                        Awaiting Ack:
                      </span>
                      <span className="font-mono font-bold">{inc.secondsRemaining}s remaining</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

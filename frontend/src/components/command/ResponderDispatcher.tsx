import React, { useState } from 'react';
import { Incident } from '../../types';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { 
  UserCheck, 
  MapPin, 
  Activity, 
  Radio, 
  Phone, 
  CheckCircle2, 
  Navigation2, 
  ShieldAlert, 
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { Modal } from '../common/Modal';

interface ResponderDispatcherProps {
  incident: Incident;
}

export const ResponderDispatcher: React.FC<ResponderDispatcherProps> = ({ incident }) => {
  const { 
    responders, 
    acknowledgeIncident, 
    markEnRoute, 
    markOnScene, 
    resolveIncident, 
    reassignResponder 
  } = useCampusPulse();

  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const assigned = incident.assignedResponder || responders[0];

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resolveIncident(incident.id, resolutionNotes || 'Incident safely cleared and documented.');
    setShowResolveModal(false);
  };

  return (
    <div className="bg-white/85 backdrop-blur-xl rounded-2xl border border-white/60 p-4 shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Assigned Responder
            </h4>
            <p className="text-[10px] text-slate-500">Fastest proximity & role match</p>
          </div>
        </div>

        <button
          onClick={() => setShowReassignModal(true)}
          className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors cursor-pointer"
        >
          Change Unit
        </button>
      </div>

      {/* Responder Card Details */}
      <div className="mt-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded uppercase tracking-wider">
              {assigned.role}
            </span>
            <h5 className="text-sm font-bold text-slate-900 mt-1">{assigned.name}</h5>
            <p className="text-xs text-slate-500">{assigned.unitCode}</p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-900">{assigned.distanceMeters} m</span>
            <p className="text-[10px] text-slate-400">Distance to scene</p>
          </div>
        </div>

        {/* Contact & Status Meta */}
        <div className="mt-3 pt-2.5 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-[11px]">{assigned.radioChannel}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-800 font-semibold">{assigned.status}</span>
          </div>
        </div>
      </div>

      {/* Tactile Operational Action Progression */}
      <div className="mt-4 space-y-2">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Incident Response Actions:
        </p>

        {incident.status === 'AWAITING_ACK' && (
          <button
            onClick={() => acknowledgeIncident(incident.id)}
            className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>ACKNOWLEDGE DISPATCH</span>
          </button>
        )}

        {incident.status === 'ACKNOWLEDGED' && (
          <button
            onClick={() => markEnRoute(incident.id)}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Navigation2 className="w-4 h-4" />
            <span>MARK EN ROUTE</span>
          </button>
        )}

        {incident.status === 'EN_ROUTE' && (
          <button
            onClick={() => markOnScene(incident.id)}
            className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>MARK ON SCENE</span>
          </button>
        )}

        {(incident.status === 'ON_SCENE' || incident.status === 'ESCALATED') && (
          <button
            onClick={() => setShowResolveModal(true)}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>RESOLVE INCIDENT</span>
          </button>
        )}

        {incident.status === 'RESOLVED' && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Incident Resolved by {incident.resolvedBy || assigned.name}</span>
          </div>
        )}
      </div>

      {/* Reassign Responder Modal */}
      <Modal
        isOpen={showReassignModal}
        onClose={() => setShowReassignModal(false)}
        title="Reassign Response Unit"
        subtitle={`Select a specialized responder unit for Incident #${incident.incidentNumber}`}
      >
        <div className="space-y-2.5">
          {responders.map(resp => (
            <div
              key={resp.id}
              onClick={() => {
                reassignResponder(incident.id, resp.id);
                setShowReassignModal(false);
              }}
              className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                resp.id === assigned.id
                  ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">{resp.role}</span>
                <p className="font-bold text-slate-900 mt-0.5">{resp.name}</p>
                <p className="text-[11px] text-slate-500">{resp.currentLocation}</p>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-800">{resp.distanceMeters} m</span>
                <p className="text-[10px] text-emerald-600 font-semibold">{resp.status}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Resolve Modal */}
      <Modal
        isOpen={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        title="Complete & Resolve Incident"
        subtitle={`Document resolution findings for Incident #${incident.incidentNumber}`}
      >
        <form onSubmit={handleResolveSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Field Resolution Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Patient stabilized and transferred to clinic. Scene cleared."
              value={resolutionNotes}
              onChange={e => setResolutionNotes(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowResolveModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
            >
              Confirm Resolution
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

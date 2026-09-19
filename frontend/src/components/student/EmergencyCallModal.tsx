import React, { useState, useEffect } from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { IncidentCategory } from '../../types';
import { CAMPUS_LOCATIONS } from '../../services/mockData';
import { 
  PhoneCall, 
  ShieldAlert, 
  HeartPulse, 
  Flame, 
  Shield, 
  Phone, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Clock, 
  AlertCircle,
  FileText
} from 'lucide-react';

export const EmergencyCallModal: React.FC = () => {
  const { 
    isCallModalOpen, 
    activeCallingHotline, 
    closeEmergencyCall, 
    submitEmergencyCall, 
    studentProfile,
    setCurrentScreen,
    setSelectedIncidentId
  } = useCampusPulse();

  // Screen State: 'PURPOSE' (Ask purpose/details) | 'RESULT' (Emergency Request Sent confirmation)
  const [screenState, setScreenState] = useState<'PURPOSE' | 'RESULT'>('PURPOSE');

  // Form State
  const [selectedPurpose, setSelectedPurpose] = useState<string>('Unconscious person');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>(CAMPUS_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Result state
  const [createdIncidentNumber, setCreatedIncidentNumber] = useState<string>('');
  const [createdIncidentId, setCreatedIncidentId] = useState<string>('');
  const [wasFused, setWasFused] = useState<boolean>(false);

  const purposeOptions: Record<string, string[]> = {
    MEDICAL: [
      'Unconscious person',
      'Medical emergency',
      'Person injured',
      'Accident',
      'Other'
    ],
    SECURITY: [
      'Violence / Security threat',
      'Physical altercation',
      'Suspicious activity',
      'Immediate safety danger',
      'Other'
    ],
    FIRE: [
      'Fire / Flames visible',
      'Heavy smoke detected',
      'Explosion / Gas leak',
      'Building evacuation required',
      'Other'
    ],
    DESK: [
      'Immediate campus assistance',
      'Accident / Hazard',
      'Security escort',
      'Other'
    ]
  };

  const getCategoryFromHotline = (cat?: string): IncidentCategory => {
    switch (cat) {
      case 'MEDICAL': return 'MEDICAL';
      case 'FIRE': return 'FIRE';
      case 'SECURITY': return 'VIOLENCE';
      default: return 'GENERAL';
    }
  };

  // Reset modal when opening
  useEffect(() => {
    if (isCallModalOpen && activeCallingHotline) {
      setScreenState('PURPOSE');
      const catKey = activeCallingHotline.category || 'MEDICAL';
      const defaultPurposes = purposeOptions[catKey] || purposeOptions.MEDICAL;
      setSelectedPurpose(defaultPurposes[0]);
      setDescription('');
      setLocation(CAMPUS_LOCATIONS[0]);
      setCustomLocation('');
      setIsSubmitting(false);
    }
  }, [isCallModalOpen, activeCallingHotline]);

  if (!isCallModalOpen || !activeCallingHotline) return null;

  const currentCategoryKey = activeCallingHotline.category || 'MEDICAL';
  const availablePurposes = purposeOptions[currentCategoryKey] || purposeOptions.MEDICAL;

  const handleInitiateCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalLocation = customLocation.trim() ? `${location} (${customLocation.trim()})` : location;
    const cat = getCategoryFromHotline(activeCallingHotline.category);

    await new Promise(r => setTimeout(r, 500));

    const result = submitEmergencyCall({
      category: cat,
      purpose: selectedPurpose,
      description: description.trim() || `${selectedPurpose} at ${finalLocation}`,
      location: finalLocation
    });

    setCreatedIncidentNumber(result.incident.incidentNumber);
    setCreatedIncidentId(result.incident.id);
    setWasFused(result.wasFused);
    setIsSubmitting(false);
    setScreenState('RESULT');
  };

  const handleTrackMyReport = () => {
    if (createdIncidentId) {
      setSelectedIncidentId(createdIncidentId);
      closeEmergencyCall();
      setCurrentScreen('STUDENT_TRACKING');
    } else {
      closeEmergencyCall();
      setCurrentScreen('STUDENT_MY_REPORTS');
    }
  };

  const getHotlineIcon = () => {
    switch (activeCallingHotline.iconName) {
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6 text-rose-500" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-orange-500" />;
      case 'Shield':
        return <Shield className="w-6 h-6 text-indigo-500" />;
      default:
        return <Phone className="w-6 h-6 text-brand-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden text-white relative animate-scale-in max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={closeEmergencyCall}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. CALL PURPOSE SCREEN */}
        {screenState === 'PURPOSE' && (
          <form onSubmit={handleInitiateCall} className="p-6 space-y-5 overflow-y-auto text-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                {getHotlineIcon()}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400 block">
                  🚨 EMERGENCY CALL • {activeCallingHotline.serviceName.toUpperCase()}
                </span>
                <h2 className="text-xl font-black text-white">
                  What is the emergency?
                </h2>
              </div>
            </div>

            {/* Quick Purpose Selection */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Select Situation Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availablePurposes.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPurpose(p)}
                    className={`p-3 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                      selectedPurpose === p
                        ? 'bg-rose-600/30 border-rose-500 text-white ring-2 ring-rose-500'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Briefly describe the emergency
              </label>
              <textarea
                rows={2}
                placeholder='e.g. "Person has collapsed near the basketball court."'
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-white placeholder:text-slate-500 text-xs"
              />
            </div>

            {/* Location Selector */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Location
              </label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-white font-semibold text-xs"
              >
                {CAMPUS_LOCATIONS.map((loc, idx) => (
                  <option key={idx} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Auto Captured Student Information Card */}
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-[11px] space-y-1 text-slate-400">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span>Caller: {studentProfile.name}</span>
                <span className="font-mono">{studentProfile.studentId}</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Timestamp & GPS coordinates are captured automatically to dispatch response units without delay.
              </p>
            </div>

            {/* Action Buttons: Cancel or Initiate */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={closeEmergencyCall}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isSubmitting ? 'Requesting...' : 'Initiate Call'}</span>
              </button>
            </div>
          </form>
        )}

        {/* 2. CALL UI RESULT SCREEN */}
        {screenState === 'RESULT' && (
          <div className="p-6 sm:p-8 text-center space-y-6 animate-fade-in overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Emergency Request Sent
              </h2>
              <p className="text-xs text-rose-300 font-bold">
                {activeCallingHotline.serviceName} response has been requested.
              </p>
            </div>

            {/* Incident ID & Live Status Card */}
            <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 text-left text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <span className="text-slate-400">Incident ID:</span>
                <span className="font-mono font-black text-rose-400 text-sm">
                  #{createdIncidentNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Response being coordinated</span>
                </span>
              </div>
            </div>

            {/* Requested Checklist Workflow */}
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80 text-left space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
                <span>Emergency request received</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
                <span>Operations notified</span>
              </div>
              <div className="flex items-center gap-2.5 text-brand-300 font-bold">
                <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] animate-pulse">●</span>
                <span>Responder assigned & alerted</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400 font-medium">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 border border-slate-700 flex items-center justify-center text-[10px]">○</span>
                <span>Responder responding</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400 font-medium">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 border border-slate-700 flex items-center justify-center text-[10px]">○</span>
                <span>Resolved</span>
              </div>
            </div>

            {/* Privacy Safe Note */}
            <p className="text-[11px] text-slate-400">
              {wasFused 
                ? 'Your emergency call has been connected to an active verified incident.'
                : 'A high-priority incident has been registered for campus emergency dispatch.'}
            </p>

            {/* Actions: Track My Report or Close */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleTrackMyReport}
                className="flex-1 py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Track My Report</span>
              </button>

              <button
                onClick={closeEmergencyCall}
                className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs cursor-pointer transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

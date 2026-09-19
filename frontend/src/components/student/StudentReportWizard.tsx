import React, { useState } from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { IncidentCategory, RawReport } from '../../types';
import { CAMPUS_LOCATIONS } from '../../services/mockData';
import { 
  HeartPulse, 
  Flame, 
  ShieldAlert, 
  Zap, 
  Droplets, 
  Package, 
  Wrench,
  HelpCircle,
  MapPin, 
  Camera, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Send, 
  AlertCircle,
  EyeOff,
  PhoneCall,
  User,
  ShieldCheck
} from 'lucide-react';
import { StudentAuthModal } from './StudentAuthModal';

export const StudentReportWizard: React.FC = () => {
  const { 
    submitStudentReport, 
    setCurrentScreen, 
    setSelectedIncidentId, 
    studentProfile, 
    openEmergencyCall, 
    emergencyHotlines 
  } = useCampusPulse();

  // Wizard Step: 1 = WHAT, 2 = WHERE, 3 = DETAILS, 4 = REVIEW, 5 = RESULT
  const [step, setStep] = useState<number>(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Form State
  const [category, setCategory] = useState<IncidentCategory>('MEDICAL');
  const [text, setText] = useState('');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [floorRoom, setFloorRoom] = useState('');
  const [personState, setPersonState] = useState<'UNCONSCIOUS' | 'INJURED' | 'DISTRESSED' | 'SAFE' | 'UNKNOWN'>('UNKNOWN');
  const [fireCondition, setFireCondition] = useState<string>('Smoke visible');
  const [facilityCondition, setFacilityCondition] = useState<string>('Exposed wiring / hazard');
  const [hasEvidence, setHasEvidence] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Result state
  const [submittedReport, setSubmittedReport] = useState<RawReport | null>(null);
  const [createdIncidentId, setCreatedIncidentId] = useState<string | null>(null);
  const [wasFused, setWasFused] = useState(false);

  const categories: { id: IncidentCategory; label: string; icon: any; color: string; activeColor: string }[] = [
    { id: 'MEDICAL', label: 'Medical', icon: HeartPulse, color: 'text-rose-600 bg-rose-50 border-rose-200', activeColor: 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-500' },
    { id: 'FIRE', label: 'Fire', icon: Flame, color: 'text-orange-600 bg-orange-50 border-orange-200', activeColor: 'border-orange-500 bg-orange-50 text-orange-900 ring-2 ring-orange-500' },
    { id: 'VIOLENCE', label: 'Violence', icon: ShieldAlert, color: 'text-red-600 bg-red-50 border-red-200', activeColor: 'border-red-500 bg-red-50 text-red-900 ring-2 ring-red-500' },
    { id: 'ELECTRICAL', label: 'Electrical', icon: Zap, color: 'text-amber-600 bg-amber-50 border-amber-200', activeColor: 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500' },
    { id: 'WATER', label: 'Water', icon: Droplets, color: 'text-sky-600 bg-sky-50 border-sky-200', activeColor: 'border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-500' },
    { id: 'FACILITY', label: 'Facility', icon: Wrench, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', activeColor: 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500' },
    { id: 'LOST_ITEM', label: 'Lost Item', icon: Package, color: 'text-purple-600 bg-purple-50 border-purple-200', activeColor: 'border-purple-500 bg-purple-50 text-purple-900 ring-2 ring-purple-500' },
    { id: 'GENERAL', label: 'Other', icon: HelpCircle, color: 'text-slate-600 bg-slate-50 border-slate-200', activeColor: 'border-slate-500 bg-slate-100 text-slate-900 ring-2 ring-slate-500' },
  ];

  const handleNext = () => {
    if (step === 1 && !text.trim()) return;
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullLocation = floorRoom.trim() ? `${location} (${floorRoom.trim()})` : location;

    // Small delay to simulate realistic ingestion
    await new Promise(r => setTimeout(r, 600));

    const result = submitStudentReport({
      category,
      text,
      location: fullLocation,
      personState,
      isAnonymous,
      submitterName: isAnonymous ? 'Anonymous Student' : studentProfile.name || 'Student',
      submitterContact: isAnonymous ? undefined : studentProfile.phone,
      evidencePhotos: hasEvidence ? ['https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=60'] : []
    });

    setSubmittedReport(result.report);
    setCreatedIncidentId(result.incident.id);
    setWasFused(result.wasFused);
    setIsSubmitting(false);
    setStep(5); // Show submission result
  };

  const handleReset = () => {
    setText('');
    setFloorRoom('');
    setPersonState('UNKNOWN');
    setHasEvidence(false);
    setIsAnonymous(false);
    setSubmittedReport(null);
    setCreatedIncidentId(null);
    setStep(1);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in relative z-10 space-y-4">
      {/* Top Banner: Immediate Emergency Calling Access */}
      <div className="bg-rose-950/85 backdrop-blur-md border border-rose-500/40 rounded-2xl p-3.5 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center shrink-0">
            <PhoneCall className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-xs font-bold block text-white">Need immediate emergency help?</span>
            <span className="text-[11px] text-rose-200">Call campus hotlines directly without a form</span>
          </div>
        </div>

        <button
          onClick={() => {
            const secHotline = emergencyHotlines.find(h => h.category === 'SECURITY') || emergencyHotlines[0];
            openEmergencyCall(secHotline);
          }}
          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer border border-rose-400/30"
        >
          Call 911 Direct
        </button>
      </div>

      {/* Submitter Profile Badge */}
      <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/60 shadow-sm flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Reporting as: <strong className="text-slate-900">{studentProfile.name}</strong> ({studentProfile.studentId})</span>
        </div>
        <button
          onClick={() => setShowAuthModal(true)}
          className="text-[11px] font-bold text-brand-600 hover:text-brand-800 underline cursor-pointer"
        >
          Edit Profile
        </button>
      </div>

      {/* Mobile-First Card Container */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-white/70 shadow-xl overflow-hidden">
        {/* Step Indicator Header (Steps 1 to 4) */}
        {step < 5 && (
          <div className="p-6 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-brand-700 uppercase tracking-widest">
                STUDENT INCIDENT REPORTING
              </span>
              <span className="text-xs font-bold text-slate-500 font-mono">
                STEP {step} OF 4
              </span>
            </div>

            {/* Step Progress Bar */}
            <div className="grid grid-cols-4 gap-2 text-[11px] font-semibold text-slate-500">
              {[
                { num: 1, label: 'What' },
                { num: 2, label: 'Where' },
                { num: 3, label: 'Details' },
                { num: 4, label: 'Review' }
              ].map((s) => {
                const isCurrent = step === s.num;
                const isDone = step > s.num;

                return (
                  <div key={s.num} className="text-left">
                    <div className={`h-1.5 rounded-full mb-1 transition-all ${
                      isDone ? 'bg-emerald-500' : isCurrent ? 'bg-brand-600' : 'bg-slate-200'
                    }`} />
                    <span className={isCurrent ? 'text-slate-900 font-bold' : isDone ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                      {s.num}. {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1 — WHAT */}
        {step === 1 && (
          <div className="p-6 sm:p-8 space-y-6 animate-fade-in">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                What happened?
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Select the incident category and describe what you are seeing.
              </p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                      isSelected ? cat.activeColor : `bg-white border-slate-200 hover:border-slate-300 ${cat.color}`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-bold">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Natural-Language Description Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Natural-Language Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe what you are seeing. Include important details such as what happened, who may need help, and any immediate danger."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all placeholder:text-slate-400 leading-relaxed"
              />
              <p className="text-[11px] text-slate-400">
                Encourage natural wording. CampusPulse connects related reports automatically.
              </p>
            </div>

            <button
              onClick={handleNext}
              disabled={!text.trim()}
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>Next: Where is it happening?</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2 — WHERE */}
        {step === 2 && (
          <div className="p-6 sm:p-8 space-y-6 animate-fade-in">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Where is it happening?
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Pinpoint the building, grounds area, landmark, or specific floor.
              </p>
            </div>

            {/* Building / Area Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Campus Building / Area
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold text-slate-800"
              >
                {CAMPUS_LOCATIONS.map((loc, i) => (
                  <option key={i} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Specific Landmark / Floor / Room */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Floor, Room, or Landmark (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Near bleachers on East Court, 2nd floor restroom, North Gate"
                value={floorRoom}
                onChange={(e) => setFloorRoom(e.target.value)}
                className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Location Confirmation Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Location</span>
                <p className="text-xs font-extrabold text-slate-900 truncate">
                  {location} {floorRoom ? `— ${floorRoom}` : ''}
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Geocoded on tactical campus grid</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-2 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Next: Tell us more</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — DETAILS */}
        {step === 3 && (
          <div className="p-6 sm:p-8 space-y-6 animate-fade-in">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Tell us more
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Contextual details help responders prepare the right equipment before arrival.
              </p>
            </div>

            {/* Contextual Field for Medical */}
            {category === 'MEDICAL' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Person Status
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'UNCONSCIOUS', label: 'Unconscious / Collapsed', color: 'bg-rose-50 text-rose-900 border-rose-300' },
                    { id: 'INJURED', label: 'Conscious & Injured', color: 'bg-amber-50 text-amber-900 border-amber-300' },
                    { id: 'UNKNOWN', label: 'Other / Unknown', color: 'bg-slate-50 text-slate-700 border-slate-200' },
                  ].map((state) => (
                    <button
                      key={state.id}
                      type="button"
                      onClick={() => setPersonState(state.id as any)}
                      className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        personState === state.id ? `${state.color} ring-2 ring-rose-500` : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {state.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contextual Field for Fire */}
            {category === 'FIRE' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Fire & Smoke Condition
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Smoke visible', 'Flames visible', 'Evacuation needed', 'Unknown'].map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setFireCondition(cond)}
                      className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        fireCondition === cond ? 'bg-orange-50 text-orange-900 border-orange-400 ring-2 ring-orange-500' : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contextual Field for Facility / Electrical / Other */}
            {category !== 'MEDICAL' && category !== 'FIRE' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Hazard Severity
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Exposed wiring / hazard', 'Active water flooding', 'Property damage', 'General safety hazard'].map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setFacilityCondition(cond)}
                      className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        facilityCondition === cond ? 'bg-amber-50 text-amber-900 border-amber-400 ring-2 ring-amber-500' : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Photo / Evidence Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Photo or Evidence (Optional)
              </label>
              <button
                type="button"
                onClick={() => setHasEvidence(!hasEvidence)}
                className={`w-full border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${
                  hasEvidence ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <Camera className={`w-6 h-6 mx-auto mb-1 ${hasEvidence ? 'text-brand-600' : 'text-slate-400'}`} />
                <p className="text-xs font-bold text-slate-800">
                  {hasEvidence ? '✓ 1 photo attached (simulated)' : 'Tap to attach photo / evidence'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Helps responders assess the scene on approach
                </p>
              </button>
            </div>

            {/* Submit Anonymously with Clear Explanation */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
                />
                <span className="flex items-center gap-1">
                  <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                  <span>Submit anonymously</span>
                </span>
              </label>
              <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                “Your identity will be hidden from responders. Campus Operations may still use the report to coordinate the response.”
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-2 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Next: Review your report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — REVIEW */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 animate-fade-in">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Review your report
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Please verify details before submitting to Campus Operations.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Category</span>
                <span className="font-extrabold text-slate-900">{category}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Location</span>
                <span className="font-extrabold text-slate-900">{location} {floorRoom ? `(${floorRoom})` : ''}</span>
              </div>

              <div className="pb-2.5 border-b border-slate-200">
                <span className="text-slate-500 font-semibold block mb-1">Details</span>
                <p className="font-medium text-slate-800 italic leading-relaxed">
                  "{text}"
                </p>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Evidence</span>
                <span className="font-bold text-slate-800">
                  {hasEvidence ? '1 attachment' : 'None'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Reporter</span>
                <span className={`font-bold ${isAnonymous ? 'text-brand-700' : 'text-slate-700'}`}>
                  {isAnonymous ? 'Anonymous' : `${studentProfile.name} (${studentProfile.studentId})`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Report...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 5 — SUBMISSION RESULT */}
        {step === 5 && submittedReport && (
          <div className="p-6 sm:p-8 space-y-6 text-center animate-fade-in">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Report received
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                CampusPulse is processing your report.
              </p>
            </div>

            {/* 5-Item Submission Result Checklist */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-emerald-700 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
                <span>Report received</span>
              </div>

              <div className="flex items-center gap-2.5 text-emerald-700 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
                <span>Incident analysis</span>
              </div>

              <div className="flex items-center gap-2.5 text-emerald-700 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
                <span>Response coordination</span>
              </div>

              <div className="flex items-center gap-2.5 text-brand-700 font-bold">
                <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] animate-pulse">●</span>
                <span>Responder response en route</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-400 font-medium">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[10px]">○</span>
                <span>Resolution</span>
              </div>
            </div>

            {/* Privacy-Safe Fusion / Creation Message */}
            <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-200/80 text-left text-xs space-y-1">
              <p className="font-extrabold text-brand-900">
                {wasFused
                  ? 'Your report has been connected to an active incident'
                  : 'A new incident has been created from your report.'}
              </p>
              <p className="text-brand-700 text-[11px] leading-relaxed">
                Campus first responders are coordinating response actions. You can track live updates in real time.
              </p>
            </div>

            {/* Navigation CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  if (createdIncidentId) {
                    setSelectedIncidentId(createdIncidentId);
                    setCurrentScreen('STUDENT_TRACKING');
                  } else {
                    setCurrentScreen('STUDENT_MY_REPORTS');
                  }
                }}
                className="w-full sm:flex-1 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Track My Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleReset}
                className="w-full sm:flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold transition-all cursor-pointer"
              >
                Submit Another Report
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Auth / Profile Modal */}
      <StudentAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onConfirm={() => setShowAuthModal(false)}
      />
    </div>
  );
};

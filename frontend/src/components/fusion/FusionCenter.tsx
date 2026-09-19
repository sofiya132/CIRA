import React, { useState } from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { PriorityBadge } from '../common/Badge';
import { 
  GitMerge, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  MapPin, 
  Clock, 
  Info, 
  ChevronDown, 
  ChevronUp,
  HeartPulse,
  UserCheck,
  ShieldAlert,
  Sparkles,
  Droplets,
  Layers
} from 'lucide-react';

export const FusionCenter: React.FC = () => {
  const { incidents, triggerMedicalDemo, isDemoRunning, demoProgressMessage, resetAllData } = useCampusPulse();

  const [activeStory, setActiveStory] = useState<'MEDICAL' | 'FACILITY'>('MEDICAL');
  const [isWhyConnectedOpen, setIsWhyConnectedOpen] = useState(false);
  const [simulationStep, setSimulationStep] = useState<number>(3); // 1, 2, 3 reports

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Incident Fusion
            </h1>
            <span className="text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-0.5 rounded-full">
              Signature Story
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            "Many signals becoming one coordinated response." Transforming fragmented human reports into one clear operational truth.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerMedicalDemo()}
            disabled={isDemoRunning}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Interactive Story Walkthrough</span>
          </button>
          <button
            onClick={resetAllData}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Reset Story State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Story Selector Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveStory('MEDICAL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeStory === 'MEDICAL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
          <span>Signature Medical Convergence (3 Reports &rarr; 1 Incident)</span>
        </button>

        <button
          onClick={() => setActiveStory('FACILITY')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeStory === 'FACILITY'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Droplets className="w-3.5 h-3.5 text-sky-500" />
          <span>Library Facility Leakage (2 Reports &rarr; 1 Incident)</span>
        </button>
      </div>

      {/* SIGNATURE STORY 1: MEDICAL EMERGENCY CONVERGENCE */}
      {activeStory === 'MEDICAL' && (
        <div className="space-y-6 animate-fade-in">
          {/* Interactive Step Slider for Hackathon Presentations */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Presentation Simulator Step
              </span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {simulationStep === 1 && 'Step 1: First isolated report logged'}
                {simulationStep === 2 && 'Step 2: Second related report detected & matched'}
                {simulationStep === 3 && 'Step 3: Three fragmented signals converge into 1 Master Critical Incident'}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map(st => (
                <button
                  key={st}
                  onClick={() => setSimulationStep(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    simulationStep === st
                      ? 'bg-brand-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 1 ? '1 Report' : st === 2 ? '2 Reports' : '3 Reports (Full Convergence)'}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN VISUAL CONVERGENCE STORY CANVAS */}
          <div className="bg-gradient-to-br from-indigo-50/60 via-white to-slate-50 rounded-3xl border border-brand-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
            {/* Top Status Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-indigo-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-md">
                  <GitMerge className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                    {simulationStep} Independent Human {simulationStep === 1 ? 'Report' : 'Reports'} &rarr; 1 Master Incident
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    CampusPulse automatically identifies related events without creating duplicate responder dispatches.
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Strong match detected
              </span>
            </div>

            {/* CONVERGENCE WORKFLOW */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Human Reports Stack */}
              <div className="lg:col-span-6 space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between px-1">
                  <span>Human Signals Received</span>
                  <span>Time</span>
                </div>

                {/* Report 1 */}
                <div className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-2xs hover:border-brand-300 transition-all text-xs relative">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                    <span className="font-bold text-slate-900">REPORT 01 &bull; Rohan Sharma (Student)</span>
                    <span className="font-mono text-[10px] text-slate-400">14:02</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 italic leading-relaxed">
                    "Someone collapsed near the basketball court."
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Basketball Court
                    </span>
                    <span className="text-rose-600 font-semibold bg-rose-50 px-2 py-0.2 rounded">
                      Unconscious reported
                    </span>
                  </div>
                </div>

                {/* Report 2 */}
                {simulationStep >= 2 && (
                  <div className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-2xs hover:border-brand-300 transition-all text-xs relative animate-fade-in">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                      <span className="font-bold text-slate-900">REPORT 02 &bull; Coach Marcus (Staff)</span>
                      <span className="font-mono text-[10px] text-slate-400">14:03</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 italic leading-relaxed">
                      "Unconscious person near the sports ground."
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        Sports Ground (Adjacent)
                      </span>
                      <span className="text-brand-700 font-semibold bg-brand-50 px-2 py-0.2 rounded">
                        Related reports detected
                      </span>
                    </div>
                  </div>
                )}

                {/* Report 3 */}
                {simulationStep >= 3 && (
                  <div className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-2xs hover:border-brand-300 transition-all text-xs relative animate-fade-in">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                      <span className="font-bold text-slate-900">REPORT 03 &bull; Spectator (Anonymous)</span>
                      <span className="font-mono text-[10px] text-slate-400">14:04</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 italic leading-relaxed">
                      "Medical emergency at the court."
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        Outdoor Court Area
                      </span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.2 rounded">
                        Strong match
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Center Convergence Visual Connector */}
              <div className="lg:col-span-1 hidden lg:flex flex-col items-center justify-center text-brand-600">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-brand-400 shadow-md flex items-center justify-center text-brand-600">
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider mt-1 text-brand-700">
                  FUSED
                </span>
              </div>

              {/* Right Column: Master Actionable Incident */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border-2 border-brand-400 shadow-lg relative">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider block">
                      ONE MASTER INCIDENT
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">#CP-1042</span>
                  </div>
                  <PriorityBadge priority="CRITICAL" size="md" />
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-rose-600" />
                    <span>Medical Emergency</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    <span>Basketball Court (Sports Complex)</span>
                  </p>
                </div>

                <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Signal Confidence:</span>
                    <span className="font-bold text-emerald-800">Strong match (93.5%)</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Connected Reports:</span>
                    <span className="font-bold text-brand-700">{simulationStep} reports consolidated</span>
                  </div>
                </div>

                {/* Recommended Responder Action Box */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Recommended Responder:
                  </span>
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs">
                    <div>
                      <p className="font-bold text-emerald-950">Campus Medical Response</p>
                      <p className="text-[11px] text-emerald-800">Arjun Kumar &bull; 120m away &bull; Available</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-1 rounded shadow-2xs">
                      Dispatched
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable Section: "Why were these reports connected?" */}
            <div className="mt-8 pt-4 border-t border-indigo-100">
              <button
                onClick={() => setIsWhyConnectedOpen(!isWhyConnectedOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors py-1 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Why were these reports connected?
                </span>
                {isWhyConnectedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {isWhyConnectedOpen && (
                <div className="mt-3 p-4 bg-white rounded-2xl border border-brand-200 text-xs space-y-3 animate-fade-in">
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    CampusPulse recognized that all 3 independent caller submissions describe the exact same real-world crisis event based on three human factors:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Same Location</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Basketball Court and Sports Ground areas correspond to the same outdoor athletic perimeter.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Same Time Window</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        All 3 reports were logged within 2 minutes of each other (14:02, 14:03, 14:04).
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Similar Description</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Each report highlights critical medical distress with collapsed/unconscious person keywords.
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic pt-1 text-center font-medium">
                    "Many signals becoming one coordinated response."
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STORY 2: LIBRARY FACILITY LEAKAGE */}
      {activeStory === 'FACILITY' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-br from-sky-50/60 via-white to-slate-50 rounded-3xl border border-sky-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-sky-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md">
                  <Droplets className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                    2 Facility Reports &rarr; 1 Maintenance Work Order (#CP-1035)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Preventing duplicate facility technicians dispatched to the same water leak.
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Consolidated
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Reports */}
              <div className="lg:col-span-6 space-y-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-bold text-slate-900">REPORT A &bull; Library Staff</span>
                    <span className="font-mono text-[10px]">08:15</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 italic">
                    "Water pouring from ceiling pipe onto carpet in Central Library Basement study nook."
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Central Library Basement
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-bold text-slate-900">REPORT B &bull; Elena Rostova (Student)</span>
                    <span className="font-mono text-[10px]">08:18</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 italic">
                    "Basement flooring flooded near archive section."
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Library Archives Level -1
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="lg:col-span-1 hidden lg:flex flex-col items-center justify-center text-sky-600">
                <ArrowRight className="w-6 h-6 stroke-[2.5]" />
              </div>

              {/* Master Result */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border-2 border-sky-400 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">MASTER WORK ORDER</span>
                  <PriorityBadge priority="MEDIUM" size="sm" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 mt-2">Water Pipe Leakage</h3>
                <p className="text-xs text-slate-600 mt-1">Central Library Basement &bull; David Chen (Facilities Tech 3) Dispatched</p>
                <div className="mt-3 bg-sky-50 p-2.5 rounded-lg border border-sky-100 text-[11px] text-sky-900 font-medium">
                  ✓ Staff and student reports unified into single valve shutoff dispatch.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

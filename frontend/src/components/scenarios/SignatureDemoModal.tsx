import React from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { Modal } from '../common/Modal';
import { Play, HeartPulse, Zap, GitMerge, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';

interface SignatureDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignatureDemoModal: React.FC<SignatureDemoModalProps> = ({ isOpen, onClose }) => {
  const { triggerMedicalDemo, triggerEscalationDemo, resetAllData, isDemoRunning } = useCampusPulse();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Interactive Hackathon Demonstration Deck"
      subtitle="1-Click signature stories for judges and evaluators"
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Story 1: Medical Fusion */}
        <div className="p-4 rounded-xl border border-brand-200 bg-brand-50/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-rose-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Signature Demo 1: Medical Emergency Fusion
              </h4>
            </div>
            <span className="text-[10px] font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded">
              3 Reports &rarr; 1 Incident
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Demonstrates 3 independent human inputs near the Basketball Court collapsing into one critical master event with explainable match reasons, automatic P1 priority, and EMT unit dispatch.
          </p>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500 font-medium">Duration: ~6 seconds</span>
            <button
              onClick={() => {
                triggerMedicalDemo();
                onClose();
              }}
              disabled={isDemoRunning}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Medical Fusion Demo</span>
            </button>
          </div>
        </div>

        {/* Story 2: Automated Escalation */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h4 className="text-sm font-bold text-slate-900">
                Signature Demo 2: AWS Step Function Escalation
              </h4>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
              Timeout &rarr; Supervisor Alert
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Demonstrates an unanswered electrical hazard whose 45s SLA timer breaches, triggering automated supervisor escalation, SMS notification to the Duty Chief, and real-time reassignment.
          </p>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500 font-medium">Duration: ~5 seconds</span>
            <button
              onClick={() => {
                triggerEscalationDemo();
                onClose();
              }}
              disabled={isDemoRunning}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Auto-Escalation Demo</span>
            </button>
          </div>
        </div>

        {/* Reset State */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => {
              resetAllData();
              onClose();
            }}
            className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Initial Baseline</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

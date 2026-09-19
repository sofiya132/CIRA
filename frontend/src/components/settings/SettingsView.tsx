import React from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { 
  Settings, 
  Cloud, 
  Database, 
  Zap, 
  Bell, 
  ShieldCheck, 
  Server,
  Layers,
  Code
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          System Configuration & Architecture
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Enterprise serverless campus safety engine powering CampusPulse.
        </p>
      </div>

      {/* AWS Cloud Architecture Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Cloud className="w-5 h-5 text-brand-600" />
          <h2 className="text-sm font-bold text-slate-900">
            AWS Cloud Microservices Topology
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Server className="w-4 h-4 text-orange-600" />
              Amazon Bedrock
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Quiet unstructured report extraction, intent parsing, and entity recognition.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Database className="w-4 h-4 text-blue-600" />
              Amazon DynamoDB
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Single-table schema storing reports, fused incidents, responders, and immutable audit logs.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Zap className="w-4 h-4 text-amber-500" />
              AWS Step Functions
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              State-machine timeouts orchestrating automatic supervisor escalation when responders don't acknowledge.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Bell className="w-4 h-4 text-rose-600" />
              Amazon SNS
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Multi-channel real-time notifications via SMS, push alerts, and mobile webhooks.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Amazon Cognito
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Role-based access control for Dispatchers, Responders, Students, and Duty Chiefs.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Layers className="w-4 h-4 text-purple-600" />
              AWS Amplify / CloudFront
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Global low-latency edge delivery for responsive mobile and tablet workspaces.
            </p>
          </div>
        </div>
      </div>

      {/* SLA & Timeout Thresholds Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Response SLA Timeout Limits
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-rose-700 block">Critical Priority (P1)</span>
            <p className="text-slate-500 mt-1">SLA Limit: <span className="font-mono font-bold text-slate-900">60 seconds</span></p>
            <p className="text-[10px] text-slate-400 mt-0.5">Escalates directly to Duty Chief</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-amber-700 block">High Priority (P2)</span>
            <p className="text-slate-500 mt-1">SLA Limit: <span className="font-mono font-bold text-slate-900">120 seconds</span></p>
            <p className="text-[10px] text-slate-400 mt-0.5">Escalates to Area Supervisor</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-sky-700 block">Medium Priority (P3)</span>
            <p className="text-slate-500 mt-1">SLA Limit: <span className="font-mono font-bold text-slate-900">300 seconds</span></p>
            <p className="text-[10px] text-slate-400 mt-0.5">Standard operational triage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

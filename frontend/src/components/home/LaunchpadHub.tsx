import React from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { 
  LayoutDashboard, 
  GitMerge, 
  Smartphone, 
  Radio, 
  Timer, 
  Map, 
  BarChart3, 
  Bell, 
  Users, 
  Settings, 
  ArrowRight, 
  HeartPulse, 
  Zap, 
  Shield, 
  Activity, 
  Play,
  CheckCircle2,
  Clock,
  Home,
  Send,
  LifeBuoy
} from 'lucide-react';

export const LaunchpadHub: React.FC = () => {
  const { 
    setCurrentScreen, 
    setActiveRole,
    incidents, 
    notifications, 
    triggerMedicalDemo, 
    triggerEscalationDemo, 
    isDemoRunning 
  } = useCampusPulse();

  const activeCount = incidents.filter(i => i.status !== 'RESOLVED').length;
  const criticalCount = incidents.filter(i => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleModuleClick = (modId: string) => {
    if (modId === 'STUDENT_HOME' || modId === 'STUDENT_REPORT') {
      setActiveRole('STUDENT');
      setCurrentScreen(modId);
    } else if (modId === 'RESPONDER') {
      setActiveRole('RESPONDER');
      setCurrentScreen('RESPONDER');
    } else {
      setActiveRole('DISPATCHER');
      setCurrentScreen(modId);
    }
  };

  const sections = [
    {
      sectionTitle: "1. Command & Incident Convergence Workspaces",
      sectionDescription: "Real-time crisis intelligence, incident fusion engine, and supervisor SLA escalation management.",
      modules: [
        {
          id: 'COMMAND',
          title: 'Operations Command Center',
          subtitle: 'Live incident feed, 6-question dossier, responder dispatch controls & campus map.',
          icon: LayoutDashboard,
          iconColor: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30',
          badge: `${activeCount} Active Incidents`,
          badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-700/60',
          highlight: true
        },
        {
          id: 'FUSION',
          title: 'Incident Fusion Story',
          subtitle: 'Signature visual convergence: 3 fragmented reports collapsing into 1 master incident.',
          icon: GitMerge,
          iconColor: 'text-brand-400 bg-brand-500/20 border-brand-500/30',
          badge: 'Signature Feature',
          badgeColor: 'bg-brand-950 text-brand-300 border-brand-700/60',
          highlight: true
        },
        {
          id: 'ESCALATION',
          title: 'Escalation & SLA Center',
          subtitle: 'AWS Step Functions state machine, active response timers & supervisor emergency paging.',
          icon: Timer,
          iconColor: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
          badge: 'Step Functions',
          badgeColor: 'bg-amber-950 text-amber-300 border-amber-700/60'
        }
      ]
    },
    {
      sectionTitle: "2. Student Community & Field Responder Portals",
      sectionDescription: "Clean student reporting & live tracking portal alongside tablet triage for first responders.",
      modules: [
        {
          id: 'STUDENT_HOME',
          title: 'Student Safety Portal',
          subtitle: 'Light-first student dashboard: Report incidents, track active reports, and access hotlines.',
          icon: Home,
          iconColor: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
          badge: 'Student Role',
          badgeColor: 'bg-blue-950 text-blue-300 border-blue-700/60'
        },
        {
          id: 'STUDENT_REPORT',
          title: 'Student Reporting Flow',
          subtitle: '4-step mobile wizard: What happened, Location confirmation, Details & Personal status tracking.',
          icon: Send,
          iconColor: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
          badge: '4-Step Flow',
          badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-700/60'
        },
        {
          id: 'RESPONDER',
          title: 'Responder Field Workspace',
          subtitle: 'Tablet touch-triage: Large tactile action buttons (Acknowledge, En Route, On Scene, Resolve).',
          icon: Radio,
          iconColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
          badge: 'Tablet Optimized',
          badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
        },
        {
          id: 'MAP',
          title: 'Tactical Campus Map',
          subtitle: 'Geospatial vector grounds, building safety zones, live incident pins & responder GPS tracking.',
          icon: Map,
          iconColor: 'text-teal-400 bg-teal-500/20 border-teal-500/30',
          badge: 'Interactive Map',
          badgeColor: 'bg-teal-950 text-teal-300 border-teal-700/60'
        }
      ]
    },
    {
      sectionTitle: "3. Intelligence, Fleet & Architecture",
      sectionDescription: "Operational telemetry, Amazon SNS dispatch logs, on-duty fleet roster, and AWS stack.",
      modules: [
        {
          id: 'ANALYTICS',
          title: 'Operations Analytics',
          subtitle: 'Restrained Recharts visualizations: Volume trends, MTTA response times, hotspots & categories.',
          icon: BarChart3,
          iconColor: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
          badge: 'Audit Telemetry',
          badgeColor: 'bg-purple-950 text-purple-300 border-purple-700/60'
        },
        {
          id: 'NOTIFICATIONS',
          title: 'Operational Dispatch Feed',
          subtitle: 'Real-time log of Amazon SNS SMS, mobile push alerts, and automated dispatch communications.',
          icon: Bell,
          iconColor: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
          badge: unreadCount > 0 ? `${unreadCount} Unread` : 'SNS Log',
          badgeColor: 'bg-amber-950 text-amber-300 border-amber-700/60'
        },
        {
          id: 'FLEET',
          title: 'Responder Fleet Management',
          subtitle: 'On-duty emergency units roster, verified certifications, live locations & direct radio call.',
          icon: Users,
          iconColor: 'text-sky-400 bg-sky-500/20 border-sky-500/30',
          badge: '4 Units On Duty',
          badgeColor: 'bg-sky-950 text-sky-300 border-sky-700/60'
        },
        {
          id: 'SETTINGS',
          title: 'System & Architecture',
          subtitle: 'Serverless AWS backend topology: Amazon Bedrock, DynamoDB, Step Functions, and SLA rules.',
          icon: Settings,
          iconColor: 'text-slate-400 bg-slate-500/20 border-slate-500/30',
          badge: 'AWS Stack',
          badgeColor: 'bg-slate-900 text-slate-300 border-slate-700/60'
        }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative z-10 animate-fade-in">
      {/* Hero Header on Home Page */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl text-xs text-white shadow-xl">
          <Shield className="w-4 h-4 text-brand-400" />
          <span className="font-extrabold tracking-wide uppercase">CAMPUSPULSE HOME</span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Operations Active
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
          One campus. One signal. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-300 via-indigo-200 to-white bg-clip-text text-transparent">
            One coordinated response.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-200/90 font-medium leading-relaxed drop-shadow-sm">
          Intelligent incident fusion and emergency response workspace for students, first responders, and campus operations commanders.
        </p>

        {/* 1-Click Signature Hackathon Demos Banner */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => triggerMedicalDemo()}
            disabled={isDemoRunning}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-700 hover:from-brand-500 hover:to-indigo-600 text-white text-xs font-bold shadow-xl border border-brand-400/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <HeartPulse className="w-4 h-4 text-rose-300" />
            <span>Launch Demo 1: Medical Fusion</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => triggerEscalationDemo()}
            disabled={isDemoRunning}
            className="px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-bold shadow-xl border border-slate-700/80 backdrop-blur-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Launch Demo 2: Auto-Escalation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Structured Dark-Theme Tabs Layout (Down below each other & adjacent to each other) */}
      <div className="space-y-8">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-3">
            {/* Category Section Header */}
            <div className="border-b border-white/20 pb-2 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 className="text-sm font-extrabold text-white tracking-wide uppercase drop-shadow-xs">
                  {section.sectionTitle}
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  {section.sectionDescription}
                </p>
              </div>
            </div>

            {/* Adjacent Grid of Dark-Theme Buttons */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${section.modules.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4`}>
              {section.modules.map(mod => {
                const Icon = mod.icon;
                return (
                  <button
                    key={mod.id}
                    onClick={() => handleModuleClick(mod.id)}
                    className="group text-left p-5 rounded-2xl bg-slate-950/85 hover:bg-slate-900/95 border border-slate-800/90 hover:border-brand-500/80 backdrop-blur-xl shadow-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-brand-900/30 flex flex-col justify-between cursor-pointer relative overflow-hidden"
                  >
                    {/* Top Row: Icon & Status Badge */}
                    <div className="flex items-start justify-between gap-2 w-full">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 ${mod.iconColor}`}>
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${mod.badgeColor}`}>
                        {mod.badge}
                      </span>
                    </div>

                    {/* Middle: Title & Subtitle */}
                    <div className="mt-4 flex-1">
                      <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors flex items-center justify-between">
                        <span>{mod.title}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                        {mod.subtitle}
                      </p>
                    </div>

                    {/* Bottom Action Footer: Only Arrow */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end text-xs text-slate-400 group-hover:text-white transition-colors w-full">
                      <div className="w-7 h-7 rounded-full bg-slate-900/90 group-hover:bg-brand-600 flex items-center justify-center text-slate-400 group-hover:text-white transition-all shadow-sm">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

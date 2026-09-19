import React from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { 
  LayoutDashboard, 
  GitMerge, 
  Radio, 
  Timer, 
  Map, 
  BarChart3, 
  Bell, 
  Users, 
  Settings,
  Home,
  Send,
  FileText,
  User,
  ShieldAlert,
  Activity,
  AlertTriangle,
  LifeBuoy,
  ListOrdered,
  Star,
  CheckCircle2
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { currentScreen, setCurrentScreen, activeRole, incidents, notifications, reports, studentProfile } = useCampusPulse();

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const activeIncidentsCount = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length;
  const criticalCount = incidents.filter(i => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const escalatedCount = incidents.filter(i => i.status === 'ESCALATED' || i.isEscalated).length;
  
  const studentReportsCount = reports.filter(r => 
    r.submitterId === studentProfile.studentId || 
    r.submitterName === studentProfile.name
  ).length;

  let navItems: {
    id: string;
    label: string;
    icon: any;
    highlight?: boolean;
    badge?: string | number;
    badgeColor?: string;
  }[] = [];

  if (activeRole === 'STUDENT') {
    navItems = [
      {
        id: 'STUDENT_HOME',
        label: 'Home',
        icon: Home,
        highlight: true
      },
      {
        id: 'STUDENT_REPORT',
        label: 'Report Incident',
        icon: Send,
        badge: 'Fast Flow',
        badgeColor: 'bg-brand-100 text-brand-700'
      },
      {
        id: 'STUDENT_MY_REPORTS',
        label: 'My Reports',
        icon: FileText,
        badge: studentReportsCount > 0 ? studentReportsCount : undefined,
        badgeColor: 'bg-blue-100 text-blue-700'
      },
      {
        id: 'STUDENT_NOTIFICATIONS',
        label: 'Notifications',
        icon: Bell,
        badge: unreadNotifs > 0 ? unreadNotifs : undefined,
        badgeColor: 'bg-amber-100 text-amber-700'
      },
      {
        id: 'STUDENT_HELP',
        label: 'Emergency Help',
        icon: ShieldAlert,
        badge: '🚨 Direct',
        badgeColor: 'bg-rose-100 text-rose-700 font-black'
      },
      {
        id: 'STUDENT_PROFILE',
        label: 'Profile',
        icon: User
      }
    ];
  } else if (activeRole === 'RESPONDER') {
    navItems = [
      {
        id: 'RESPONDER',
        label: 'My Assigned Incidents',
        icon: Radio,
        highlight: true,
        badge: activeIncidentsCount > 0 ? activeIncidentsCount : undefined,
        badgeColor: 'bg-emerald-100 text-emerald-800 font-bold'
      },
      {
        id: 'RESPONDER_ACTIVE',
        label: 'Active Response',
        icon: Activity
      },
      {
        id: 'NOTIFICATIONS',
        label: 'Notifications',
        icon: Bell,
        badge: unreadNotifs > 0 ? unreadNotifs : undefined,
        badgeColor: 'bg-amber-100 text-amber-700'
      },
      {
        id: 'RESPONDER_PROFILE',
        label: 'Profile',
        icon: User
      }
    ];
  } else if (activeRole === 'SUPERVISOR') {
    navItems = [
      {
        id: 'CHIEF_OVERVIEW',
        label: 'Operations Overview',
        icon: Star,
        highlight: true
      },
      {
        id: 'CHIEF_CRITICAL',
        label: 'Critical Incidents',
        icon: ShieldAlert,
        badge: criticalCount > 0 ? criticalCount : undefined,
        badgeColor: 'bg-rose-100 text-rose-700 font-black'
      },
      {
        id: 'ESCALATION',
        label: 'Escalations',
        icon: Timer,
        badge: escalatedCount > 0 ? `${escalatedCount} Active` : undefined,
        badgeColor: 'bg-amber-100 text-amber-700 font-bold'
      },
      {
        id: 'MAP',
        label: 'Campus Status',
        icon: Map
      },
      {
        id: 'FLEET',
        label: 'Resource Overview',
        icon: Users
      },
      {
        id: 'ANALYTICS',
        label: 'Analytics',
        icon: BarChart3
      },
      {
        id: 'NOTIFICATIONS',
        label: 'Notifications',
        icon: Bell
      },
      {
        id: 'CHIEF_PROFILE',
        label: 'Profile',
        icon: User
      }
    ];
  } else {
    // DISPATCHER
    navItems = [
      {
        id: 'COMMAND',
        label: 'Command Center',
        icon: LayoutDashboard,
        highlight: true,
        badge: activeIncidentsCount > 0 ? activeIncidentsCount : undefined,
        badgeColor: 'bg-indigo-100 text-indigo-700'
      },
      {
        id: 'COMMAND_QUEUE',
        label: 'Incident Queue',
        icon: ListOrdered
      },
      {
        id: 'FUSION',
        label: 'Fusion Center',
        icon: GitMerge,
        badge: 'Signature',
        badgeColor: 'bg-brand-100 text-brand-700'
      },
      {
        id: 'ESCALATION',
        label: 'Escalations',
        icon: Timer,
        badge: escalatedCount > 0 ? `${escalatedCount} SLA` : undefined,
        badgeColor: 'bg-amber-100 text-amber-700 font-bold'
      },
      {
        id: 'FLEET',
        label: 'Responder Fleet',
        icon: Users
      },
      {
        id: 'MAP',
        label: 'Tactical Map',
        icon: Map
      },
      {
        id: 'NOTIFICATIONS',
        label: 'Notifications',
        icon: Bell,
        badge: unreadNotifs > 0 ? unreadNotifs : undefined,
        badgeColor: 'bg-amber-100 text-amber-700'
      },
      {
        id: 'DISPATCHER_PROFILE',
        label: 'Profile',
        icon: User
      }
    ];
  }

  return (
    <nav className="bg-white/85 backdrop-blur-xl border-b border-white/50 sticky top-16 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between gap-1 sm:gap-2 py-2 w-full overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = 
              currentScreen === item.id || 
              (item.id === 'STUDENT_REPORT' && currentScreen === 'STUDENT') ||
              (item.id === 'COMMAND' && currentScreen === 'HOME' && activeRole === 'DISPATCHER') ||
              (item.id === 'CHIEF_OVERVIEW' && currentScreen === 'HOME' && activeRole === 'SUPERVISOR');

            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`flex-1 min-w-fit flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-center ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-brand-600' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

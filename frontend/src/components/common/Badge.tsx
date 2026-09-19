import React from 'react';
import { PriorityLevel, IncidentStatus, IncidentCategory } from '../../types';
import { 
  HeartPulse, 
  Flame, 
  ShieldAlert, 
  Zap, 
  Droplets, 
  Package, 
  Building2, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Navigation2,
  Activity
} from 'lucide-react';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md', showDot = true }) => {
  const styles = {
    CRITICAL: 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]',
    HIGH: 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
    MEDIUM: 'bg-[#F0F9FF] text-[#075985] border-[#BAE6FD]',
    LOW: 'bg-[#F4F4F5] text-[#3F3F46] border-[#E4E4E7]',
  }[priority] || 'bg-slate-100 text-slate-700 border-slate-200';

  const dotStyles = {
    CRITICAL: 'bg-[#EF4444] animate-pulse',
    HIGH: 'bg-[#F59E0B]',
    MEDIUM: 'bg-[#0EA5E9]',
    LOW: 'bg-[#71717A]',
  }[priority];

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 tracking-wider font-semibold',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-bold',
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border uppercase tracking-wide ${styles} ${sizeClasses}`}>
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${dotStyles}`} />}
      {priority}
    </span>
  );
};

interface StatusBadgeProps {
  status: IncidentStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'AWAITING_ACK':
        return {
          label: 'Awaiting Ack',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: Clock,
          iconClass: 'text-amber-600'
        };
      case 'ACKNOWLEDGED':
        return {
          label: 'Acknowledged',
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: Activity,
          iconClass: 'text-blue-600'
        };
      case 'EN_ROUTE':
        return {
          label: 'En Route',
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          icon: Navigation2,
          iconClass: 'text-indigo-600'
        };
      case 'ON_SCENE':
        return {
          label: 'On Scene',
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          icon: ShieldAlert,
          iconClass: 'text-purple-600'
        };
      case 'ESCALATED':
        return {
          label: 'Escalated',
          bg: 'bg-rose-50 text-rose-800 border-rose-300 font-bold',
          icon: AlertTriangle,
          iconClass: 'text-rose-600'
        };
      case 'RESOLVED':
        return {
          label: 'Resolved',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: CheckCircle2,
          iconClass: 'text-emerald-600'
        };
      case 'NEW':
      default:
        return {
          label: 'New Signal',
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: Clock,
          iconClass: 'text-slate-500'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const sizeClass = size === 'sm' ? 'text-[11px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  return (
    <span className={`inline-flex items-center gap-1 rounded-md border font-medium ${config.bg} ${sizeClass}`}>
      <Icon className={`w-3.5 h-3.5 ${config.iconClass}`} />
      <span>{config.label}</span>
    </span>
  );
};

export const CategoryIcon: React.FC<{ category: IncidentCategory; className?: string }> = ({ category, className = 'w-4 h-4' }) => {
  switch (category) {
    case 'MEDICAL':
      return <HeartPulse className={`${className} text-rose-600`} />;
    case 'FIRE':
      return <Flame className={`${className} text-orange-600`} />;
    case 'VIOLENCE':
      return <ShieldAlert className={`${className} text-red-600`} />;
    case 'ELECTRICAL':
      return <Zap className={`${className} text-amber-500`} />;
    case 'WATER':
      return <Droplets className={`${className} text-sky-600`} />;
    case 'LOST_ITEM':
      return <Package className={`${className} text-slate-600`} />;
    case 'FACILITY':
      return <Building2 className={`${className} text-indigo-600`} />;
    default:
      return <AlertTriangle className={`${className} text-slate-600`} />;
  }
};

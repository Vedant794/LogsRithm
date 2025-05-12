
import React from 'react';
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

type StatusType = 'success' | 'failure' | 'progress' | 'cancel' | 'waiting';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showLabel?: boolean;
}

export function StatusBadge({ status, className = '', showLabel = true }: StatusBadgeProps) {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: 'bg-devbeacons-success/20 text-devbeacons-success border-devbeacons-success/30',
      label: 'Success'
    },
    failure: {
      icon: XCircle,
      color: 'bg-devbeacons-error/20 text-devbeacons-error border-devbeacons-error/30',
      label: 'Failed'
    },
    progress: {
      icon: Clock,
      color: 'bg-devbeacons-primary/20 text-devbeacons-primary border-devbeacons-primary/30 animate-pulse-slow',
      label: 'In Progress'
    },
    cancel: {
      icon: XCircle,
      color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      label: 'Canceled'
    },
    waiting: {
      icon: Clock,
      color: 'bg-devbeacons-warning/20 text-devbeacons-warning border-devbeacons-warning/30',
      label: 'Waiting'
    }
  };

  const { icon: Icon, color, label } = statusConfig[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${color} ${className}`}>
      <Icon size={14} />
      {showLabel && <span className="text-xs font-medium">{label}</span>}
    </div>
  );
}

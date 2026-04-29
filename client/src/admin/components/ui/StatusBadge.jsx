import React from 'react';
import { CheckCircle, XCircle, Clock, Truck, Package, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const config = {
    pending: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
      label: 'Pending',
      icon: Clock,
      pulse: true
    },
    confirmed: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
      label: 'Confirmed',
      icon: CheckCircle
    },
    packed: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      dot: 'bg-purple-500',
      label: 'Packed',
      icon: Package
    },
    out_for_delivery: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      dot: 'bg-orange-500',
      label: 'Out for Delivery',
      icon: Truck,
      pulse: true
    },
    delivered: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      dot: 'bg-green-500',
      label: 'Delivered',
      icon: CheckCircle
    },
    cancelled: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      dot: 'bg-red-500',
      label: 'Cancelled',
      icon: XCircle
    },
    rx_pending: {
      bg: 'bg-pink-50',
      text: 'text-pink-700',
      dot: 'bg-pink-500',
      label: 'Rx Pending',
      icon: AlertCircle,
      pulse: true
    },
    verified: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      label: 'Verified',
      icon: CheckCircle
    },
    rejected: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      label: 'Rejected',
      icon: XCircle
    },
    online: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      dot: 'bg-green-500',
      label: 'Online',
      pulse: true
    },
    offline: {
      bg: 'bg-slate-100',
      text: 'text-slate-500',
      dot: 'bg-slate-400',
      label: 'Offline'
    }
  };

  const s = config[status] || config.pending;
  const Icon = s.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight whitespace-nowrap ${s.bg} ${s.text}`}>
      {s.dot ? (
        <div className="relative flex h-2 w-2">
          {s.pulse && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${s.dot}`}></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${s.dot}`}></span>
        </div>
      ) : (
        Icon && <Icon size={12} strokeWidth={3} />
      )}
      <span className="uppercase tracking-wider">{s.label}</span>
    </div>
  );
};

export default StatusBadge;

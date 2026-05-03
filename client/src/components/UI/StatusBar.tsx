import React from 'react';
import { useGameStore } from '../../store/gameStore';

const STATUS_CONFIG = {
  connecting: { dot: 'bg-yellow-400 animate-pulse', label: 'Connecting…', text: 'text-yellow-400' },
  connected: { dot: 'bg-emerald-400', label: 'Live', text: 'text-emerald-400' },
  disconnected: { dot: 'bg-red-400', label: 'Disconnected', text: 'text-red-400' },
  error: { dot: 'bg-red-500 animate-pulse', label: 'Connection error', text: 'text-red-400' },
} as const;

export default function StatusBar() {
  const status = useGameStore((s) => s.connectionStatus);
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
      <span className={`text-xs font-mono ${cfg.text}`}>{cfg.label}</span>
    </div>
  );
}

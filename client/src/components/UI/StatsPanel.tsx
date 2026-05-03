import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useUserStore } from '../../store/userStore';
import { claimedCount, claimedPercent, GRID_SIZE } from '../../utils/grid';

interface StatBlockProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

function StatBlock({ label, value, sub, accent }: StatBlockProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
        {label}
      </span>
      <span
        className={`text-xl font-bold font-mono leading-none ${
          accent ? 'text-brand-accent-glow' : 'text-white'
        }`}
      >
        {value}
      </span>
      {sub && <span className="text-[10px] text-slate-500 font-mono">{sub}</span>}
    </div>
  );
}

export default function StatsPanel() {
  const tiles = useGameStore((s) => s.tiles);
  const userId = useUserStore((s) => s.user?._id);

  const claimed = claimedCount(tiles);
  const pct = claimedPercent(tiles);
  const total = GRID_SIZE * GRID_SIZE;

  // Read live claims + rank from leaderboard (updates after every claim via socket)
  // instead of stale userStore value set at login time
  const { myLiveClaims, myRank } = useGameStore((s) => {
    if (!userId) return { myLiveClaims: 0, myRank: null };
    const idx = s.leaderboard.findIndex((e) => e._id === userId);
    return {
      myLiveClaims: idx !== -1 ? s.leaderboard[idx].totalClaims : 0,
      myRank: idx !== -1 ? idx + 1 : null,
    };
  });

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatBlock
        label="Tiles claimed"
        value={claimed.toLocaleString()}
        sub={`of ${total.toLocaleString()} total`}
      />
      <StatBlock
        label="Board fill"
        value={`${pct}%`}
        sub={`${total - claimed} remaining`}
      />
      <StatBlock
        label="Your claims"
        value={myLiveClaims}
        accent
      />
      <StatBlock
        label="Your rank"
        value={myRank ?? '—'}
        sub={myRank ? 'on leaderboard' : 'no claims yet'}
      />
    </div>
  );
}

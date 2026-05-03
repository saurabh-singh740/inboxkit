import React from 'react';
import { motion } from 'framer-motion';
import Grid from '../components/Grid/Grid';
import GridContainer from '../components/Grid/GridContainer';
import Leaderboard from '../components/UI/Leaderboard';
import StatusBar from '../components/UI/StatusBar';
import StatsPanel from '../components/UI/StatsPanel';
import { useSocket } from '../hooks/useSocket';
import { useGrid } from '../hooks/useGrid';
import { useUserStore } from '../store/userStore';
import { useGameStore } from '../store/gameStore';

export default function GamePage() {
  // Initialises the socket connection and returns the claim action
  const { claimTile } = useSocket();

  // REST fallback — loads grid if socket hasn't delivered it yet
  useGrid();

  const user = useUserStore((s) => s.user);
  const clearUser = useUserStore((s) => s.clearUser);
  const isLoading = useGameStore((s) => s.isLoading);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-screen bg-brand-900 text-white overflow-hidden"
    >
      {/* ── Top nav ──────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-brand-600/40 bg-brand-800/70 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold tracking-tight">
            Grid<span className="text-brand-accent-glow">Wars</span>
          </span>
          <StatusBar />
        </div>

        {/* Current user */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full ring-1 ring-white/20"
                style={{ backgroundColor: user.color }}
              />
              <span className="text-sm font-medium text-slate-300">{user.username}</span>
            </div>
          )}
          <button
            onClick={() => {
              clearUser();
              window.location.reload();
            }}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-mono"
          >
            ← Leave
          </button>
        </div>
      </header>

      {/* ── Main layout ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left sidebar ─────────────────────────────────────────────── */}
        <aside className="w-64 flex-shrink-0 flex flex-col gap-5 p-4 border-r border-brand-600/40 bg-brand-800/40 overflow-y-auto">
          {/* Stats */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
              Stats
            </h2>
            <StatsPanel />
          </section>

          <div className="border-t border-brand-600/30" />

          {/* Leaderboard */}
          <section className="flex-1 min-h-0">
            <Leaderboard />
          </section>
        </aside>

        {/* ── Grid area ────────────────────────────────────────────────── */}
        <main className="flex-1 p-4 overflow-hidden">
          <GridContainer>
            {isLoading ? (
              <div className="flex items-center justify-center" style={{ width: 749, height: 749 }}>
                <div className="w-10 h-10 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <Grid onClaim={claimTile} />
            )}
          </GridContainer>
        </main>

        {/* ── Right sidebar (future: player list, activity feed) ────────── */}
        <aside className="w-52 flex-shrink-0 flex flex-col gap-4 p-4 border-l border-brand-600/40 bg-brand-800/40">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            How to Play
          </h2>
          <ul className="space-y-3">
            {[
              { icon: '🖱️', text: 'Click any grey tile to claim it' },
              { icon: '🔄', text: 'Updates appear live for all players' },
              { icon: '🏆', text: 'Most tiles claimed wins' },
              { icon: '🔒', text: 'Claimed tiles cannot be taken back' },
              { icon: '⚡', text: 'First click wins on contested tiles' },
            ].map(({ icon, text }) => (
              <li key={text} className="flex items-start gap-2.5">
                <span className="text-base leading-none mt-0.5">{icon}</span>
                <span className="text-xs text-slate-400 leading-snug">{text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <p className="text-[10px] font-mono text-slate-600 leading-relaxed">
              Tile count: 50×50 = 2,500
              <br />
              Protocol: WebSocket (Socket.io)
              <br />
              DB: MongoDB (atomic claims)
            </p>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}

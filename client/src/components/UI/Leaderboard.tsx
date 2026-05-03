import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useUserStore } from '../../store/userStore';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const leaderboard = useGameStore((s) => s.leaderboard);
  const myId = useUserStore((s) => s.user?._id);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3 px-1">
        Leaderboard
      </h2>

      {leaderboard.length === 0 ? (
        <p className="text-xs text-slate-600 px-1 italic">No claims yet — be first!</p>
      ) : (
        <ol className="space-y-1 overflow-y-auto flex-1 pr-1">
          <AnimatePresence initial={false}>
            {leaderboard.map((entry, idx) => {
              const isMe = entry._id === myId;
              return (
                <motion.li
                  key={entry._id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2 }}
                  className={`
                    flex items-center gap-2 rounded-lg px-2.5 py-2
                    ${isMe
                      ? 'bg-brand-accent/15 border border-brand-accent/30'
                      : 'bg-brand-700/40 hover:bg-brand-700/70'
                    }
                    transition-colors
                  `}
                >
                  {/* Rank */}
                  <span className="text-sm w-5 text-center flex-shrink-0 font-mono">
                    {idx < 3 ? MEDALS[idx] : (
                      <span className="text-xs text-slate-500">{idx + 1}</span>
                    )}
                  </span>

                  {/* Color swatch */}
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-1 ring-white/20"
                    style={{ backgroundColor: entry.color }}
                  />

                  {/* Username */}
                  <span
                    className={`flex-1 text-xs font-medium truncate ${
                      isMe ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {entry.username}
                    {isMe && (
                      <span className="ml-1 text-brand-accent-glow text-[10px] font-mono">
                        (you)
                      </span>
                    )}
                  </span>

                  {/* Claim count */}
                  <span className="text-xs font-mono text-slate-400 flex-shrink-0">
                    {entry.totalClaims}
                  </span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      )}
    </div>
  );
}

import React, { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userApi } from '../../services/api';
import { useUserStore } from '../../store/userStore';

export default function JoinModal() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useUserStore((s) => s.setUser);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();

    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }
    if (trimmed.length > 20) {
      setError('Username must be at most 20 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = await userApi.getOrCreate(trimmed);
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/95 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md mx-4"
      >
        {/* Card */}
        <div className="bg-brand-800 border border-brand-600/50 rounded-2xl p-8 shadow-glow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-accent/15 border border-brand-accent/30 mb-4">
              <span className="text-2xl">⬛</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">GridWars</h1>
            <p className="mt-2 text-slate-400 text-sm">
              Claim tiles in real-time against live opponents
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2"
              >
                Choose your username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. GridMaster99"
                maxLength={20}
                autoFocus
                className="w-full bg-brand-700 border border-brand-600/70 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/50 transition-all font-mono"
              />
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 text-xs text-red-400"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="w-full py-3 rounded-xl font-semibold text-white bg-brand-accent hover:bg-brand-accent-dim disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-glow-sm hover:shadow-glow-md active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Joining…
                </span>
              ) : (
                'Enter the Grid'
              )}
            </button>
          </form>

          {/* Feature bullets */}
          <ul className="mt-6 space-y-2">
            {[
              '50×50 shared canvas — 2500 tiles',
              'Real-time updates via WebSocket',
              'First claim wins — race your opponents',
            ].map((text) => (
              <li key={text} className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-1 h-1 rounded-full bg-brand-accent flex-shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

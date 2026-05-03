import React from 'react';
import { AnimatePresence } from 'framer-motion';
import JoinModal from './components/UI/JoinModal';
import GamePage from './pages/GamePage';
import { useUserStore } from './store/userStore';

export default function App() {
  const isJoined = useUserStore((s) => s.isJoined);

  return (
    <AnimatePresence mode="wait">
      {isJoined ? <GamePage key="game" /> : <JoinModal key="join" />}
    </AnimatePresence>
  );
}

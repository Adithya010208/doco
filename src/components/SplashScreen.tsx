/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  key?: string | number;
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 300);
          return 100;
        }
        return prev + 4;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      id="splash-screen-container"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white select-none"
    >
      <div className="relative flex flex-col items-center max-w-sm w-full px-6 text-center">
        {/* Animated Background Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/20 blur-3xl rounded-full" />
        
        {/* Beating Medical Pulse Ring */}
        <motion.div
          id="splash-logo-ring"
          animate={{
            scale: [1, 1.08, 1],
            borderColor: ['rgba(59,130,246,0.3)', 'rgba(59,130,246,0.8)', 'rgba(59,130,246,0.3)']
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut'
          }}
          className="relative flex items-center justify-center w-24 h-24 rounded-full border-2 border-blue-500/30 bg-slate-900/80 shadow-2xl mb-6"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'easeInOut',
              delay: 0.15
            }}
          >
            <Activity className="w-12 h-12 text-blue-400" />
          </motion.div>
          
          <div className="absolute -bottom-1 -right-1 bg-blue-600 text-slate-950 p-1.5 rounded-full border border-slate-950 shadow-lg">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          id="splash-title"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-300 font-sans"
        >
          DOCO
        </motion.h1>

        <motion.p
          id="splash-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-slate-400 text-sm tracking-widest uppercase font-semibold mt-1 mb-8"
        >
          Clinician Portal
        </motion.p>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden p-[1px] border border-slate-700/50 backdrop-blur-sm">
          <motion.div
            id="splash-progress-bar"
            className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 h-full rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        {/* Dynamic Status Text */}
        <motion.span
          id="splash-status-text"
          className="text-slate-500 text-xs font-mono tracking-wider mt-3"
        >
          {progress < 30 && 'Connecting securely...'}
          {progress >= 30 && progress < 70 && 'Syncing patient charts...'}
          {progress >= 70 && progress < 100 && 'Decrypting medical ledger...'}
          {progress === 100 && 'Session ready'}
        </motion.span>
      </div>
    </motion.div>
  );
}

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';

export const GlobalLoader: React.FC = () => {
  const { isGlobalLoading } = useStore();

  return (
    <AnimatePresence>
      {isGlobalLoading && (
        <motion.div
          id="global-page-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] bg-[#F5E6D3] flex flex-col items-center justify-center pointer-events-auto"
        >
          <div className="flex flex-col items-center select-none">
            {/* Minimal glowing ring & Brand Typography */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl font-serif tracking-[0.35em] text-[#4A382D] font-normal uppercase leading-tight">
                OW<span className="font-light italic tracking-normal">N</span>ONCE
              </h1>
              <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.5em] text-[#82756c] uppercase mt-2">
                WOMENSWEAR
              </p>
            </motion.div>

            {/* Elegant Minimal Accent Bar */}
            <div className="mt-8 w-28 h-[1.5px] bg-[#d4c3b9] relative overflow-hidden rounded-full">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 1.6,
                  ease: 'easeInOut',
                }}
                className="w-full h-full bg-[#A98265]"
              />
            </div>
            
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-[11px] font-sans text-[#82756c] tracking-widest uppercase mt-4"
            >
              Curating Elegance...
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

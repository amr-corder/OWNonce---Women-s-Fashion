import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, RotateCcw, Truck, Package, ShieldCheck, MapPin, Sparkles, Navigation } from 'lucide-react';

interface DeliveryVehicleAnimationProps {
  orderNumber?: string;
  governorate?: string;
  onAnimationComplete?: () => void;
}

export const DeliveryVehicleAnimation: React.FC<DeliveryVehicleAnimationProps> = ({
  orderNumber = 'OW-8942',
  governorate = 'Your Address',
  onAnimationComplete,
}) => {
  // Phase 1: Arrive & Stop -> Phase 2: Open Cargo & Load Parcel -> Phase 3: Fast Cruise / Driving on Road
  const [phase, setPhase] = useState<'loading' | 'driving' | 'completed'>('loading');
  const [stepText, setStepText] = useState('Preparing Courier Vehicle...');
  const [replayCount, setReplayCount] = useState(0);

  useEffect(() => {
    setPhase('loading');
    setStepText('Dispatching OWNonce Courier Fleet...');

    const t1 = setTimeout(() => {
      setStepText('Securing & Loading Custom Parcel into Cargo...');
    }, 1200);

    const t2 = setTimeout(() => {
      setPhase('driving');
      setStepText(`Cruising on Express Highway towards ${governorate}...`);
    }, 2800);

    const t3 = setTimeout(() => {
      setPhase('completed');
      setStepText('Parcel in Fast Transit to Customer');
      if (onAnimationComplete) onAnimationComplete();
    }, 6500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [replayCount, governorate, onAnimationComplete]);

  const handleRestart = () => {
    setReplayCount((c) => c + 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-2 sm:px-4 flex flex-col items-center justify-center text-center">
      {/* Visual Animation Stage */}
      <div className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-[#F5E6D3]/70 via-[#FAF7F2] to-[#EBD5BE] dark:from-[#1A130E] dark:via-[#1D1612] dark:to-[#120D0A] border-2 border-[#d4c3b9] dark:border-[#3D3027] rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between p-4 transition-colors">
        
        {/* Top Sky Elements: Sun/Moon, Clouds & Live Badge */}
        <div className="flex items-center justify-between w-full z-10">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#FFFDF9]/90 dark:bg-[#271C15]/90 backdrop-blur-xs border border-[#d4c3b9] dark:border-[#3D3027] rounded-full shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono font-bold text-[#77553b] dark:text-[#E6D0BA]">
              #{orderNumber}
            </span>
          </div>

          {/* Phase Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#B89578]/20 dark:bg-[#B89578]/30 border border-[#B89578]/40 rounded-full text-[11px] font-semibold text-[#5C3F2B] dark:text-[#F0E6DC]">
            {phase === 'driving' ? (
              <Navigation className="w-3 h-3 text-[#B89578] animate-spin" />
            ) : phase === 'completed' ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            ) : (
              <Package className="w-3 h-3 text-[#77553b] dark:text-[#C8A882]" />
            )}
            <span>{stepText}</span>
          </div>

          <button
            onClick={handleRestart}
            className="p-1.5 bg-[#FFFDF9]/90 dark:bg-[#271C15]/90 hover:bg-[#B89578] hover:text-white dark:hover:bg-[#B89578] text-[#77553b] dark:text-[#C8A882] border border-[#d4c3b9] dark:border-[#3D3027] rounded-full transition-all cursor-pointer shadow-xs"
            title="Replay Delivery Animation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Animated Background Landscape (City / Hills Outline) */}
        <div className="absolute inset-x-0 bottom-14 h-24 overflow-hidden pointer-events-none opacity-30 dark:opacity-20">
          <div className="flex w-[200%] animate-[marquee_15s_linear_infinite]">
            <svg className="w-full h-full" viewBox="0 0 1000 80" preserveAspectRatio="none" fill="currentColor">
              <path d="M0 80 L0 50 Q100 20 200 50 T400 50 T600 30 T800 60 T1000 40 L1000 80 Z" className="text-[#A98265]" />
            </svg>
            <svg className="w-full h-full" viewBox="0 0 1000 80" preserveAspectRatio="none" fill="currentColor">
              <path d="M0 80 L0 50 Q100 20 200 50 T400 50 T600 30 T800 60 T1000 40 L1000 80 Z" className="text-[#A98265]" />
            </svg>
          </div>
        </div>

        {/* Center Stage: The OWNonce Express Van */}
        <div className="relative w-full h-36 flex items-center justify-center z-10">
          {/* Road Surface */}
          <div className="absolute bottom-2 inset-x-0 h-10 bg-[#3A2C23] dark:bg-[#140E0A] rounded-lg shadow-inner flex items-center justify-center overflow-hidden border-t-2 border-[#77553b] dark:border-[#503A2B]">
            {/* Animated Road Stripes */}
            <div className={`flex w-[200%] ${phase === 'driving' ? 'animate-[marquee_0.8s_linear_infinite]' : 'animate-[marquee_2.5s_linear_infinite]'}`}>
              <div className="w-full flex justify-around">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-10 h-1.5 bg-[#F5E6D3] dark:bg-[#A98265] rounded-full shadow-xs" />
                ))}
              </div>
              <div className="w-full flex justify-around">
                {[...Array(8)].map((_, i) => (
                  <div key={`dup-${i}`} className="w-10 h-1.5 bg-[#F5E6D3] dark:bg-[#A98265] rounded-full shadow-xs" />
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Van Body */}
          <motion.div
            key={`van-${replayCount}`}
            initial={{ x: '-120%', y: 0 }}
            animate={
              phase === 'loading'
                ? { x: 0, y: [0, -1, 0] }
                : phase === 'driving'
                ? { x: [0, 8, -4, 0], y: [0, -2, 0, -1, 0] }
                : { x: 0, y: 0 }
            }
            transition={
              phase === 'loading'
                ? { duration: 1, ease: 'easeOut' }
                : { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
            }
            className="relative z-20 flex items-center justify-center -mb-2"
          >
            {/* Speed Lines during Driving */}
            {phase === 'driving' && (
              <div className="absolute -left-12 top-4 space-y-2 pointer-events-none">
                <motion.div
                  animate={{ x: [-10, -40], opacity: [1, 0] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                  className="w-8 h-0.5 bg-[#B89578] rounded-full"
                />
                <motion.div
                  animate={{ x: [-5, -30], opacity: [0.8, 0] }}
                  transition={{ duration: 0.3, repeat: Infinity, delay: 0.1 }}
                  className="w-6 h-0.5 bg-[#A98265] rounded-full"
                />
                <motion.div
                  animate={{ x: [-15, -45], opacity: [0.9, 0] }}
                  transition={{ duration: 0.35, repeat: Infinity, delay: 0.2 }}
                  className="w-10 h-0.5 bg-[#B89578] rounded-full"
                />
              </div>
            )}

            {/* Custom High-Fidelity OWNonce Van Vector */}
            <svg
              width="240"
              height="120"
              viewBox="0 0 240 120"
              className="drop-shadow-xl"
            >
              {/* Van Body Main */}
              <rect x="25" y="24" width="145" height="66" rx="6" fill="#8C684D" />
              {/* Van Cab Front */}
              <path d="M170 42 L205 42 L222 66 L222 90 L170 90 Z" fill="#75533A" />
              
              {/* Front Bumper & Grill */}
              <rect x="216" y="74" width="8" height="14" rx="2" fill="#3A281D" />
              {/* Headlight with Glowing Beam */}
              <path d="M220 70 L224 74 L220 78 Z" fill="#FDE047" />
              {phase === 'driving' && (
                <polygon points="224,70 260,60 260,95 224,78" fill="#FDE047" opacity="0.25" />
              )}

              {/* Windshield */}
              <path d="M175 46 L202 46 L216 66 L175 66 Z" fill="#EAE5DC" opacity="0.95" />
              {/* Side Window */}
              <rect x="135" y="32" width="28" height="22" rx="3" fill="#D5CBC0" opacity="0.8" />

              {/* OWNonce Branding Banner on Van */}
              <rect x="35" y="36" width="90" height="38" rx="4" fill="#241912" />
              <text
                x="80"
                y="54"
                fill="#F5E6D3"
                fontFamily="serif"
                fontSize="11"
                fontWeight="900"
                letterSpacing="2.5"
                textAnchor="middle"
              >
                OWNONCE
              </text>
              <text
                x="80"
                y="67"
                fill="#B89578"
                fontFamily="sans-serif"
                fontSize="6"
                fontWeight="700"
                letterSpacing="2"
                textAnchor="middle"
              >
                EXPRESS FLEET
              </text>

              {/* Wheels Background wells */}
              <circle cx="65" cy="90" r="18" fill="#1E140E" />
              <circle cx="185" cy="90" r="18" fill="#1E140E" />

              {/* Alloy Wheels with Animated Spinning Spokes */}
              <g className={phase === 'driving' ? 'animate-spin origin-[65px_90px]' : ''}>
                <circle cx="65" cy="90" r="14" fill="#2A1E16" stroke="#B89578" strokeWidth="2" />
                <circle cx="65" cy="90" r="5" fill="#EAE5DC" />
                <line x1="65" y1="76" x2="65" y2="104" stroke="#B89578" strokeWidth="2" />
                <line x1="51" y1="90" x2="79" y2="90" stroke="#B89578" strokeWidth="2" />
              </g>

              <g className={phase === 'driving' ? 'animate-spin origin-[185px_90px]' : ''}>
                <circle cx="185" cy="90" r="14" fill="#2A1E16" stroke="#B89578" strokeWidth="2" />
                <circle cx="185" cy="90" r="5" fill="#EAE5DC" />
                <line x1="185" y1="76" x2="185" y2="104" stroke="#B89578" strokeWidth="2" />
                <line x1="171" y1="90" x2="199" y2="90" stroke="#B89578" strokeWidth="2" />
              </g>

              {/* Rear Door Handle */}
              <rect x="27" y="52" width="3" height="12" rx="1" fill="#D5CBC0" />
            </svg>

            {/* Luxury Package Icon Loading Animation */}
            <AnimatePresence>
              {phase === 'loading' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.3, x: -80, y: -20 }}
                  animate={{ opacity: 1, scale: 1, x: -30, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, x: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="absolute -top-2 left-6 p-2 bg-[#F5E6D3] dark:bg-[#3D2C21] border-2 border-[#77553b] rounded-lg shadow-xl flex items-center gap-1 z-30"
                >
                  <Package className="w-4 h-4 text-[#77553b] dark:text-[#E6D0BA]" />
                  <span className="text-[9px] font-serif font-bold text-[#77553b] dark:text-[#E6D0BA]">
                    OWN Parcel
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom Delivery Highway Details & Checkpoints */}
        <div className="flex items-center justify-between pt-1 border-t border-[#d4c3b9]/50 dark:border-[#3D3027] text-[11px] text-[#77553b] dark:text-[#C8A882] z-10">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#B89578]" />
            <span className="font-semibold">From: Cairo Hub</span>
            <span className="text-[#82756C] dark:text-[#AD9E92]">➔</span>
            <span className="font-semibold text-[#27180F] dark:text-[#FFFDF9]">{governorate}</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3 h-3" />
            <span>Guaranteed Express Transit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

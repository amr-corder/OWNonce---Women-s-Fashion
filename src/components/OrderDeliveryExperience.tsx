import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, MessageCircle, ArrowRight, Sparkles, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Order, StoreSettings } from '../types';

interface OrderDeliveryExperienceProps {
  order?: Order;
  orderNumber: string;
  settings: StoreSettings;
}

export const OrderDeliveryExperience: React.FC<OrderDeliveryExperienceProps> = ({
  order,
  orderNumber,
  settings,
}) => {
  const [copiedOrderId, setCopiedOrderId] = useState<boolean>(false);

  const handleCopyOrderId = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };
  // Sequence Stages:
  // 1: Small elegant delivery vehicle appears on screen (0s - 1.2s)
  // 2: Vehicle moves into position & settles (1.2s - 2.2s)
  // 3: Rear cargo door opens smoothly (2.2s - 3.2s)
  // 4: Package representing customer's order appears behind vehicle (3.2s - 4.2s)
  // 5: Package smoothly moves into open cargo compartment (4.2s - 5.4s)
  // 6: Cargo door closes firmly & locks with spark (5.4s - 6.6s)
  // 7: Vehicle starts moving forward & drives away smoothly exiting screen (6.6s - 8.2s)
  // 8: After vehicle leaves -> display the order success message & confirmation card (> 8.2s)
  const [stage, setStage] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [replayCount, setReplayCount] = useState<number>(0);

  useEffect(() => {
    setStage(1);
    setIsCompleted(false);

    const t1 = setTimeout(() => setStage(2), 1200); // 2: Settled in position
    const t2 = setTimeout(() => setStage(3), 2200); // 3: Door opens
    const t3 = setTimeout(() => setStage(4), 3200); // 4: Package appears behind
    const t4 = setTimeout(() => setStage(5), 4200); // 5: Package moves into cargo
    const t5 = setTimeout(() => setStage(6), 5400); // 6: Door closes
    const t6 = setTimeout(() => setStage(7), 6600); // 7: Starts moving forward & exits screen
    const t7 = setTimeout(() => {
      setStage(8);
      setIsCompleted(true); // 8 & 9: Vehicle has left screen -> reveal success message
    }, 8200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
    };
  }, [replayCount]);

  const handleReplay = () => {
    setReplayCount((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* 1. ANIMATION STAGE CANVAS (Soft Beige Background, Coffee Toned Details) */}
      <div className="relative w-full h-84 sm:h-96 bg-[#FDFBF7] dark:bg-[#1A1410] border border-[#E8DEC8] dark:border-[#382C24] rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between p-6 transition-all select-none">
        
        {/* Soft Ambient Background Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-60 dark:opacity-30">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#F3E5D4] dark:bg-[#2F2119] rounded-full blur-3xl" />
          <div className="absolute top-8 left-10 text-[#C9A98E] opacity-70 text-xs">✦</div>
          <div className="absolute top-12 right-14 text-[#C9A98E] opacity-50 text-base">✧</div>
          <div className="absolute top-24 left-1/3 text-[#C9A98E] opacity-40 text-xs">✦</div>
        </div>

        {/* Top Header Badge during animation */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#FFFDF9]/90 dark:bg-[#2A1E18]/90 border border-[#E8DEC8] dark:border-[#423329] rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#B89578] animate-ping" />
            <span className="text-[11px] font-mono font-medium text-[#6B4F3A] dark:text-[#E8DACB]">
              Order #{orderNumber}
            </span>
          </div>

          <span className="text-[11px] font-serif italic text-[#8F7969] dark:text-[#BFAFA3]">
            {stage === 1 && 'Delivery vehicle arriving...'}
            {stage === 2 && 'Vehicle in position'}
            {stage === 3 && 'Opening cargo door...'}
            {stage === 4 && 'Customer parcel prepared...'}
            {stage === 5 && 'Moving package into cargo compartment...'}
            {stage === 6 && 'Cargo door secured & closed'}
            {stage === 7 && 'Vehicle departing...'}
            {stage === 8 && 'Dispatched successfully'}
          </span>
        </div>

        {/* Center Animated Scene */}
        <div className="relative w-full h-44 flex items-center justify-center overflow-visible">
          {/* Ground / Road Line */}
          <div className="absolute bottom-5 inset-x-4 h-0.5 bg-[#D8C7B5] dark:bg-[#47372D] rounded-full">
            <div className="w-full h-full flex justify-between px-6 opacity-40">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-1.5 h-0.5 bg-[#8C6B50]" />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {stage < 8 ? (
              <motion.div
                key={`animation-stage-${replayCount}`}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* 2. THE PACKAGE (Appears behind vehicle, then glides in smoothly) */}
                <AnimatePresence>
                  {(stage === 4 || stage === 5) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.4, x: -140, y: -18, rotate: -6 }}
                      animate={
                        stage === 4
                          ? { opacity: 1, scale: 1, x: -100, y: 0, rotate: 0 }
                          : { opacity: [1, 1, 0.3, 0], scale: [1, 0.9, 0.7, 0.4], x: [-100, -55, -20, -15], y: [0, 0, 0, 0], rotate: 0 }
                      }
                      exit={{ opacity: 0, scale: 0.3 }}
                      transition={
                        stage === 4
                          ? { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
                          : { duration: 1.1, ease: 'easeInOut' }
                      }
                      className="absolute z-20 flex flex-col items-center pointer-events-none drop-shadow-md"
                    >
                      {/* Luxury Package Box */}
                      <div className="w-14 h-12 bg-linear-to-br from-[#FFFDF9] to-[#F1E5D5] border border-[#B89578] rounded-md shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Ribbon */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2.5 bg-[#B89578]/40 border-y border-[#A07855]" />
                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2.5 bg-[#B89578]/40 border-x border-[#A07855]" />
                        {/* Bow on top */}
                        <div className="w-3 h-1.5 bg-[#A07855] rounded-full -mt-4 z-10 shadow-xs" />
                        <span className="text-[7px] font-serif font-black tracking-widest text-[#523A28] z-10 mt-1">
                          OWN
                        </span>
                      </div>
                      {/* Package shadow */}
                      <div className="w-12 h-2 bg-[#423124]/20 dark:bg-black/40 rounded-full blur-xs mt-1" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 3. THE VEHICLE CONTAINER (Coffee colored, elegant minimal illustration) */}
                <motion.div
                  initial={{ x: '-160%', opacity: 0 }}
                  animate={
                    stage === 1
                      ? { x: '-160%', opacity: 1 }
                      : stage >= 2 && stage <= 6
                      ? { 
                          x: '0%', 
                          opacity: 1,
                          y: stage === 5 ? [0, 2, -1, 0] : [0, -1, 0], // subtle response when package enters
                        }
                      : { x: '170%', opacity: 1 } // stage 7: vehicle smoothly drives away and exits screen
                  }
                  transition={
                    stage === 1
                      ? { duration: 0 }
                      : stage === 2
                      ? { duration: 1.2, ease: [0.25, 1, 0.5, 1] }
                      : stage === 7
                      ? { duration: 1.5, ease: [0.4, 0, 0.2, 1] } // gentle acceleration exit
                      : { duration: 0.4, ease: 'easeInOut' }
                  }
                  className="relative z-30 flex items-center justify-center"
                >
                  {/* Delivery Vehicle Vector */}
                  <svg
                    width="230"
                    height="115"
                    viewBox="0 0 230 115"
                    className="drop-shadow-lg overflow-visible"
                  >
                    <defs>
                      <linearGradient id="vanBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7A583E" />
                        <stop offset="100%" stopColor="#5E3F28" />
                      </linearGradient>
                      <linearGradient id="vanCabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6C4A31" />
                        <stop offset="100%" stopColor="#4F331F" />
                      </linearGradient>
                    </defs>

                    {/* Vehicle Shadow on ground */}
                    <ellipse cx="115" cy="100" rx="95" ry="7" fill="#2E1F14" opacity="0.25" />

                    {/* Main Cargo Compartment */}
                    <rect x="22" y="24" width="136" height="66" rx="8" fill="url(#vanBodyGrad)" stroke="#4A2F1A" strokeWidth="1.5" />

                    {/* Cargo Interior View when Door is Open */}
                    <rect x="23" y="28" width="22" height="58" rx="4" fill="#2A1B11" />
                    <line x1="34" y1="32" x2="34" y2="82" stroke="#4A3423" strokeWidth="1.5" strokeDasharray="2 2" />

                    {/* Rear Cargo Door Animation */}
                    <motion.g
                      animate={
                        stage >= 3 && stage <= 5
                          ? { scaleX: 0.15, x: -14, opacity: 0.95 } // swung open smoothly
                          : { scaleX: 1, x: 0, opacity: 1 } // closed
                      }
                      transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                      style={{ originX: '22px' }}
                    >
                      <rect x="20" y="24" width="18" height="66" rx="5" fill="#8F6B4E" stroke="#4A2F1A" strokeWidth="1.5" />
                      {/* Door Handle */}
                      <rect x="24" y="54" width="3" height="12" rx="1.5" fill="#EBD6C3" />
                      <circle cx="25.5" cy="60" r="1.5" fill="#5E3F28" />
                    </motion.g>

                    {/* Sparkle effect when door closes & locks in stage 6 */}
                    {stage === 6 && (
                      <g>
                        <circle cx="25" cy="58" r="8" fill="#FCE794" opacity="0.4" />
                        <circle cx="25" cy="58" r="4" fill="#FFFDF9" />
                      </g>
                    )}

                    {/* Cab (Front) Section */}
                    <path
                      d="M158 42 L192 42 Q208 44 214 62 L214 90 L158 90 Z"
                      fill="url(#vanCabGrad)"
                      stroke="#4A2F1A"
                      strokeWidth="1.5"
                    />

                    {/* Front Bumper & Chrome Grill */}
                    <rect x="208" y="74" width="8" height="14" rx="3" fill="#D8C7B5" stroke="#4A2F1A" strokeWidth="1" />
                    
                    {/* Headlight */}
                    <path d="M211 68 L215 72 L211 76 Z" fill="#FCE794" stroke="#D4A836" strokeWidth="1" />
                    {stage === 7 && (
                      <polygon points="215,68 250,56 250,88 215,76" fill="#FCE794" opacity="0.25" />
                    )}

                    {/* Windshield */}
                    <path
                      d="M164 45 L190 45 Q200 48 206 64 L164 64 Z"
                      fill="#FAF4EB"
                      opacity="0.9"
                      stroke="#4A2F1A"
                      strokeWidth="1"
                    />
                    <line x1="172" y1="48" x2="198" y2="60" stroke="#FFFDF9" strokeWidth="1.5" strokeLinecap="round" />

                    {/* Side Door & Handle */}
                    <rect x="132" y="32" width="24" height="24" rx="3" fill="#FAF4EB" opacity="0.8" />
                    <rect x="134" y="66" width="6" height="2" rx="1" fill="#D8C7B5" />

                    {/* OWNonce Luxury Brand Plate on Cargo Body */}
                    <rect x="42" y="38" width="84" height="36" rx="4" fill="#1C120A" stroke="#B89578" strokeWidth="1" />
                    <text
                      x="84"
                      y="54"
                      fill="#FAF6F0"
                      fontFamily="serif"
                      fontSize="10.5"
                      fontWeight="bold"
                      letterSpacing="2.5"
                      textAnchor="middle"
                    >
                      OWNONCE
                    </text>
                    <text
                      x="84"
                      y="66"
                      fill="#C9A98E"
                      fontFamily="sans-serif"
                      fontSize="5.5"
                      fontWeight="600"
                      letterSpacing="2"
                      textAnchor="middle"
                    >
                      EXPRESS COURIER
                    </text>

                    {/* Wheel Well Arches */}
                    <path d="M44 90 A18 18 0 0 1 80 90 Z" fill="#2E1F14" />
                    <path d="M162 90 A18 18 0 0 1 198 90 Z" fill="#2E1F14" />

                    {/* Rear Wheel */}
                    <g className={stage === 1 || stage === 7 ? 'animate-spin origin-[62px_90px]' : ''}>
                      <circle cx="62" cy="90" r="14" fill="#1C120A" stroke="#3A271B" strokeWidth="2" />
                      <circle cx="62" cy="90" r="8" fill="#D8C7B5" />
                      <circle cx="62" cy="90" r="3" fill="#5E3F28" />
                    </g>

                    {/* Front Wheel */}
                    <g className={stage === 1 || stage === 7 ? 'animate-spin origin-[180px_90px]' : ''}>
                      <circle cx="180" cy="90" r="14" fill="#1C120A" stroke="#3A271B" strokeWidth="2" />
                      <circle cx="180" cy="90" r="8" fill="#D8C7B5" />
                      <circle cx="180" cy="90" r="3" fill="#5E3F28" />
                    </g>
                  </svg>
                </motion.div>
              </motion.div>
            ) : (
              /* 4. POST-EXIT STATE IN STAGE CANVAS */
              <motion.div
                key="complete-banner"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center text-center z-20 space-y-1.5"
              >
                <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#B89578] font-bold">
                  Dispatched
                </span>
                <h4 className="font-serif font-bold text-base sm:text-lg text-[#27180F] dark:text-[#FAF6F0]">
                  Courier En Route to Destination
                </h4>
                <button
                  onClick={handleReplay}
                  className="mt-1 text-[11px] font-sans font-medium text-[#8F6B4E] dark:text-[#D1B198] hover:underline cursor-pointer flex items-center gap-1"
                >
                  ↺ Replay delivery animation
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Destination Tracker bar */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-[#7A6759] dark:text-[#BFB2A8] pt-2 border-t border-[#E8DEC8]/80 dark:border-[#382C24]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89578]" />
            <span>Origin: Cairo Central Atelier</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Destination: {order?.governorate || 'Selected Governorate'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>

      {/* 2. ORDER SUCCESS MESSAGE CARD - Revealed after vehicle leaves */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full mt-6 bg-[#FFFDF9] dark:bg-[#1D1612] rounded-3xl border border-[#E8DEC8] dark:border-[#382C24] p-8 sm:p-10 shadow-lg text-center space-y-6"
          >
            <div>
              <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#B89578] font-bold block mb-1">
                Order Confirmation
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#27180F] dark:text-[#FFFDF9]">
                Your order has been placed successfully.
              </h1>
              <p className="text-xs sm:text-sm text-[#7A6759] dark:text-[#BFB2A8] mt-2 max-w-md mx-auto leading-relaxed">
                Thank you for your purchase. We are preparing your piece with organic packaging and dedicated attention to detail.
              </p>
            </div>

            {/* Order Reference Box */}
            <div className="p-4 bg-[#FAF6F0] dark:bg-[#251B15] rounded-2xl border border-[#E8DEC8] dark:border-[#3D2F25] max-w-sm mx-auto text-xs space-y-2 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#8F7969] dark:text-[#BFAFA3]">Order Number</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-sm text-[#6B4F3A] dark:text-[#E8DACB]">
                    #{orderNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyOrderId(orderNumber)}
                    className="p-1 text-[#8F7969] hover:text-[#6B4F3A] dark:hover:text-[#FFFDF9] hover:bg-[#E8DEC8]/50 dark:hover:bg-[#3D2F25] rounded transition-colors cursor-pointer"
                    title={copiedOrderId ? 'Copied!' : 'Copy Order Number'}
                  >
                    {copiedOrderId ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-sans font-semibold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              {order && (
                <>
                  <div className="flex justify-between items-center pt-2 border-t border-[#E8DEC8]/60 dark:border-[#382C24]">
                    <span className="text-[#8F7969] dark:text-[#BFAFA3]">Total Amount</span>
                    <span className="font-semibold text-[#27180F] dark:text-[#FFFDF9]">
                      {order.total.toLocaleString()} EGP
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#E8DEC8]/60 dark:border-[#382C24]">
                    <span className="text-[#8F7969] dark:text-[#BFAFA3]">Estimated Delivery</span>
                    <span className="font-semibold text-[#6B4F3A] dark:text-[#D1B198]">
                      2 - 3 Business Days
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to={`/track?orderId=${encodeURIComponent(orderNumber)}${
                  order?.customerPhone ? `&phone=${encodeURIComponent(order.customerPhone)}` : ''
                }`}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-xs font-sans uppercase tracking-[0.15em] font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Track Order Live</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/products"
                className="w-full sm:w-auto px-7 py-3.5 bg-[#FAF6F0] dark:bg-[#281E18] hover:bg-[#F5E6D3] dark:hover:bg-[#34271F] border border-brand-border dark:border-[#423329] text-[#6B4F3A] dark:text-[#E8DACB] text-xs font-sans uppercase tracking-[0.15em] font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>

              <a
                href={`https://wa.me/${settings.whatsapp.replace(
                  /[^0-9]/g,
                  ''
                )}?text=${encodeURIComponent(
                  `Hello OWNonce, I placed order #${orderNumber}. Please confirm my order details.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-sans uppercase tracking-[0.15em] font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

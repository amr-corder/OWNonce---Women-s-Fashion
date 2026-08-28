import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AddToCartToast: React.FC = () => {
  const { cartNotification } = useStore();

  return (
    <AnimatePresence>
      {cartNotification.show && (
        <div className="fixed top-18 sm:top-20 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <motion.div
            id="add-to-cart-notification"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="pointer-events-auto bg-[#FFFDF9] text-[#4A382D] border border-[#A98265] rounded-lg px-5 py-3.5 shadow-md flex items-center gap-3 max-w-md w-full sm:w-auto"
          >
            <div className="w-7 h-7 rounded-full bg-[#F5E6D3] text-[#77553b] flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-sans font-medium text-[#4A382D]">
                {cartNotification.message}
              </p>
              {cartNotification.productName && (
                <p className="text-[11px] font-sans text-[#82756c] line-clamp-1 mt-0.5">
                  {cartNotification.productName}
                </p>
              )}
            </div>
            <ShoppingBag className="w-4 h-4 text-[#A98265] flex-shrink-0 opacity-80" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="size-guide-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#27180F]/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        id="size-guide-modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-[#FFFDF9] text-[#4A382D] rounded-lg shadow-xl p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-brand-muted hover:text-[#4A382D] transition-colors"
          aria-label="Close Size Guide"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-serif text-[#4A382D] font-normal mb-1">
          OWNonce Size & Fit Guide
        </h3>
        <p className="text-xs font-sans text-brand-muted mb-6">
          Our tops are designed with a relaxed, tailored fit. Measurements are in centimeters (cm).
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-sans text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border text-brand-primary uppercase tracking-wider">
                <th className="py-2.5 px-3 font-semibold">Size</th>
                <th className="py-2.5 px-3 font-semibold">Bust (cm)</th>
                <th className="py-2.5 px-3 font-semibold">Waist (cm)</th>
                <th className="py-2.5 px-3 font-semibold">Length (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40">
              <tr>
                <td className="py-3 px-3 font-semibold text-[#4A382D]">S</td>
                <td className="py-3 px-3 text-brand-muted">84 – 88</td>
                <td className="py-3 px-3 text-brand-muted">66 – 70</td>
                <td className="py-3 px-3 text-brand-muted">58</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-[#4A382D]">M</td>
                <td className="py-3 px-3 text-brand-muted">89 – 94</td>
                <td className="py-3 px-3 text-brand-muted">71 – 76</td>
                <td className="py-3 px-3 text-brand-muted">60</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-[#4A382D]">L</td>
                <td className="py-3 px-3 text-brand-muted">95 – 100</td>
                <td className="py-3 px-3 text-brand-muted">77 – 82</td>
                <td className="py-3 px-3 text-brand-muted">62</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-[#4A382D]">XL</td>
                <td className="py-3 px-3 text-brand-muted">101 – 108</td>
                <td className="py-3 px-3 text-brand-muted">83 – 90</td>
                <td className="py-3 px-3 text-brand-muted">64</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-3.5 bg-[#F5E6D3] rounded text-xs text-[#4A382D] space-y-1">
          <p className="font-semibold">How to Measure:</p>
          <p className="text-brand-muted">
            • <strong>Bust:</strong> Measure around the fullest part of your chest with tape level.
          </p>
          <p className="text-brand-muted">
            • <strong>Length:</strong> Measured from the highest point of the shoulder seam to hemline.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

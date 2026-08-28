import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { products } = useStore();
  const navigate = useNavigate();

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.colors.some((c) => c.name.toLowerCase().includes(q))
    );
  }, [products, query]);

  if (!isOpen) return null;

  const handleSelectProduct = (prod: Product) => {
    onClose();
    navigate(`/products/${prod.id}`);
  };

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#27180F]/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <motion.div
        id="search-modal-container"
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        className="w-full max-w-2xl bg-[#FFFDF9] text-[#4A382D] rounded-lg shadow-xl overflow-hidden p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center border-b border-[#A98265] pb-3">
          <Search className="w-5 h-5 text-[#A98265] mr-3 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tops by silhouette, color, or category..."
            className="w-full text-base font-sans text-[#4A382D] placeholder:text-[#82756c] bg-transparent focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#82756c] hover:text-[#4A382D] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-3 text-xs uppercase tracking-widest text-[#82756c] hover:text-[#4A382D]"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Tags */}
        {!query && (
          <div className="pt-5">
            <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#82756c] font-semibold block mb-2">
              POPULAR CATEGORIES
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'Basic Round Neck',
                'Basic V-Neck',
                'Short Sleeve',
                'Sleeveless',
                'Black',
                'Beige',
                'Burgundy',
              ].map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1 bg-[#F5E6D3] hover:bg-[#B89578] text-[#4A382D] hover:text-[#FFFDF9] text-xs rounded transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {query && (
          <div className="pt-4 max-h-80 overflow-y-auto space-y-3">
            {searchResults.length === 0 ? (
              <p className="text-center py-8 text-xs text-[#82756c]">
                No tops found matching "{query}".
              </p>
            ) : (
              searchResults.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => handleSelectProduct(prod)}
                  className="flex items-center gap-3 p-2.5 hover:bg-[#F5E6D3]/60 rounded-md cursor-pointer transition-colors"
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-12 h-14 object-cover rounded bg-[#F5E6D3]"
                  />
                  <div className="flex-1">
                    <span className="text-[9px] uppercase tracking-wider text-[#82756c] block">
                      {prod.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-medium text-[#4A382D]">
                      {prod.name}
                    </h4>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span className="text-[11px] text-[#82756c] dark:text-[#A8988C] line-through font-normal">
                          {prod.originalPrice.toLocaleString()} EGP
                        </span>
                      )}
                      <span className="text-xs text-[#77553b] dark:text-[#D1B198] font-semibold">
                        {prod.price.toLocaleString()} EGP
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#82756c]" />
                </div>
              ))
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

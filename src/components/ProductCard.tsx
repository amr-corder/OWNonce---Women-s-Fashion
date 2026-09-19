import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist, addToCart } = useStore();
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0] || { name: 'Black', hex: '#000000' });
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const isFavorited = isInWishlist(product.id);
  const isInStock = product.isAvailable && product.stock > 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedColor, selectedSize, 1);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className={`group relative min-w-0 bg-[#FFFDF9] dark:bg-[#1E1712] rounded-lg border border-[#d4c3b9]/50 dark:border-[#3D2C22] overflow-hidden shadow-xs transition-all duration-300 flex flex-col justify-between ${
        isInStock ? 'hover:shadow-md' : 'opacity-60 grayscale'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full bg-[#F5E6D3] dark:bg-[#281E18] overflow-hidden cursor-pointer">
        <Link to={`/products/${product.id}`}>
          <img
            src={hovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          {selectedColor.hex.toLowerCase() !== '#ffffff' && (
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 mix-blend-multiply transition-colors duration-300 ${
                selectedColor.hex.toLowerCase() === '#000000' ? 'opacity-10' : 'opacity-25'
              }`}
              style={{ backgroundColor: selectedColor.hex }}
            />
          )}
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`group/heart absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm border ${
            isFavorited
              ? 'bg-[#FFFDF9] dark:bg-[#281A12] text-[#dc2626] dark:text-[#ff4d4d] border-[#fca5a5] dark:border-[#ef4444]/60 shadow-md scale-105'
              : 'bg-[#FFFDF9]/90 dark:bg-[#1C140E]/90 text-[#4A382D] dark:text-[#F3EBE1] hover:text-[#dc2626] dark:hover:text-[#ff4d4d] hover:border-[#fca5a5] dark:hover:border-[#ef4444]/60 hover:bg-[#FFFDF9] dark:hover:bg-[#281A12] border-[#d4c3b9]/70 dark:border-[#523E30]'
          }`}
          aria-label="Save to Wishlist"
        >
            <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-200 group-hover/heart:scale-115 active:scale-125 ${
              isFavorited
                ? 'fill-current text-[#dc2626] dark:text-[#ff4d4d]'
                : 'text-[#4A382D] dark:text-[#F3EBE1] group-hover/heart:text-[#dc2626] dark:group-hover/heart:text-[#ff4d4d] group-hover/heart:fill-[#dc2626]/20 dark:group-hover/heart:fill-[#ff4d4d]/30'
            }`}
            strokeWidth={isFavorited ? 2 : 2.2}
          />
        </button>

        {/* Weight Tag */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 sm:px-2 py-0.5 bg-[#27180F]/75 text-[#FFFDF9] text-[9px] sm:text-[10px] font-sans font-medium rounded tracking-wider backdrop-blur-xs">
          {product.weight} KG
        </div>

        {/* Out of Stock Banner */}
        {!isInStock && (
          <div className="absolute inset-0 bg-[#27180F]/50 flex items-center justify-center">
            <span className="bg-[#FFFDF9] dark:bg-[#281E18] text-[#4A382D] dark:text-[#FAF6F0] text-xs font-semibold px-3 py-1.5 rounded uppercase tracking-wider shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Category */}
          <span className="text-[8px] sm:text-[10px] uppercase font-sans tracking-[0.12em] sm:tracking-[0.2em] text-[#82756c] dark:text-[#B3A499] font-medium block mb-1 truncate">
            {product.category}
          </span>

          {/* Product Name */}
          <Link to={`/products/${product.id}`}>
            <h3 className="text-xs sm:text-sm font-medium text-[#4A382D] dark:text-[#F3EBE1] hover:text-[#77553b] dark:hover:text-[#D1B198] transition-colors leading-snug line-clamp-2 sm:line-clamp-1 mb-2 min-h-[2rem] sm:min-h-0">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-start justify-between gap-1 mb-3">
            <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap min-w-0">
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] sm:text-xs text-[#82756c] dark:text-[#A8988C] line-through font-normal">
                  {product.originalPrice.toLocaleString()} EGP
                </span>
              )}
              <span className="text-xs sm:text-sm font-semibold text-[#4A382D] dark:text-[#FAF6F0] whitespace-nowrap">
                {product.price.toLocaleString()} EGP
              </span>
            </div>
            <span className="hidden sm:inline text-[11px] text-[#82756c] dark:text-[#B3A499] text-right">
              {product.stock > 0 ? `${product.stock} in stock` : 'Restocking'}
            </span>
          </div>

          {/* Color Swatches */}
          <div className="flex items-center gap-1 mb-3 min-w-0">
            {product.colors.map((c) => {
              const isSelected = selectedColor.name === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  title={c.name}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColor(c);
                  }}
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'ring-2 ring-[#77553b] dark:ring-[#B89578] ring-offset-1 ring-offset-[#FFFDF9] dark:ring-offset-[#1E1712] scale-110'
                      : 'border border-[#d4c3b9]/80 dark:border-[#523E30] opacity-90 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {isSelected && (
                    <Check
                      className={`w-2.5 h-2.5 ${
                        c.hex.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}
            <span className="text-[9px] sm:text-[10px] text-[#82756c] dark:text-[#B3A499] ml-1 truncate">{selectedColor.name}</span>
          </div>
        </div>

        {/* Quick Add Action Button */}
        <div className="pt-2 border-t border-[#d4c3b9]/40 dark:border-[#3D2C22] flex gap-1.5 sm:gap-2">
          <button
            onClick={handleQuickAdd}
            disabled={!isInStock}
            className="flex-1 min-w-0 py-2 px-1.5 sm:px-3 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-[10px] sm:text-xs font-sans font-semibold tracking-wide sm:tracking-wider uppercase rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="sm:hidden">Add</span>
            <span className="hidden sm:inline">Add to Cart</span>
          </button>

          <Link
            to={`/products/${product.id}`}
            className="px-2 sm:px-3 py-2 border border-[#d4c3b9] dark:border-[#4A382D] hover:border-[#77553b] dark:hover:border-[#B89578] text-[#4A382D] dark:text-[#E8DACB] hover:bg-[#F5E6D3]/30 dark:hover:bg-[#281E18] text-[10px] sm:text-xs font-medium rounded transition-colors flex items-center justify-center"
            title="View Details"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

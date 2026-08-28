import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Check, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { DEFAULT_COLORS } from '../data/initialProducts';

export const ProductsPage: React.FC = () => {
  const { products, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category') || 'All';
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleCategoryChange = (catName: string) => {
    if (catName === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catName);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (activeCategory !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Color filter
    if (selectedColor) {
      list = list.filter((p) =>
        p.colors.some((c) => c.name.toLowerCase() === selectedColor.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => b.createdAt - a.createdAt);
    }

    return list;
  }, [products, activeCategory, selectedColor, sortBy]);

  return (
    <div id="products-page" className="min-h-screen bg-[#F5E6D3] text-[#4A382D] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left border-b border-[#d4c3b9] pb-6">
          <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#77553b] font-semibold block mb-1">
            OWNonce Womenswear
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#4A382D] font-normal">
            {activeCategory === 'All' ? 'Complete Collection' : activeCategory}
          </h1>
          <p className="text-xs sm:text-sm text-[#82756c] mt-1.5 max-w-xl">
            Refined tops designed for daily wear. Choose from four quintessential necklines and sleeve variations.
          </p>
        </div>

        {/* Filters & Sorting Bar */}
        <div className="bg-[#FFFDF9] rounded-lg border border-[#d4c3b9] p-4 mb-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
          {/* Category Tabs (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleCategoryChange('All')}
              className={`px-3 py-1.5 rounded text-xs font-sans font-medium transition-colors cursor-pointer ${
                activeCategory === 'All'
                  ? 'bg-[#B89578] text-[#FFFDF9]'
                  : 'bg-[#F5E6D3]/60 text-[#4A382D] hover:bg-[#F5E6D3]'
              }`}
            >
              All Silhouettes ({products.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.name)}
                className={`px-3 py-1.5 rounded text-xs font-sans font-medium transition-colors cursor-pointer ${
                  activeCategory === cat.name
                    ? 'bg-[#B89578] text-[#FFFDF9]'
                    : 'bg-[#F5E6D3]/60 text-[#4A382D] hover:bg-[#F5E6D3]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Color Filter Swatches */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#82756c]">Color:</span>
            <div className="flex items-center gap-1.5">
              {DEFAULT_COLORS.map((c) => {
                const isSelected = selectedColor === c.name;
                return (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setSelectedColor(isSelected ? null : c.name)}
                    className={`w-6 h-6 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'ring-2 ring-[#77553b] ring-offset-1 scale-110'
                        : 'border border-[#d4c3b9] opacity-85 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {isSelected && (
                      <Check
                        className={`w-3 h-3 ${
                          c.hex.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
              {selectedColor && (
                <button
                  onClick={() => setSelectedColor(null)}
                  className="text-[10px] text-[#82756c] hover:text-[#4A382D] underline ml-1 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-medium text-[#82756c]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#F5E6D3] text-[#4A382D] text-xs py-1.5 px-3 rounded border border-[#d4c3b9] focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Essentials</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Releases</option>
            </select>
          </div>
        </div>

        {/* Mobile Category Select Dropdown */}
        <div className="lg:hidden mb-6">
          <label className="text-xs font-semibold text-[#82756c] block mb-1">
            Filter by Silhouette:
          </label>
          <select
            value={activeCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full bg-[#FFFDF9] text-[#4A382D] text-xs py-2.5 px-3 rounded-lg border border-[#d4c3b9]"
          >
            <option value="All">All Silhouettes ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] py-16 px-6 text-center space-y-3">
            <p className="font-serif text-lg text-[#4A382D]">No tops matching your criteria.</p>
            <p className="text-xs text-[#82756c]">
              Try resetting your color or category filters.
            </p>
            <button
              onClick={() => {
                handleCategoryChange('All');
                setSelectedColor(null);
              }}
              className="mt-2 px-4 py-2 bg-[#B89578] text-[#FFFDF9] rounded text-xs uppercase tracking-wider font-semibold cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

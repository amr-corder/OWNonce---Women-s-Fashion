import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { SearchModal } from './SearchModal';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdown, setCategoriesDropdown] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { totalCartCount, wishlistIds, categories } = useStore();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, isArabic } = useLanguage();
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  const isActive = (path: string) => location.pathname === path;
  const navLabels = {
    home: isArabic ? 'الرئيسية' : 'Home',
    products: isArabic ? 'المنتجات' : 'Products',
    categories: isArabic ? 'الفئات' : 'Categories',
    about: isArabic ? 'من نحن' : 'About',
    track: isArabic ? 'تتبع الطلب' : 'Track Order',
    contact: isArabic ? 'تواصل' : 'Contact',
    cart: isArabic ? 'السلة' : 'Cart',
    wishlist: isArabic ? 'المفضلة' : 'Wishlist',
    allProducts: isArabic ? 'كل المنتجات' : 'All Products',
    theme: isArabic ? 'المظهر' : 'Theme',
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (mobileMenuOpen && headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        id="ownonce-header"
        ref={headerRef}
        className="sticky top-0 z-40 w-full bg-brand-accent dark:bg-[#1D1612] text-brand-surface dark:text-[#F5EFE6] shadow-sm transition-colors duration-300 border-b border-transparent dark:border-[#3D3027]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 relative">
            {/* Left Brand Logo */}
            <div className="flex items-center justify-start">
              <BrandLogo light size="md" />
            </div>

            {/* Centered Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center space-x-8 text-xs tracking-[0.2em] uppercase font-sans font-medium absolute left-1/2 -translate-x-1/2">
              <Link
                to="/"
                className={`transition-opacity hover:opacity-75 ${
                  isActive('/') ? 'border-b border-brand-surface pb-0.5 opacity-100' : 'opacity-90'
                }`}
              >
                {navLabels.home}
              </Link>

              <Link
                to="/products"
                className={`transition-opacity hover:opacity-75 ${
                  isActive('/products') ? 'border-b border-brand-surface pb-0.5 opacity-100' : 'opacity-90'
                }`}
              >
                {navLabels.products}
              </Link>

              {/* Categories Dropdown */}
              <div
                className="relative group py-2"
                onMouseEnter={() => setCategoriesDropdown(true)}
                onMouseLeave={() => setCategoriesDropdown(false)}
              >
                <button
                  className="inline-flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity cursor-pointer uppercase tracking-[0.2em]"
                >
                  <span>{navLabels.categories}</span>
                  <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" />
                </button>

                <AnimatePresence>
                  {categoriesDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-brand-surface dark:bg-[#1D1612] text-brand-text dark:text-[#F0E6DC] rounded-md shadow-lg border border-brand-border dark:border-[#3D3027] p-3 space-y-1.5 z-50 normal-case font-normal"
                    >
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/products?category=${encodeURIComponent(cat.name)}`}
                          onClick={() => setCategoriesDropdown(false)}
                          className="block px-3 py-2 text-xs font-sans rounded hover:bg-brand-bg dark:hover:bg-[#2B221C] text-brand-text dark:text-[#F0E6DC] transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/about"
                className={`transition-opacity hover:opacity-75 ${
                  isActive('/about') ? 'border-b border-brand-surface pb-0.5 opacity-100' : 'opacity-90'
                }`}
              >
                {navLabels.about}
              </Link>

              <Link
                to="/track"
                className={`transition-opacity hover:opacity-75 ${
                  isActive('/track') || isActive('/order-tracking') ? 'border-b border-brand-surface pb-0.5 opacity-100' : 'opacity-90'
                }`}
              >
                {navLabels.track}
              </Link>

              <Link
                to="/contact"
                className={`transition-opacity hover:opacity-75 ${
                  isActive('/contact') ? 'border-b border-brand-surface pb-0.5 opacity-100' : 'opacity-90'
                }`}
              >
                {navLabels.contact}
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden lg:flex items-center rounded-full border border-brand-surface/20 bg-brand-surface/10 px-1 py-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setLanguage('ar')}
                  className={`px-2 py-1 text-[10px] font-medium tracking-[0.12em] uppercase rounded-full transition-colors ${
                    language === 'ar' ? 'bg-brand-surface text-brand-text' : 'text-brand-surface/80 hover:text-brand-surface'
                  }`}
                  aria-label="Arabic language"
                  title="Arabic"
                >
                  AR
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 text-[10px] font-medium tracking-[0.12em] uppercase rounded-full transition-colors ${
                    language === 'en' ? 'bg-brand-surface text-brand-text' : 'text-brand-surface/80 hover:text-brand-surface'
                  }`}
                  aria-label="English language"
                  title="English"
                >
                  EN
                </button>
              </div>

              {/* Dark Mode Toggle Button (Desktop only; on mobile it is inside the hamburger drawer) */}
              <button
                onClick={toggleTheme}
                className="hidden lg:flex p-1.5 rounded-full hover:bg-brand-surface/15 dark:hover:bg-brand-surface/10 transition-all cursor-pointer text-brand-surface"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5D061] transition-transform hover:rotate-45 duration-300" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-surface transition-transform hover:-rotate-12 duration-300" />
                )}
              </button>

              {/* Search Trigger */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-1.5 hover:opacity-75 transition-opacity cursor-pointer"
                title="Search Products"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-brand-surface" />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="p-1.5 relative hover:opacity-75 transition-opacity"
                title="Saved Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-brand-surface" />
                {wishlistIds.length > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-4.5 h-4.5 px-1 bg-brand-surface dark:bg-[#D4AF37] text-brand-text dark:text-[#140F0C] text-[10px] font-black font-sans rounded-full flex items-center justify-center shadow-md ring-2 ring-brand-accent dark:ring-[#1D1612] z-20 transition-transform">
                    {wishlistIds.length > 99 ? '99+' : wishlistIds.length}
                  </span>
                )}
              </Link>

              {/* Shopping Bag / Cart Link */}
              <Link
                to="/cart"
                className="p-1.5 relative hover:opacity-75 transition-opacity flex items-center gap-1.5"
                title="Shopping Bag"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-brand-surface" />
                {totalCartCount > 0 && (
                  <span
                    key={totalCartCount}
                    className="absolute -top-1 -right-1.5 min-w-4.5 h-4.5 px-1 bg-brand-surface dark:bg-[#D4AF37] text-brand-text dark:text-[#140F0C] text-[10px] font-black font-sans rounded-full flex items-center justify-center shadow-md ring-2 ring-brand-accent dark:ring-[#1D1612] z-20 animate-pulse transition-transform"
                  >
                    {totalCartCount > 99 ? '99+' : totalCartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle Button (Keeps hamburger Menu icon without transforming to X) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 hover:opacity-75 transition-opacity cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#96745A] dark:bg-[#18120E] border-t border-brand-surface/20 dark:border-[#3D3027] px-6 py-6 space-y-4 relative z-50"
            >
              {/* Dark mode switch in mobile drawer */}
              <div className="flex items-center justify-between pb-3.5 border-b border-brand-surface/15 dark:border-[#3D3027] gap-3">
                <div className="flex items-center gap-2">
                  {isDark ? (
                    <Moon className="w-4 h-4 text-[#D4AF37]" />
                  ) : (
                    <Sun className="w-4 h-4 text-[#FAF6F0]" />
                  )}
                  <span className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-brand-surface">
                    Theme: {isDark ? 'Dark' : 'Light'}
                  </span>
                </div>
                <div className="flex items-center rounded-full border border-brand-surface/20 bg-brand-surface/10 px-1 py-1">
                  <button
                    type="button"
                    onClick={() => setLanguage('ar')}
                    className={`px-2 py-1 text-[10px] font-medium rounded-full transition-colors ${
                      language === 'ar' ? 'bg-brand-surface text-brand-text' : 'text-brand-surface/80'
                    }`}
                  >
                    عربي
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 text-[10px] font-medium rounded-full transition-colors ${
                      language === 'en' ? 'bg-brand-surface text-brand-text' : 'text-brand-surface/80'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pb-3.5 border-b border-brand-surface/15 dark:border-[#3D3027]">
                <div className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-brand-surface">
                  {isArabic ? 'المظهر' : 'Appearance'}
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-surface/15 hover:bg-brand-surface/25 dark:bg-[#2B221C] dark:hover:bg-[#382C24] text-brand-surface text-xs font-sans transition-all cursor-pointer shadow-xs border border-brand-surface/20 dark:border-brand-text"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-[#F5D061]" />
                      <span className="text-[11px] font-medium">{isArabic ? 'الوضع الفاتح' : 'Light Mode'}</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-[#FAF6F0]" />
                      <span className="text-[11px] font-medium">{isArabic ? 'الوضع الداكن' : 'Dark Mode'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Mobile quick actions for Cart and Wishlist */}
              <div className="grid grid-cols-2 gap-2 pb-2">
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 bg-brand-surface/10 dark:bg-[#251B15] rounded-lg border border-brand-surface/15 text-xs text-brand-surface font-medium"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Cart</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-brand-surface dark:bg-[#D4AF37] text-brand-text dark:text-[#140F0C] text-[10px] font-bold rounded-full">
                    {totalCartCount}
                  </span>
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 bg-brand-surface/10 dark:bg-[#251B15] rounded-lg border border-brand-surface/15 text-xs text-brand-surface font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>Wishlist</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-brand-surface dark:bg-[#D4AF37] text-brand-text dark:text-[#140F0C] text-[10px] font-bold rounded-full">
                    {wishlistIds.length}
                  </span>
                </Link>
              </div>

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs uppercase tracking-[0.25em] font-sans font-medium text-brand-surface py-1 hover:opacity-75"
              >
                {navLabels.home}
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs uppercase tracking-[0.25em] font-sans font-medium text-brand-surface py-1 hover:opacity-75"
              >
                {navLabels.allProducts}
              </Link>

              <div className="pt-2 pb-1 border-t border-b border-brand-surface/15 dark:border-[#3D3027]">
                <span className="text-[10px] uppercase tracking-[0.3em] text-brand-border font-bold block mb-2">
                  Categories
                </span>
                <div className="space-y-2 pl-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs text-brand-surface hover:opacity-80 py-0.5"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs uppercase tracking-[0.25em] font-sans font-medium text-brand-surface py-1 hover:opacity-75"
              >
                {isArabic ? 'من نحن' : 'About Us'}
              </Link>
              <Link
                to="/track"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs uppercase tracking-[0.25em] font-sans font-medium text-brand-surface py-1 hover:opacity-75"
              >
                {navLabels.track}
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs uppercase tracking-[0.25em] font-sans font-medium text-brand-surface py-1 hover:opacity-75"
              >
                {isArabic ? 'تواصل معنا' : 'Contact Us'}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Backdrop to close mobile menu on screen tap */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-20 bg-black/40 backdrop-blur-xs z-30 lg:hidden cursor-pointer"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Quick Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
};

import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { StoreProvider } from './context/StoreContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AddToCartToast } from './components/AddToCartToast';
import { GlobalLoader } from './components/GlobalLoader';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TrackOrderPage } from './pages/TrackOrderPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

// Scroll to top automatically on route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function ScrollReveal() {
  useEffect(() => {
    const revealSelector = 'main > *, main section, main article, main form, main [id^="product-card-"]';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveal = (element: Element) => {
      if (element instanceof HTMLElement && !element.classList.contains('scroll-reveal')) {
        element.classList.add('scroll-reveal');
        if (reducedMotion) element.classList.add('is-visible');
        observer.observe(element);
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px' },
    );
    const scan = () => document.querySelectorAll(revealSelector).forEach(reveal);
    const mutationObserver = new MutationObserver(scan);

    scan();
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}

// Layout wrapper that conditionally renders customer Navbar & Footer
function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div id="ownonce-app-root" className="min-h-screen bg-[#F5E6D3] dark:bg-[#140F0C] text-[#4A382D] dark:text-[#F0E6DC] flex flex-col font-sans selection:bg-[#B89578] selection:text-[#FFFDF9] transition-colors duration-300">
      <ScrollToTop />
      <ScrollReveal />
      <GlobalLoader />
      <AddToCartToast />

      {/* Customer Header */}
      {!isAdminRoute && <Navbar />}

      {/* Main Page Routing */}
      <main className="flex-1">
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/order-tracking" element={<TrackOrderPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Customer Footer */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AdminAuthProvider>
          <StoreProvider>
            <Router>
              <AppLayout />
            </Router>
          </StoreProvider>
        </AdminAuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

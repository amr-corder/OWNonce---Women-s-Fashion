import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { TikTokIcon } from './TikTokIcon';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { settings, categories } = useStore();
  const { isArabic } = useLanguage();

  const t = {
    tagline: isArabic ? 'البساطة الراقية في مستلزمات المرأة الأساسية' : 'Refined Simplicity in Women\'s Essentials',
    collections: isArabic ? 'المجموعات' : 'Collections',
    customerCare: isArabic ? 'رعاية العملاء' : 'Customer Care',
    about: isArabic ? 'عن OWNonce' : 'About OWNonce',
    track: isArabic ? 'تتبع طلبك' : 'Track Your Order',
    contact: isArabic ? 'التواصل والفنادق' : 'Contact & Atelier',
    shipping: isArabic ? 'حاسبة الشحن والتكاليف' : 'Shipping Calculator & Rates',
    wishlist: isArabic ? 'المفضلة المحفوظة' : 'Saved Wishlist',
    connect: isArabic ? 'تواصل معنا' : 'Connect With Us',
    connectText: isArabic ? 'استفسارات الطلبات، نصائح المقاسات أو الإرشاد الشخصي عبر قنوات الاستقبال.' : 'Order queries, bespoke sizing guidance, or style advice via our concierge channels.',
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    facebook: 'Facebook',
    tikTok: 'TikTok',
    vodafone: isArabic ? 'تم قبول فودافون كاش وإنستا باي' : 'Vodafone Cash & InstaPay Accepted',
    rights: isArabic ? 'جميع الحقوق محفوظة' : 'All rights reserved.',
    fastShipping: isArabic ? 'شحن سريع داخل مصر' : 'Egypt Fast Shipping',
    cotton: isArabic ? '94% قطن و6% ليكرا' : '94% Cotton / 6% Lycra',
    admin: isArabic ? 'بوابة الإدارة' : 'Admin Portal',
    live: isArabic ? 'مباشر' : 'Live',
  };

  return (
    <footer id="ownonce-footer" className="w-full bg-[#27180F] text-[#FFFDF9] pt-16 pb-12 border-t border-[#77553b]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#77553b]/25">
          {/* Brand Seal & Mission */}
          <div className="space-y-4">
            <BrandLogo light size="lg" />
            <p className="text-xs font-sans text-[#d4c3b9] leading-relaxed max-w-sm pt-2">
              {isArabic ? 'البساطة الراقية في مستلزمات المرأة الأساسية. مصممة للنساء اللواتي يقدّرن القطع الفاخرة، الراحة القصوى، والأناقة اليومية الدائمة.' : `${settings.tagline}. Designed for women who appreciate refined cuts, supreme comfort, and enduring everyday elegance.`}
            </p>
            <div className="pt-2 space-y-1.5 text-xs text-[#d4c3b9]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B89578] flex-shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B89578] flex-shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-sans tracking-[0.25em] uppercase text-[#B89578] font-semibold">
              {t.collections}
            </h4>
            <ul className="space-y-2 text-xs font-sans text-[#d4c3b9]">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="hover:text-[#FFFDF9] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-sans tracking-[0.25em] uppercase text-[#B89578] font-semibold">
              {t.customerCare}
            </h4>
            <ul className="space-y-2 text-xs font-sans text-[#d4c3b9]">
              <li>
                <Link to="/about" className="hover:text-[#FFFDF9] transition-colors">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-[#FFFDF9] text-[#B89578] font-semibold transition-colors flex items-center gap-1.5">
                  <span>{t.track}</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#B89578]/20 border border-[#B89578]/40 rounded text-[#FAF6F0]">{t.live}</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FFFDF9] transition-colors">
                  {t.contact}
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#FFFDF9] transition-colors">
                  {t.shipping}
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-[#FFFDF9] transition-colors">
                  {t.wishlist}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Channels & Instant Connect */}
          <div className="space-y-4">
            <h4 className="text-xs font-sans tracking-[0.25em] uppercase text-[#B89578] font-semibold">
              {t.connect}
            </h4>
            <p className="text-xs text-[#d4c3b9] leading-relaxed">
              {t.connectText}
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-[#3E2D22] hover:bg-[#B89578] text-[#FFFDF9] rounded text-xs font-sans flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.whatsapp}</span>
              </a>

              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-[#3E2D22] hover:bg-[#B89578] text-[#FFFDF9] rounded text-xs font-sans flex items-center gap-1.5 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>{t.instagram}</span>
              </a>

              <a
                href={settings.facebook}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-[#3E2D22] hover:bg-[#B89578] text-[#FFFDF9] rounded text-xs font-sans flex items-center gap-1.5 transition-colors"
              >
                <Facebook className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.facebook}</span>
              </a>

              <a
                href={settings.tiktok}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-[#3E2D22] hover:bg-[#B89578] text-[#FFFDF9] rounded text-xs font-sans flex items-center gap-1.5 transition-colors"
              >
                <TikTokIcon className="w-3.5 h-3.5 text-stone-200" />
                <span>{t.tikTok}</span>
              </a>
            </div>
            <div className="text-[11px] text-[#82756c] pt-1">
              <span>{t.vodafone}</span>
            </div>
          </div>
        </div>

        {/* Bottom Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans text-[#82756c] gap-4">
          <p>© {new Date().getFullYear()} OWNonce Womenswear. {t.rights}</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#d4c3b9] transition-colors">{t.fastShipping}</span>
            <span>•</span>
            <span className="hover:text-[#d4c3b9] transition-colors">{t.cotton}</span>
            <span>•</span>
            <Link to="/admin" className="text-[#B89578] hover:text-[#FFFDF9] underline underline-offset-2 transition-colors">
              {t.admin}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

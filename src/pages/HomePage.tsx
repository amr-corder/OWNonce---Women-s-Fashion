import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MessageCircle, Instagram, Facebook, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/ProductCard';
import { TikTokIcon } from '../components/TikTokIcon';

export const HomePage: React.FC = () => {
  const { products, categories, reviews, settings } = useStore();
  const { isArabic } = useLanguage();

  const featuredProducts = products.filter((p) => p.isAvailable).slice(0, 4);
  const approvedReviews = reviews.filter((r) => r.isApproved).slice(0, 3);

  const whatsappNumber = settings.whatsapp ? settings.whatsapp.replace(/[^0-9]/g, '') : '201017361763';

  const t = {
    heroTitle: isArabic ? 'أساسيات مصممة للمرأة العصرية' : 'Refined Essentials for the Modern Woman',
    heroText: isArabic
      ? 'اكتشف قمصان أساسية أنيقة مصنوعة من مزيج 94% قطن و6% ليكرا، من أعناق دائرية إلى تصميمات V-neck متناسقة، لتصنع أسلوبك اليومي بثقة.'
      : 'Explore timeless basic tops tailored in a premium 94% cotton and 6% Lycra blend. From classic round necks to contoured V-neck styles, built to elevate every wardrobe.',
    explore: isArabic ? 'استكشف المجموعة' : 'Explore Collection',
    philosophy: isArabic ? 'فلسفتنا' : 'Our Philosophy',
    fastShipping: isArabic ? 'شحن سريع داخل مصر' : 'Fast Egypt Shipping',
    cotton: isArabic ? '94% قطن و6% ليكرا' : '94% Cotton / 6% Lycra',
    fit: isArabic ? 'ملاءمة سلسة' : 'Effortless Fit',
    coreCapsule: isArabic ? 'القطعة الأساسية' : 'The Core Capsule',
    shopByStyle: isArabic ? 'تسوق حسب الشكل' : 'Shop by Style',
    discover: isArabic ? 'اكتشف كل مجموعة مختارة بملامحها وتصاميمها الفريدة.' : 'Discover each curated collection featuring our latest designs and signature fabrics.',
    seasonal: isArabic ? 'إصدارات موسمية' : 'Seasonal Releases',
    latest: isArabic ? 'آخر المستلزمات الأساسية' : 'Latest Essentials',
    viewAll: isArabic ? 'عرض كل القمصان' : 'View All Tops',
    standard: isArabic ? 'معيار OWNonce' : 'The OWNonce Standard',
    storyTitle: isArabic ? 'مصمم ليُمتلك مرة واحدة. ويُلبس للأبد.' : 'Designed to be Owned Once. Worn Forever.',
    storyOne: isArabic
      ? 'في OWNonce نرفض الاتجاهات العابرة. نركز على أشكال أساسية مصممة بدقة لتكون أساس خزانة ملابسك. كل خطّ، منحنى فتحة الذراع، وعمق الرقبة يتم اختباره بعناية للراحة طوال اليوم.'
      : 'At OWNonce, we reject fleeting trends. We focus on masterfully calibrated basic designs that serve as the foundation of your wardrobe. Every seam, armhole curve, and neckline depth is meticulously tested for all-day comfort.',
    storyTwo: isArabic
      ? 'مصنوع من ألياف طويلة التيلة، تمنح قمصاننا ملمسًا ناعمًا ومريحًا وتحتفظ ببنيتها الفاخرة مع كل ارتداء.'
      : 'Spun from long-staple fibers, our tops provide a breathable, silky touch and retain their pristine structure wear after wear.',
    readStory: isArabic ? 'اقرأ قصتنا كاملة' : 'Read Our Full Story',
    clientExperiences: isArabic ? 'تجارب عملاء موثقة' : 'Verified Client Experiences',
    community: isArabic ? 'كلمات من مجتمعنا' : 'Words from Our Community',
    concierge: isArabic ? 'استشارة مباشرة' : 'Direct Concierge',
    stylingHelp: isArabic ? 'هل تحتاج إلى نصائح شخصية عن المقاس أو الأسلوب؟' : 'Need Personal Styling or Sizing Advice?',
    conciergeText: isArabic ? 'متخصصو أطلية القاهرة مستعدون لمساعدتك عبر الواتساب، إنستغرام، فيسبوك أو تيك توك.' : 'Our atelier specialists in Cairo are ready to assist you on WhatsApp, Instagram, Facebook, or TikTok.',
    whatsappConcierge: isArabic ? 'واتساب كونسيرج' : 'WhatsApp Concierge',
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    design: isArabic ? 'تصميم' : 'Design',
    exploreLabel: isArabic ? 'استكشف' : 'Explore',
    verified: isArabic ? 'طلب موثّق' : 'Verified Order',
    viewCollection: isArabic ? 'عرض المجموعة' : 'View Collection',
    designPlural: isArabic ? 'تصاميم' : 'Designs',
    from: isArabic ? 'من' : 'From',
  };

  return (
    <div id="home-page" className="min-h-screen bg-[#F5E6D3] text-[#4A382D]">
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[560px] sm:min-h-[640px] flex items-center justify-center border-b border-[#d4c3b9] overflow-hidden">
        {/* Background Image with Warm Luxury Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80"
            alt="OWNonce Luxury Womenswear Atelier"
            className="w-full h-full object-cover object-[center_30%]"
          />
          {/* Multi-layer luxury overlay for optimal readability while keeping the warm brand tone */}
          <div className="absolute inset-0 bg-[#27180F]/60 backdrop-brightness-95" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#27180F]/90 via-[#27180F]/40 to-[#27180F]/50" />
        </div>

        {/* Centered Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20 sm:pt-16 sm:pb-28 text-center flex flex-col items-center">
          {/* 4 Social Media Channel Icons Above Title with Brand Primary Hover Colors */}
          <div className="flex items-center justify-center gap-3.5 sm:gap-4.5 -mt-2 sm:-mt-4 mb-8 sm:mb-10">
            {/* 1. Instagram */}
            <a
              href={settings.instagram || 'https://www.instagram.com/ownonce.co?igsi=MzE4MjhtcDlzN2Vi'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Follow us on Instagram"
              className="group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FFFDF9]/15 backdrop-blur-md border border-[#FFFDF9]/30 text-[#FFFDF9] hover:text-white hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:border-transparent hover:shadow-[0_8px_25px_rgba(221,42,123,0.55)] hover:-translate-y-1.5 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <Instagram className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-300 group-hover:scale-110" />
            </a>

            {/* 2. Facebook */}
            <a
              href={settings.facebook || 'https://www.facebook.com/share/1BhisFiWCQ/'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Follow us on Facebook"
              className="group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FFFDF9]/15 backdrop-blur-md border border-[#FFFDF9]/30 text-[#FFFDF9] hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-[0_8px_25px_rgba(24,119,242,0.55)] hover:-translate-y-1.5 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <Facebook className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-300 group-hover:scale-110" />
            </a>

            {/* 3. TikTok */}
            <a
              href={settings.tiktok || 'https://www.tiktok.com/@ownonce.co?_r=1&_t=ZS-999jLbXALFy'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              title="Follow us on TikTok"
              className="group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FFFDF9]/15 backdrop-blur-md border border-[#FFFDF9]/30 text-[#FFFDF9] hover:text-white hover:bg-[#010101] hover:border-[#010101] hover:shadow-[0_8px_25px_rgba(0,0,0,0.7),0_0_15px_rgba(37,244,238,0.45)] hover:-translate-y-1.5 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <TikTokIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
            </a>

            {/* 4. WhatsApp */}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="Chat with Concierge on WhatsApp"
              className="group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FFFDF9]/15 backdrop-blur-md border border-[#FFFDF9]/30 text-[#FFFDF9] hover:text-white hover:bg-[#25D366] hover:border-[#25D366] hover:shadow-[0_8px_25px_rgba(37,211,102,0.55)] hover:-translate-y-1.5 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-300 group-hover:scale-110" />
            </a>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#FFFDF9] font-normal leading-[1.15] tracking-tight mb-6 max-w-3xl drop-shadow-xs">
            {t.heroTitle}
          </h1>

          {/* Paragraph */}
          <p className="text-sm sm:text-base lg:text-lg font-sans text-[#F5E6D3]/90 leading-relaxed max-w-2xl mx-auto mb-8 font-light">
            {t.heroText}
          </p>

          {/* Call-to-action Buttons Centered */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to="/products"
              className="w-full sm:w-auto px-9 py-4 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-xs font-sans font-semibold tracking-[0.2em] uppercase rounded transition-all text-center shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.explore}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/about"
              className="w-full sm:w-auto px-8 py-4 bg-[#FFFDF9]/10 hover:bg-[#FFFDF9]/20 backdrop-blur-md border border-[#FFFDF9]/30 text-[#FFFDF9] text-xs font-sans font-medium tracking-[0.15em] uppercase rounded transition-colors text-center"
            >
              {t.philosophy}
            </Link>
          </div>

          {/* Badges Centered */}
          <div className="mt-12 pt-8 w-full max-w-2xl border-t border-[#FFFDF9]/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#F5E6D3]/85">
            <div className="flex items-center justify-center gap-2">
              <Truck className="w-4 h-4 text-[#E6CDB8]" />
              <span>{t.fastShipping}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E6CDB8]" />
              <span>{t.cotton}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#E6CDB8]" />
              <span>{t.fit}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories / Styles Section (Dynamic based on store products) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.3em] text-[#77553b] font-semibold block mb-2">
            {t.coreCapsule}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#4A382D] font-normal">
            {t.shopByStyle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#82756c] max-w-md mx-auto">
            {t.discover}
          </p>
        </div>

        {(() => {
          // Extract only categories that have at least one actual product in the store
          const activeCategoryNames: string[] = Array.from(
            new Set(products.map((p) => (p.category ? p.category.trim() : '')).filter(Boolean))
          );

          const categoriesWithProducts = activeCategoryNames.map((catName: string) => {
            const catProducts = products.filter(
              (p) => (p.category || '').trim().toLowerCase() === catName.toLowerCase()
            );
            const firstProduct = catProducts[0];
            const existingCat = categories.find(
              (c) => (c.name || '').trim().toLowerCase() === catName.toLowerCase()
            );

            // First uploaded product image in this category
            const realProductImage =
              firstProduct?.images?.[0] ||
              existingCat?.image ||
              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';

            const description =
              existingCat?.description ||
              `Signature ${catName} pieces tailored with premium fabrics and refined styles.`;

            const piecesCount = catProducts.length;
            const minPrice =
              piecesCount > 0 ? Math.min(...catProducts.map((p) => p.price)) : null;

            return {
              id: existingCat?.id || `cat-${catName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
              name: catName,
              description,
              image: realProductImage,
              count: piecesCount,
              minPrice,
              firstProductName: firstProduct?.name,
            };
          });

          if (categoriesWithProducts.length === 0) {
            return null;
          }

          // Responsive grid layout based on number of active categories
          const gridColsClass =
            categoriesWithProducts.length === 1
              ? 'max-w-md mx-auto grid-cols-1'
              : categoriesWithProducts.length === 2
              ? 'max-w-3xl mx-auto grid-cols-1 sm:grid-cols-2'
              : categoriesWithProducts.length === 3
              ? 'max-w-5xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

          return (
            <div className={`grid ${gridColsClass} gap-6`}>
              {categoriesWithProducts.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="group relative bg-[#FFFDF9] rounded-lg border border-[#d4c3b9] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="aspect-[4/5] w-full bg-[#F5E6D3] overflow-hidden relative">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Badge for number of pieces */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#2C221E]/80 backdrop-blur-md text-[#FFFDF9] text-[10px] font-medium tracking-wider rounded-full border border-white/10 shadow-xs">
                      {cat.count} {cat.count === 1 ? t.design : t.designPlural}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-serif font-medium text-[#4A382D] group-hover:text-[#77553b] transition-colors leading-snug mb-1.5">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-[#82756c] line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-[#F5E6D3] mt-4">
                      {cat.minPrice ? (
                        <span className="text-[11px] font-sans text-[#77553b] font-medium">
                          {t.from} {cat.minPrice.toLocaleString()} EGP
                        </span>
                      ) : (
                        <span className="text-[11px] font-sans text-[#82756c]">
                          {t.viewCollection}
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-xs text-[#77553b] font-semibold group-hover:translate-x-0.5 transition-transform">
                        <span>{t.exploreLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          );
        })()}
      </section>

      {/* 3. Latest Products */}
      <section className="py-16 bg-[#FFFDF9] border-t border-b border-[#d4c3b9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.3em] text-[#77553b] font-semibold block mb-1">
                {t.seasonal}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#4A382D] font-normal">
                {t.latest}
              </h2>
            </div>
            <Link
              to="/products"
              className="text-xs font-sans tracking-[0.2em] uppercase font-semibold text-[#77553b] hover:text-[#4A382D] flex items-center gap-1 transition-colors"
            >
              <span>{t.viewAll} ({products.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Brand Story */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-8 sm:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.3em] text-[#77553b] font-semibold block">
                {t.standard}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#4A382D] font-normal leading-tight">
                {t.storyTitle}
              </h2>
              <p className="text-xs sm:text-sm font-sans text-[#82756c] leading-relaxed">
                {t.storyOne}
              </p>
              <p className="text-xs sm:text-sm font-sans text-[#82756c] leading-relaxed">
                {t.storyTwo}
              </p>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase font-semibold text-[#B89578] hover:text-[#96745A] transition-colors"
                >
                  <span>{t.readStory}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=80"
                alt="Cotton fiber craft"
                className="rounded-lg object-cover w-full h-64 border border-[#d4c3b9]"
              />
              <img
                src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=700&q=80"
                alt="Tailoring atelier"
                className="rounded-lg object-cover w-full h-64 border border-[#d4c3b9] mt-6"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customer Reviews */}
      <section className="py-16 bg-[#FFFDF9] border-t border-b border-[#d4c3b9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.3em] text-[#77553b] font-semibold block mb-1">
              {t.clientExperiences}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#4A382D] font-normal">
              {t.community}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {approvedReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#F5E6D3]/40 border border-[#d4c3b9] p-6 rounded-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-600">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm font-sans text-[#4A382D] italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#d4c3b9]/40 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#4A382D]">{rev.customerName}</span>
                  <span className="text-[#82756c]">{t.verified}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Social & Concierge Contact Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-8 sm:p-12 max-w-3xl mx-auto space-y-6">
          <span className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.3em] text-[#77553b] font-semibold block">
            {t.concierge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#4A382D] font-normal">
            {t.stylingHelp}
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#82756c] max-w-md mx-auto">
            {t.conciergeText}
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded text-xs font-sans font-semibold tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.whatsappConcierge}</span>
            </a>

            <a
              href={settings.instagram}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-[#E1306C] hover:bg-[#c9265e] text-white rounded text-xs font-sans font-semibold tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
              <span>{t.instagram}</span>
            </a>

            <a
              href={settings.facebook}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-[#1877F2] hover:bg-[#1565cc] text-white rounded text-xs font-sans font-semibold tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Facebook className="w-4 h-4" />
              <span>{t.facebook}</span>
            </a>

            <a
              href={settings.tiktok}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-[#010101] hover:bg-[#222222] text-white rounded text-xs font-sans font-semibold tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              <TikTokIcon className="w-4 h-4" />
              <span>{t.tiktok}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

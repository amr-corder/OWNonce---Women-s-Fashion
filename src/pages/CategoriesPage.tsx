import React from 'react';
import { ArrowRight, Layers3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

export const CategoriesPage: React.FC = () => {
  const { categories, products } = useStore();
  const { isArabic } = useLanguage();

  const getCategoryProducts = (categoryName: string) =>
    products.filter((product) => product.category.trim().toLowerCase() === categoryName.trim().toLowerCase());

  return (
    <div id="categories-page" className="min-h-screen bg-[#F5E6D3] text-[#4A382D] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <span className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.3em] text-[#77553b] font-semibold block mb-2">
            {isArabic ? 'اكتشفي مجموعاتنا' : 'Explore Our Collections'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#4A382D] font-normal">
            {isArabic ? 'الفئات' : 'Shop by Category'}
          </h1>
          <p className="text-xs sm:text-sm text-[#82756c] leading-relaxed mt-3">
            {isArabic
              ? 'اختاري الفئة المناسبة لاستكشاف المنتجات المتاحة بها.'
              : 'Choose a category to explore the products curated within it.'}
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] py-16 px-6 text-center shadow-xs">
            <Layers3 className="w-8 h-8 mx-auto mb-3 text-[#B89578]" />
            <p className="font-serif text-lg text-[#4A382D]">
              {isArabic ? 'لا توجد فئات متاحة حاليًا.' : 'No categories are available yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {categories.map((category) => {
              const categoryProducts = getCategoryProducts(category.name);
              const image = category.image;

              return (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="group bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] bg-[#F5E6D3] overflow-hidden">
                    {image ? (
                      <img
                        src={image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-6 text-center bg-[#B89578] text-[#FFFDF9]">
                        <span className="font-serif text-2xl sm:text-3xl leading-tight">{category.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-serif text-[#4A382D] group-hover:text-[#77553b] transition-colors">
                          {category.name}
                        </h2>
                        <p className="text-xs text-[#82756c] mt-2 leading-relaxed min-h-10">
                          {category.description ||
                            (isArabic ? 'اكتشفي القطع المتاحة من هذه الفئة.' : 'Discover the available pieces in this collection.')}
                        </p>
                        <span className="inline-block text-[10px] uppercase tracking-wider text-[#77553b] font-semibold mt-4">
                          {categoryProducts.length} {isArabic ? 'منتج' : categoryProducts.length === 1 ? 'Product' : 'Products'}
                        </span>
                        {category.types && category.types.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {category.types.map((type) => (
                              <span key={type} className="px-2 py-1 bg-[#F5E6D3] text-[#77553b] text-[10px] rounded">
                                {type}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 shrink-0 text-[#B89578] transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

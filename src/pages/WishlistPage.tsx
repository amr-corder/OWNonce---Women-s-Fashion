import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WishlistPage: React.FC = () => {
  const { wishlistIds, products, toggleWishlist, addToCart } = useStore();

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div id="wishlist-page" className="min-h-screen bg-[#F5E6D3] text-[#4A382D] py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#d4c3b9] pb-6 mb-8">
          <div>
            <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#77553b] font-semibold block mb-1">
              Personal Wardrobe
            </span>
            <h1 className="text-3xl font-serif text-[#4A382D]">
              Saved Wishlist ({wishlistProducts.length})
            </h1>
          </div>

          {wishlistProducts.length > 0 && (
            <button
              onClick={() => {
                wishlistProducts.forEach((p) =>
                  addToCart(p, p.colors[0], p.sizes[0], 1)
                );
              }}
              className="px-4 py-2.5 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-xs font-sans uppercase tracking-wider font-semibold rounded transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Move All to Bag</span>
            </button>
          )}
        </div>

        {/* Empty State */}
        {wishlistProducts.length === 0 ? (
          <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] py-20 px-6 text-center space-y-4 shadow-xs">
            <Heart className="w-12 h-12 mx-auto text-[#d4c3b9] stroke-1" />
            <h2 className="text-xl font-serif text-[#4A382D]">Your wishlist is currently empty</h2>
            <p className="text-xs text-[#82756c] max-w-sm mx-auto">
              Save your favorite basic tops to curate your essential seasonal wardrobe.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-xs font-sans uppercase tracking-wider font-semibold rounded transition-colors mt-2"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#FFFDF9] rounded-lg border border-[#d4c3b9] overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div className="aspect-[4/5] bg-[#F5E6D3] relative overflow-hidden">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-[#FFFDF9] text-red-600 rounded-full shadow-xs hover:bg-red-50 cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-[#27180F]/70 text-[#FFFDF9] text-[10px] rounded backdrop-blur-xs">
                    {product.weight} KG
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#82756c] block mb-1">
                      {product.category}
                    </span>
                    <Link to={`/products/${product.id}`}>
                      <h3 className="text-sm font-medium text-[#4A382D] hover:text-[#77553b] transition-colors leading-snug line-clamp-1 mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-baseline gap-2 mb-3 flex-wrap">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-[#82756c] dark:text-[#A8988C] line-through font-normal">
                          {product.originalPrice.toLocaleString()} EGP
                        </span>
                      )}
                      <span className="text-sm font-semibold text-[#4A382D] dark:text-[#FAF6F0]">
                        {product.price.toLocaleString()} EGP
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(product, product.colors[0], product.sizes[0], 1);
                      toggleWishlist(product.id);
                    }}
                    className="w-full py-2.5 px-3 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-xs font-sans font-semibold tracking-wider uppercase rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

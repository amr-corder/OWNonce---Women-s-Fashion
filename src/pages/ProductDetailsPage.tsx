import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Check,
  Star,
  Ruler,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductColor } from '../types';
import { SizeGuideModal } from '../components/SizeGuideModal';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    products,
    addToCart,
    isInWishlist,
    toggleWishlist,
    reviews,
    addReview,
  } = useStore();

  const product = products.find((p) => p.id === id);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    product?.colors[0] || null
  );
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [colorError, setColorError] = useState(false);

  // Review Submission State
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [revName, setRevName] = useState('');
  const [revOrderId, setRevOrderId] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center p-6 text-center">
        <div className="bg-[#FFFDF9] p-8 rounded-lg border border-[#d4c3b9] max-w-md space-y-4">
          <h2 className="text-xl font-serif text-[#4A382D]">Product Not Found</h2>
          <p className="text-xs text-[#82756c]">
            The piece you are looking for is currently unavailable or has been archived.
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-2.5 bg-[#B89578] text-[#FFFDF9] text-xs uppercase tracking-wider font-semibold rounded"
          >
            Return to Collection
          </Link>
        </div>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  // Filter reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id && r.isApproved);
  const averageRating =
    productReviews.length > 0
      ? (
          productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
        ).toFixed(1)
      : '5.0';

  const handleAddToCartClick = () => {
    if (!selectedColor) {
      setColorError(true);
      return;
    }
    setColorError(false);
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) return;

    addReview({
      productId: product.id,
      orderId: revOrderId.trim() || undefined,
      customerName: revName.trim(),
      rating: revRating,
      comment: revComment.trim(),
    });

    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewFormOpen(false);
      setReviewSubmitted(false);
      setRevName('');
      setRevOrderId('');
      setRevComment('');
    }, 2000);
  };

  return (
    <div id="product-details-page" className="min-h-screen bg-[#F5E6D3] text-[#4A382D] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-sans tracking-wider uppercase text-[#82756c] hover:text-[#4A382D] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>
        </div>

        {/* Product Main Container */}
        <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-6 sm:p-10 shadow-xs mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Gallery Column */}
            <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-16 h-20 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                        activeImageIdx === idx ? 'border-[#77553b]' : 'border-transparent opacity-75'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Photo Frame */}
              <div className="flex-1 aspect-[3/4] bg-[#F5E6D3] rounded-lg overflow-hidden border border-[#d4c3b9] relative">
                <img
                  src={product.images[activeImageIdx] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Weight Tag Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-[#27180F]/75 text-[#FFFDF9] text-xs font-sans rounded-md tracking-wider backdrop-blur-xs">
                  Weight: {product.weight} KG
                </div>
              </div>
            </div>

            {/* Product Meta & Buying Controls Column */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Category */}
                <span className="text-xs uppercase font-sans tracking-[0.25em] text-[#77553b] font-semibold block mb-1">
                  {product.category}
                </span>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-serif text-[#4A382D] font-normal leading-tight mb-2">
                  {product.name}
                </h1>

                {/* Reviews summary */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-amber-600">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-[#82756c]">
                    {averageRating} ({productReviews.length} client reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6 flex-wrap">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base sm:text-lg text-[#82756c] dark:text-[#A8988C] line-through font-normal">
                      {product.originalPrice.toLocaleString()} EGP
                    </span>
                  )}
                  <span className="text-2xl sm:text-3xl font-serif font-semibold text-[#4A382D] dark:text-[#FAF6F0]">
                    {product.price.toLocaleString()} EGP
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm font-sans text-[#82756c] leading-relaxed mb-6 border-b border-[#d4c3b9]/50 pb-6">
                  {product.description}
                </p>

                {/* 1. Color Picker (Required) */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#4A382D] uppercase tracking-wider">
                      Select Color: <span className="font-normal text-[#77553b]">{selectedColor?.name || 'Please select'}</span>
                    </span>
                    {colorError && (
                      <span className="text-xs text-red-600 font-medium">Color selection required</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {product.colors.map((c, colorIndex) => {
                      const isSelected = selectedColor?.name === c.name;
                      return (
                        <button
                          key={c.name}
                          type="button"
                          title={c.name}
                          onClick={() => {
                            setSelectedColor(c);
                            if (product.images[colorIndex]) {
                              setActiveImageIdx(colorIndex);
                            }
                            setColorError(false);
                          }}
                          className={`w-8 h-8 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? 'ring-3 ring-[#77553b] ring-offset-2 ring-offset-[#FFFDF9] scale-105'
                              : 'border border-[#d4c3b9] opacity-85 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        >
                          {isSelected && (
                            <Check
                              className={`w-4 h-4 ${
                                c.hex.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Size Selector (Required) */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#4A382D] uppercase tracking-wider">
                      Select Size
                    </span>
                    <button
                      onClick={() => setSizeGuideOpen(true)}
                      className="inline-flex items-center gap-1 text-xs text-[#77553b] hover:underline cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Guide</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {product.sizes.map((s) => {
                      const isSelected = selectedSize === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                          className={`py-2.5 text-xs font-sans font-semibold rounded border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#B89578] border-[#B89578] text-[#FFFDF9]'
                              : 'bg-[#F5E6D3]/40 border-[#d4c3b9] text-[#4A382D] hover:bg-[#F5E6D3]'
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Quantity & Stock */}
                <div className="flex items-center gap-6 mb-6">
                  <div>
                    <span className="text-xs font-semibold text-[#4A382D] uppercase tracking-wider block mb-1.5">
                      Quantity
                    </span>
                    <div className="flex items-center border border-[#d4c3b9] rounded bg-[#F5E6D3]/30">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3 py-1.5 text-sm hover:bg-[#F5E6D3] text-[#4A382D] cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 text-xs font-semibold text-[#4A382D]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-3 py-1.5 text-sm hover:bg-[#F5E6D3] text-[#4A382D] cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="pt-5">
                    <span className="text-xs text-[#82756c]">
                      {product.stock > 0 ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium">Temporarily Sold Out</span>
                      )}
                    </span>
                    <span className="text-[11px] text-[#82756c] block mt-0.5">
                      Total item weight: {(product.weight * quantity).toFixed(2)} KG
                    </span>
                  </div>
                </div>

                {/* 4. Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleAddToCartClick}
                    disabled={!product.isAvailable || product.stock <= 0}
                    className="flex-1 py-4 px-6 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-xs font-sans font-semibold tracking-[0.2em] uppercase rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`group/heart p-4 border rounded transition-all duration-200 cursor-pointer flex items-center justify-center ${
                      isFavorited
                        ? 'border-red-400 dark:border-red-500/60 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-[#ff4d4d] shadow-sm'
                        : 'border-[#d4c3b9] dark:border-[#4A382D] hover:border-red-400 dark:hover:border-red-500/60 hover:bg-red-50/50 dark:hover:bg-red-950/30 text-[#4A382D] dark:text-[#F3EBE1]'
                    }`}
                    title="Save to Wishlist"
                  >
                    <Heart
                      className={`w-5 h-5 transition-all duration-200 group-hover/heart:scale-115 active:scale-125 ${
                        isFavorited
                          ? 'fill-current text-red-600 dark:text-[#ff4d4d]'
                          : 'text-[#4A382D] dark:text-[#F3EBE1] group-hover/heart:text-[#dc2626] dark:group-hover/heart:text-[#ff4d4d] group-hover/heart:fill-[#dc2626]/20 dark:group-hover/heart:fill-[#ff4d4d]/30'
                      }`}
                      strokeWidth={isFavorited ? 2 : 2.2}
                    />
                  </button>
                </div>
              </div>

              {/* Quality & Shipping Guarantee Badges */}
              <div className="pt-6 border-t border-[#d4c3b9]/50 grid grid-cols-3 gap-2 text-center text-[11px] text-[#82756c]">
                <div className="p-2 bg-[#F5E6D3]/40 rounded">
                  <Truck className="w-4 h-4 mx-auto mb-1 text-[#77553b]" />
                  <span>Doorstep Egypt Shipping</span>
                </div>
                <div className="p-2 bg-[#F5E6D3]/40 rounded">
                  <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-[#77553b]" />
                  <span>94% Cotton / 6% Lycra</span>
                </div>
                <div className="p-2 bg-[#F5E6D3]/40 rounded">
                  <RotateCcw className="w-4 h-4 mx-auto mb-1 text-[#77553b]" />
                  <span>Exchange Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d4c3b9] pb-6 mb-8 gap-4">
            <div>
              <h3 className="text-xl font-serif text-[#4A382D]">Customer Reviews</h3>
              <p className="text-xs text-[#82756c] mt-0.5">
                Feedback from verified clients who purchased this item.
              </p>
            </div>
            <button
              onClick={() => setReviewFormOpen(!reviewFormOpen)}
              className="px-4 py-2.5 border border-[#77553b] hover:bg-[#77553b] text-[#77553b] hover:text-[#FFFDF9] text-xs font-sans font-semibold tracking-wider uppercase rounded transition-colors cursor-pointer"
            >
              {reviewFormOpen ? 'Close Review Form' : 'Write a Review'}
            </button>
          </div>

          {/* Write Review Form */}
          {reviewFormOpen && (
            <form
              onSubmit={handleReviewSubmit}
              className="bg-[#F5E6D3]/50 p-6 rounded-lg border border-[#d4c3b9] mb-8 space-y-4 max-w-xl"
            >
              <h4 className="text-sm font-serif font-semibold text-[#4A382D]">
                Share Your Experience with this Piece
              </h4>

              {reviewSubmitted ? (
                <div className="p-4 bg-emerald-100 text-emerald-800 rounded text-xs">
                  Thank you! Your review has been submitted for verified moderation.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-[#4A382D] block mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={revName}
                        onChange={(e) => setRevName(e.target.value)}
                        placeholder="e.g. Leila K."
                        className="w-full text-xs p-2.5 bg-[#FFFDF9] border border-[#d4c3b9] rounded focus:outline-none focus:border-[#77553b]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#4A382D] block mb-1">
                        Order Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={revOrderId}
                        onChange={(e) => setRevOrderId(e.target.value)}
                        placeholder="e.g. OWN-98421"
                        className="w-full text-xs p-2.5 bg-[#FFFDF9] border border-[#d4c3b9] rounded focus:outline-none focus:border-[#77553b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#4A382D] block mb-1">
                      Rating *
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRevRating(s)}
                          className="p-1 text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${s <= revRating ? 'fill-current' : 'stroke-1'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#4A382D] block mb-1">
                      Review Comments *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={revComment}
                      onChange={(e) => setRevComment(e.target.value)}
                      placeholder="Comment on the fabric feel, neckline depth, and overall fit..."
                      className="w-full text-xs p-2.5 bg-[#FFFDF9] border border-[#d4c3b9] rounded focus:outline-none focus:border-[#77553b]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-xs font-sans uppercase tracking-wider font-semibold rounded cursor-pointer transition-colors"
                  >
                    Submit Review
                  </button>
                </>
              )}
            </form>
          )}

          {/* Reviews List */}
          {productReviews.length === 0 ? (
            <p className="text-xs text-[#82756c] py-6 text-center">
              No reviews written for this piece yet. Be the first to share your thoughts!
            </p>
          ) : (
            <div className="space-y-6 divide-y divide-[#d4c3b9]/40">
              {productReviews.map((rev) => (
                <div key={rev.id} className="pt-4 first:pt-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#4A382D]">
                        {rev.customerName}
                      </span>
                      {rev.orderId && (
                        <span className="text-[10px] bg-[#F5E6D3] text-[#77553b] px-2 py-0.5 rounded font-mono">
                          Verified Order #{rev.orderId}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-amber-600">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#4A382D] leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
};

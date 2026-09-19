import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Scale, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ALL_GOVERNORATES } from '../data/shippingRates';

export const CartPage: React.FC = () => {
  const {
    cart,
    totalCartWeight,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getShippingForGovernorate,
    shippingConfig,
  } = useStore();
  const navigate = useNavigate();

  const [previewGovernorate, setPreviewGovernorate] = useState<string>('Cairo');

  const shippingEstimate = getShippingForGovernorate(previewGovernorate, totalCartWeight);
  const estimatedShippingCost = shippingEstimate.isCalculable ? shippingEstimate.shippingCost : 0;
  const estimatedTotal = cartSubtotal + estimatedShippingCost;

  return (
    <div id="cart-page" className="min-h-screen bg-[#F5E6D3] text-[#4A382D] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#d4c3b9] pb-6 mb-8">
          <div>
            <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#77553b] font-semibold block mb-1">
              Shopping Cart
            </span>
            <h1 className="text-3xl font-serif text-[#4A382D]">
              Your Bag ({cart.reduce((s, i) => s + i.quantity, 0)} items)
            </h1>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-sans text-[#82756c] hover:text-red-700 underline cursor-pointer"
            >
              Clear Bag
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-[#FFFDF9] dark:bg-[#1D1612] rounded-2xl border border-[#d4c3b9] dark:border-[#382C24] py-16 sm:py-20 px-6 text-center space-y-4 shadow-xs max-w-2xl mx-auto transition-colors">
            <ShoppingBag className="w-12 h-12 mx-auto text-[#d4c3b9] dark:text-[#524135] stroke-1" />
            <h2 className="text-xl font-serif text-[#4A382D] dark:text-[#FFFDF9]">Your shopping bag is empty</h2>
            <p className="text-xs text-[#82756c] dark:text-[#AD9E92] max-w-sm mx-auto">
              Explore our core tops collection and find your perfect essential style.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-xs font-sans uppercase tracking-wider font-semibold rounded-xl transition-colors shadow-xs"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/order-success/demo"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#FAF6F0] dark:bg-[#281E18] hover:bg-[#F5E6D3] dark:hover:bg-[#34271F] border border-[#d4c3b9] dark:border-[#423329] text-[#77553b] dark:text-[#E6D0BA] text-xs font-sans uppercase tracking-wider font-semibold rounded-xl transition-colors shadow-xs"
              >
                <Truck className="w-3.5 h-3.5 text-[#B89578]" />
                <span>Preview Delivery Car Animation</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => {
                const itemTotalWeight = (item.product.weight * item.quantity).toFixed(2);
                return (
                  <div
                    key={item.id}
                    className="bg-[#FFFDF9] rounded-lg border border-[#d4c3b9] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-24 sm:w-24 sm:h-28 bg-[#F5E6D3] rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-[#82756c] block">
                        {item.product.category}
                      </span>
                      <Link to={`/products/${item.productId}`}>
                        <h3 className="text-sm font-medium text-[#4A382D] hover:text-[#77553b] leading-tight">
                          {item.product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-3 pt-1 text-xs text-[#82756c]">
                        {/* Selected Color */}
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-[#d4c3b9] inline-block"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span>{item.selectedColor.name}</span>
                        </div>

                        <span>•</span>

                        {/* Selected Size */}
                        <div>
                          Size: <strong className="text-[#4A382D]">{item.selectedSize}</strong>
                        </div>

                        <span>•</span>

                        {/* Weight */}
                        <div className="flex items-center gap-1">
                          <Scale className="w-3 h-3 text-[#77553b]" />
                          <span>{itemTotalWeight} KG</span>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-2 pt-1 flex-wrap">
                        {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                          <span className="text-xs text-[#82756c] dark:text-[#A8988C] line-through font-normal">
                            {item.product.originalPrice.toLocaleString()} EGP
                          </span>
                        )}
                        <span className="text-sm font-semibold text-[#77553b] dark:text-[#D1B198]">
                          {item.product.price.toLocaleString()} EGP
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls & Remove */}
                    <div className="flex sm:flex-col items-center justify-between w-full sm:w-auto gap-4 sm:gap-2">
                      <div className="flex items-center border border-[#d4c3b9] rounded bg-[#F5E6D3]/40">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="px-2.5 py-1 text-xs hover:bg-[#F5E6D3] text-[#4A382D] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-semibold text-[#4A382D]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="px-2.5 py-1 text-xs hover:bg-[#F5E6D3] text-[#4A382D] cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-[#82756c] hover:text-red-700 flex items-center gap-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Summary & Automatic Shipping Calculator */}
            <div className="lg:col-span-4">
              <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-6 shadow-xs space-y-6 sticky top-28">
                <h3 className="text-lg font-serif text-[#4A382D] border-b border-[#d4c3b9] pb-3">
                  Order Summary
                </h3>

                {/* Subtotal */}
                <div className="space-y-2.5 text-xs text-[#4A382D]">
                  <div className="flex justify-between">
                    <span className="text-[#82756c]">Cart Subtotal</span>
                    <span className="font-semibold">{cartSubtotal.toLocaleString()} EGP</span>
                  </div>

                  {/* Total Weight in KG */}
                  <div className="flex justify-between items-center py-1 border-t border-b border-[#d4c3b9]/40">
                    <div className="flex items-center gap-1.5 text-[#82756c]">
                      <Scale className="w-3.5 h-3.5 text-[#77553b]" />
                      <span>Total Order Weight</span>
                    </div>
                    <span className="font-semibold text-[#77553b]">{totalCartWeight} KG</span>
                  </div>
                </div>

                {/* Shipping Zone Estimator */}
                <div className="p-3.5 bg-[#F5E6D3]/50 rounded-lg border border-[#d4c3b9] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4A382D]">
                      <MapPin className="w-3.5 h-3.5 text-[#77553b]" />
                      <span>Estimate Shipping</span>
                    </div>
                    <span className="text-[10px] text-[#82756c]">
                      From: <strong>{shippingConfig.originZone}</strong>
                    </span>
                  </div>

                  <select
                    value={previewGovernorate}
                    onChange={(e) => setPreviewGovernorate(e.target.value)}
                    className="w-full bg-[#FFFDF9] text-xs p-2 rounded border border-[#d4c3b9] text-[#4A382D] focus:outline-none"
                  >
                    {ALL_GOVERNORATES.map((g) => (
                      <option key={g.name} value={g.name}>
                        {g.name} ({g.zone})
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#82756c]">
                      Destination Zone:{' '}
                      <strong className="text-[#4A382D]">
                        {shippingEstimate.destinationZone || 'Unknown'}
                      </strong>
                    </span>
                    <span className="font-semibold text-[#77553b]">
                      {shippingEstimate.isCalculable
                        ? `${shippingEstimate.shippingCost} EGP`
                        : 'Contact store'}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-[#d4c3b9] flex items-baseline justify-between">
                  <div>
                    <span className="text-sm font-serif font-bold text-[#4A382D]">Estimated Total</span>
                    <span className="text-[10px] text-[#82756c] block">Includes shipping</span>
                  </div>
                  <span className="text-xl font-serif font-bold text-[#4A382D]">
                    {estimatedTotal.toLocaleString()} EGP
                  </span>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-xs font-sans font-semibold tracking-[0.2em] uppercase rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-[11px] text-[#82756c] text-center space-y-1">
                  <p>• InstaPay, Vodafone Cash & Cash on Delivery</p>
                  <p>• No account or customer login required</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

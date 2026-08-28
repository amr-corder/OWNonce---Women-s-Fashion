import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Scale,
  MapPin,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, OrderItem } from '../types';
import { ALL_GOVERNORATES } from '../data/shippingRates';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    totalCartWeight,
    cartSubtotal,
    createOrder,
    getShippingForGovernorate,
    shippingConfig,
    settings,
  } = useStore();
  const navigate = useNavigate();

  // Track if user successfully submitted order to prevent redirecting to /cart when cart clears
  const isOrderSubmittedRef = useRef(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [governorate, setGovernorate] = useState('Cairo');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vodafone_cash');

  // Proof upload states: 'empty' | 'uploading' | 'uploaded' | 'error'
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'empty' | 'uploading' | 'uploaded' | 'error'>('empty');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Only redirect to cart if the cart was genuinely empty on initial visit, not after placing an order
    if (cart.length === 0 && !isOrderSubmittedRef.current && !isSubmitting) {
      navigate('/cart');
    }
  }, [cart, navigate, isSubmitting]);

  // Automatic Shipping Calculation based on customer's selected governorate
  const shippingCalculation = getShippingForGovernorate(governorate, totalCartWeight);
  const shippingCost = shippingCalculation.isCalculable ? shippingCalculation.shippingCost : 0;
  const grandTotal = cartSubtotal + shippingCost;

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadStatus('error');
      setUploadError('Please select a valid image file (PNG, JPG, JPEG).');
      return;
    }

    setUploadStatus('uploading');
    setProofFile(file);
    const objectUrl = URL.createObjectURL(file);
    setProofPreviewUrl(objectUrl);
    
    // Simulate instantaneous verification
    setTimeout(() => {
      setUploadStatus('uploaded');
      setUploadError(null);
    }, 400);
  };

  const handleRemoveProof = () => {
    setProofFile(null);
    setProofPreviewUrl(null);
    setUploadStatus('empty');
    setUploadError(null);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phoneNumber.trim() || !city.trim() || !address.trim()) {
      alert('Please fill in all required shipping address fields.');
      return;
    }

    // Require payment proof if InstaPay or Vodafone Cash
    if ((paymentMethod === 'instapay' || paymentMethod === 'vodafone_cash') && !proofFile) {
      setUploadStatus('error');
      setUploadError('Payment transfer screenshot or receipt proof is required.');
      return;
    }

    setIsSubmitting(true);
    isOrderSubmittedRef.current = true;

    try {
      const orderItems: OrderItem[] = cart.map((c) => ({
        productId: c.productId,
        productName: c.product.name,
        productImage: c.product.images[0],
        selectedColor: c.selectedColor,
        selectedSize: c.selectedSize,
        price: c.product.price,
        quantity: c.quantity,
        weight: c.product.weight,
        totalItemWeight: Number((c.product.weight * c.quantity).toFixed(2)),
      }));

      const newOrder = await createOrder({
        customerName: fullName.trim(),
        customerPhone: phoneNumber.trim(),
        governorate,
        destinationZone: shippingCalculation.destinationZone || 'Greater Cairo',
        city: city.trim(),
        address: address.trim(),
        notes: notes.trim() || undefined,
        items: orderItems,
        subtotal: cartSubtotal,
        totalWeight: totalCartWeight,
        originZone: shippingConfig.originZone,
        shippingCost,
        total: grandTotal,
        paymentMethod,
        paymentProofFile: proofFile || undefined,
      });

      navigate(`/order-success/${newOrder.orderNumber}`, { replace: true });
    } catch (err) {
      console.error(err);
      isOrderSubmittedRef.current = false;
      alert('An unexpected error occurred while placing your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div id="checkout-page" className="min-h-screen bg-[#F5E6D3] text-[#4A382D] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-[#d4c3b9] pb-6 mb-8">
          <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#77553b] font-semibold block mb-1">
            Express Checkout
          </span>
          <h1 className="text-3xl font-serif text-[#4A382D]">Complete Your Order</h1>
          <p className="text-xs text-[#82756c] mt-1">
            No registration required. Enter your delivery address and choose your preferred payment method.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Information */}
            <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-lg font-serif text-[#4A382D] border-b border-[#d4c3b9] pb-3">
                1. Customer & Delivery Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#4A382D] block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Leila Mansour"
                    className="w-full text-xs p-3 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded focus:outline-none focus:border-[#77553b]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4A382D] block mb-1">
                    Phone Number (WhatsApp Active) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 01012345678"
                    className="w-full text-xs p-3 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded focus:outline-none focus:border-[#77553b]"
                  />
                </div>
              </div>

              {/* Governorate Dropdown (Drives Shipping Calculator) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#4A382D] block mb-1 flex items-center justify-between">
                    <span>Governorate *</span>
                    <span className="text-[10px] text-[#77553b] font-normal">
                      Zone: {shippingCalculation.destinationZone || 'Auto'}
                    </span>
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full text-xs p-3 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded focus:outline-none focus:border-[#77553b] cursor-pointer"
                  >
                    {ALL_GOVERNORATES.map((g) => (
                      <option key={g.name} value={g.name}>
                        {g.name} ({g.zone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4A382D] block mb-1">
                    City / District *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. New Cairo / Heliopolis"
                    className="w-full text-xs p-3 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded focus:outline-none focus:border-[#77553b]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4A382D] block mb-1">
                  Detailed Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Building number, Street name, Floor, Apartment"
                  className="w-full text-xs p-3 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded focus:outline-none focus:border-[#77553b]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4A382D] block mb-1">
                  Delivery Notes / Landmarks (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions for courier delivery..."
                  className="w-full text-xs p-3 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded focus:outline-none focus:border-[#77553b]"
                />
              </div>
            </div>

            {/* 2. Payment Method Section */}
            <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-lg font-serif text-[#4A382D] border-b border-[#d4c3b9] pb-3">
                2. Select Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Vodafone Cash */}
                <div
                  onClick={() => setPaymentMethod('vodafone_cash')}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'vodafone_cash'
                      ? 'border-[#77553b] bg-[#F5E6D3]/60 ring-2 ring-[#77553b]'
                      : 'border-[#d4c3b9] bg-[#FFFDF9] hover:bg-[#F5E6D3]/30'
                  }`}
                >
                  <div className="font-semibold text-xs text-[#4A382D] mb-1">
                    Vodafone Cash
                  </div>
                  <span className="text-[11px] text-[#82756c] block">
                    Instant Wallet Transfer
                  </span>
                </div>

                {/* InstaPay */}
                <div
                  onClick={() => setPaymentMethod('instapay')}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'instapay'
                      ? 'border-[#77553b] bg-[#F5E6D3]/60 ring-2 ring-[#77553b]'
                      : 'border-[#d4c3b9] bg-[#FFFDF9] hover:bg-[#F5E6D3]/30'
                  }`}
                >
                  <div className="font-semibold text-xs text-[#4A382D] mb-1">
                    InstaPay
                  </div>
                  <span className="text-[11px] text-[#82756c] block">
                    Instant Bank Transfer (IPN)
                  </span>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#77553b] bg-[#F5E6D3]/60 ring-2 ring-[#77553b]'
                      : 'border-[#d4c3b9] bg-[#FFFDF9] hover:bg-[#F5E6D3]/30'
                  }`}
                >
                  <div className="font-semibold text-xs text-[#4A382D] mb-1">
                    Cash on Delivery
                  </div>
                  <span className="text-[11px] text-[#82756c] block">
                    Pay when courier delivers
                  </span>
                </div>
              </div>

              {/* Payment Details & Proof Upload */}
              {paymentMethod === 'vodafone_cash' && (
                <div className="p-4 bg-[#F5E6D3]/50 rounded-lg border border-[#d4c3b9] space-y-3 text-xs text-[#4A382D]">
                  <p className="font-semibold">Vodafone Cash Transfer Instructions:</p>
                  <p>
                    Please transfer the total amount (<strong>{grandTotal.toLocaleString()} EGP</strong>) to the official OWNonce Vodafone Cash wallet number:
                  </p>
                  <div className="p-3 bg-[#FFFDF9] rounded border border-[#A98265] text-center">
                    <span className="text-base sm:text-lg font-mono font-bold tracking-widest text-[#77553b]">
                      {settings.vodafoneCashNumber || '01022267922'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#82756c]">
                    After completing the transfer, please upload the screenshot or receipt below.
                  </p>
                </div>
              )}

              {paymentMethod === 'instapay' && (
                <div className="p-4 bg-[#F5E6D3]/50 rounded-lg border border-[#d4c3b9] space-y-3 text-xs text-[#4A382D]">
                  <p className="font-semibold">InstaPay (IPN) Transfer Instructions:</p>
                  <p>
                    Please send (<strong>{grandTotal.toLocaleString()} EGP</strong>) via your mobile banking app or InstaPay to:
                  </p>
                  <div className="p-3 bg-[#FFFDF9] rounded border border-[#A98265] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#82756c]">InstaPay Address (IPA):</span>
                      <span className="font-mono font-bold text-[#77553b]">{settings.instapayAccount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#82756c]">Account Name:</span>
                      <span className="font-semibold text-[#4A382D]">{settings.instapayName}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#82756c]">
                    Please upload the successful transfer screenshot below to confirm dispatch.
                  </p>
                </div>
              )}

              {/* Payment Proof Upload for InstaPay / Vodafone Cash */}
              {(paymentMethod === 'instapay' || paymentMethod === 'vodafone_cash') && (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-[#4A382D] block">
                    Upload Payment Transfer Proof (Screenshot / Receipt) *
                  </label>

                  {uploadError && (
                    <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-xs rounded flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {!proofPreviewUrl ? (
                    <label className="border-2 border-dashed border-[#d4c3b9] hover:border-[#77553b] bg-[#FFFDF9] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors">
                      <Upload className="w-8 h-8 text-[#A98265] mb-2" />
                      <span className="text-xs font-medium text-[#4A382D]">
                        Click to select image or drag & drop receipt
                      </span>
                      <span className="text-[10px] text-[#82756c] mt-1">PNG, JPG or JPEG</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProofChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="p-3 bg-[#FFFDF9] border border-[#d4c3b9] rounded-lg flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={proofPreviewUrl}
                          alt="Payment Receipt Preview"
                          className="w-12 h-12 object-cover rounded border border-[#d4c3b9]"
                        />
                        <div>
                          <p className="text-xs font-medium text-[#4A382D] line-clamp-1">
                            {proofFile?.name}
                          </p>
                          <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Proof Verified & Attached
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveProof}
                        className="p-1 text-[#82756c] hover:text-red-700 cursor-pointer"
                        title="Remove Proof"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 space-y-1">
                  <p className="font-semibold">Cash on Delivery Confirmed</p>
                  <p className="text-emerald-700">
                    No advance payment or proof required. You will pay the courier in cash upon receiving your order.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-6 sm:p-8 shadow-xs space-y-6 sticky top-28">
              <h2 className="text-lg font-serif text-[#4A382D] border-b border-[#d4c3b9] pb-3">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-[#d4c3b9]/40 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-14 object-cover rounded bg-[#F5E6D3]"
                      />
                      <div>
                        <h4 className="font-medium text-[#4A382D] line-clamp-1">{item.product.name}</h4>
                        <div className="text-[11px] text-[#82756c] flex items-center gap-1.5 mt-0.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block border border-[#d4c3b9]"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span>{item.selectedColor.name}</span>
                          <span>•</span>
                          <span>Size: {item.selectedSize}</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-semibold text-[#77553b] whitespace-nowrap">
                      {(item.product.price * item.quantity).toLocaleString()} EGP
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations breakdown */}
              <div className="border-t border-[#d4c3b9] pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-[#4A382D]">
                  <span className="text-[#82756c]">Subtotal</span>
                  <span className="font-semibold">{cartSubtotal.toLocaleString()} EGP</span>
                </div>

                {/* Total Weight in KG */}
                <div className="flex justify-between items-center text-[#4A382D]">
                  <div className="flex items-center gap-1.5 text-[#82756c]">
                    <Scale className="w-3.5 h-3.5 text-[#77553b]" />
                    <span>Total Weight</span>
                  </div>
                  <span className="font-semibold text-[#77553b]">{totalCartWeight} KG</span>
                </div>

                {/* Shipping Cost */}
                <div className="flex justify-between items-center text-[#4A382D]">
                  <div className="flex items-center gap-1.5 text-[#82756c]">
                    <Truck className="w-3.5 h-3.5 text-[#77553b]" />
                    <span>
                      Shipping ({governorate} → {shippingCalculation.destinationZone || 'Zone'})
                    </span>
                  </div>
                  <span className="font-semibold text-[#77553b]">
                    {shippingCalculation.isCalculable ? `${shippingCost} EGP` : 'Pending calculation'}
                  </span>
                </div>

                {/* Grand Total */}
                <div className="border-t border-[#d4c3b9] pt-3 flex items-baseline justify-between">
                  <span className="text-base font-serif font-bold text-[#4A382D]">Total</span>
                  <span className="text-2xl font-serif font-bold text-[#4A382D]">
                    {grandTotal.toLocaleString()} EGP
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || !shippingCalculation.isCalculable}
                className="w-full py-4 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-xs font-sans font-semibold tracking-[0.2em] uppercase rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Place Order Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center text-[10px] text-[#82756c] space-y-1">
                <p>• Delivery across Egypt in 24 to 72 business hours</p>
                <p>• Encrypted and secure order processing</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  Calendar,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Eye,
  FileText,
  Home,
  Navigation,
  XCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { PaymentProofModal } from '../components/admin/PaymentProofModal';
import {
  generateInstapayReceiptSvg,
  generateVodafoneCashReceiptSvg,
} from '../utils/paymentProofHelper';

// 5 Standard Stages
const TRACKING_STAGES = [
  {
    key: 'placed',
    title: 'Order Placed',
    description: 'Order received at OWNonce Atelier & logged into system',
    icon: ShoppingBag,
  },
  {
    key: 'confirmed',
    title: 'Order Confirmed',
    description: 'Payment verified, tailoring & quality inspection allocated',
    icon: ShieldCheck,
  },
  {
    key: 'shipped',
    title: 'Order Shipped',
    description: 'Boxed in signature packaging & handed over to courier',
    icon: Package,
  },
  {
    key: 'out_for_delivery',
    title: 'Out for Delivery',
    description: 'Courier is in your area, preparing for handover today',
    icon: Truck,
  },
  {
    key: 'delivered',
    title: 'Delivered',
    description: 'Package successfully delivered and signed for',
    icon: Home,
  },
];

// Helper to calculate stage index from OrderStatus
function getStageIndex(status: OrderStatus): number {
  switch (status) {
    case 'Order Placed':
    case 'Pending':
      return 0;
    case 'Confirmed':
      return 1;
    case 'Shipped':
      return 2;
    case 'Out for Delivery':
      return 3;
    case 'Delivered':
      return 4;
    case 'Cancelled':
      return -1;
    default:
      return 0;
  }
}

// Normalizer for order matching
function normalizeId(id: string): string {
  return id.replace(/^#/, '').replace(/^OWN-/i, '').trim().toLowerCase();
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '').replace(/^20/, '').replace(/^0/, '');
}

export const TrackOrderPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { orders, settings } = useStore();

  const [orderIdInput, setOrderIdInput] = useState<string>('');
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<boolean>(false);
  const [isProofModalOpen, setIsProofModalOpen] = useState<boolean>(false);

  // Auto-search from query params if provided
  useEffect(() => {
    const qOrderId = searchParams.get('orderId') || searchParams.get('id') || '';
    const qPhone = searchParams.get('phone') || '';

    if (qOrderId) {
      setOrderIdInput(qOrderId);
    }
    if (qPhone) {
      setPhoneInput(qPhone);
    }

    if (qOrderId && orders.length > 0) {
      executeSearch(qOrderId, qPhone);
    }
  }, [searchParams, orders]);

  const executeSearch = (rawId: string, rawPhone: string) => {
    setHasSearched(true);
    const cleanId = normalizeId(rawId);
    const cleanPhone = normalizePhone(rawPhone);

    if (!cleanId) {
      setMatchedOrder(null);
      return;
    }

    // Find order matching ID and (if phone provided) phone
    const found = orders.find((o) => {
      const orderCleanId = normalizeId(o.orderNumber);
      const orderRawId = normalizeId(o.id);
      const idMatches =
        orderCleanId === cleanId ||
        orderRawId === cleanId ||
        o.orderNumber.toLowerCase() === rawId.trim().toLowerCase();

      if (!idMatches) return false;

      // If user provided a phone number, check phone match
      if (cleanPhone) {
        const orderPhoneClean = normalizePhone(o.customerPhone);
        return (
          orderPhoneClean.endsWith(cleanPhone) ||
          cleanPhone.endsWith(orderPhoneClean) ||
          orderPhoneClean === cleanPhone
        );
      }

      return true;
    });

    setMatchedOrder(found || null);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;

    // Update query params
    const params: Record<string, string> = { orderId: orderIdInput.trim() };
    if (phoneInput.trim()) {
      params.phone = phoneInput.trim();
    }
    setSearchParams(params);

    executeSearch(orderIdInput, phoneInput);
  };

  const handleCopyOrderId = (idText: string) => {
    navigator.clipboard.writeText(idText);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const currentStageIndex = matchedOrder ? getStageIndex(matchedOrder.orderStatus) : 0;
  const isCancelled = matchedOrder?.orderStatus === 'Cancelled';

  // Compute effective digital payment proof URL (uploaded or official SVG)
  const effectiveProofUrl = matchedOrder
    ? matchedOrder.paymentProofUrl ||
      (matchedOrder.paymentMethod === 'instapay'
        ? generateInstapayReceiptSvg(
            matchedOrder.orderNumber,
            matchedOrder.total,
            matchedOrder.customerName,
            new Date(matchedOrder.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            `IPAY-${matchedOrder.orderNumber.replace(/[^0-9]/g, '') || '98421'}`
          )
        : matchedOrder.paymentMethod === 'vodafone_cash'
        ? generateVodafoneCashReceiptSvg(
            matchedOrder.orderNumber,
            matchedOrder.total,
            matchedOrder.customerName,
            new Date(matchedOrder.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            `VF-${matchedOrder.orderNumber.replace(/[^0-9]/g, '') || '98544'}`
          )
        : null)
    : null;

  return (
    <div
      id="track-order-page"
      className="min-h-screen bg-[#F5E6D3] dark:bg-[#140F0C] text-[#4A382D] dark:text-[#F0E6DC] py-10 sm:py-16 transition-colors"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* 1. HERO & TRACKING FORM SECTION */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#FFFDF9]/70 dark:bg-[#2A1E18] border border-[#d4c3b9] dark:border-[#3D3027] rounded-full text-[11px] font-sans tracking-[0.2em] uppercase font-bold text-[#77553b] dark:text-[#D1B198] shadow-xs">
            <Truck className="w-3.5 h-3.5 text-[#B89578]" />
            <span>Live Dispatch & Fulfillment</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#27180F] dark:text-[#FFFDF9]">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6759] dark:text-[#BFB2A8] max-w-lg mx-auto leading-relaxed">
            Enter your Order ID and phone number to monitor real-time preparation, quality control, and courier transit.
          </p>
        </div>

        {/* 2. TRACKING INPUT CARD */}
        <div className="bg-[#FFFDF9] dark:bg-[#1D1612] rounded-2xl sm:rounded-3xl border border-[#d4c3b9] dark:border-[#382C24] p-6 sm:p-8 shadow-md">
          <form onSubmit={handleTrackSubmit} className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-12 sm:gap-4">
            
            {/* Order ID Input */}
            <div className="sm:col-span-5 space-y-1.5 text-left">
              <label
                htmlFor="track-order-id"
                className="block text-[11px] uppercase tracking-[0.15em] font-sans font-bold text-[#77553b] dark:text-[#D1B198]"
              >
                Order ID *
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A08875]" />
                <input
                  id="track-order-id"
                  type="text"
                  required
                  placeholder="e.g. OWN-98544"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-[#FAF6F0] dark:bg-[#281E18] border border-[#d4c3b9] dark:border-[#423329] rounded-xl text-xs font-mono font-medium text-[#27180F] dark:text-[#FFFDF9] placeholder:text-[#A08875]/70 focus:outline-none focus:ring-2 focus:ring-[#B89578] transition-all"
                />
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="sm:col-span-4 space-y-1.5 text-left">
              <label
                htmlFor="track-phone"
                className="block text-[11px] uppercase tracking-[0.15em] font-sans font-bold text-[#77553b] dark:text-[#D1B198]"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A08875]" />
                <input
                  id="track-phone"
                  type="tel"
                  placeholder="e.g. 01001234567"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-[#FAF6F0] dark:bg-[#281E18] border border-[#d4c3b9] dark:border-[#423329] rounded-xl text-xs font-sans text-[#27180F] dark:text-[#FFFDF9] placeholder:text-[#A08875]/70 focus:outline-none focus:ring-2 focus:ring-[#B89578] transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-3 flex items-end">
              <button
                id="track-order-submit-btn"
                type="submit"
                className="w-full py-3.5 px-5 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-xs font-sans uppercase tracking-[0.18em] font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Search className="w-4 h-4" />
                <span>Track Order</span>
              </button>
            </div>
          </form>
        </div>

        {/* 3. ORDER NOT FOUND ERROR STATE */}
        <AnimatePresence>
          {hasSearched && !matchedOrder && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#FFFDF9] dark:bg-[#1D1612] rounded-2xl border border-amber-300 dark:border-amber-900/60 p-6 sm:p-8 text-center space-y-4 shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#27180F] dark:text-[#FFFDF9]">
                  Order not found. Please check your Order ID and phone number.
                </h3>
                <p className="text-xs text-[#7A6759] dark:text-[#BFB2A8] max-w-md mx-auto">
                  Ensure the Order ID is entered correctly (e.g. <strong>OWN-98544</strong>) and that the phone number matches the one provided during checkout.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello OWNonce, I am trying to track my order "${orderIdInput}" but cannot find it. Please assist me.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-sans font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Atelier Support</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. FOUND ORDER DETAILS & TIMELINE */}
        <AnimatePresence>
          {matchedOrder && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              
              {/* CANCELLED ORDER BANNER IF CANCELLED */}
              {isCancelled && (
                <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-2xl p-6 text-center space-y-2 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 flex items-center justify-center mx-auto">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-red-900 dark:text-red-200">
                    Your order has been cancelled.
                  </h3>
                  <p className="text-xs text-red-700 dark:text-red-300/80 max-w-md mx-auto">
                    This order was cancelled by the store administrator or customer request. Any prepaid amounts will be refunded via your original payment channel.
                  </p>
                </div>
              )}

              {/* A. VISUAL ORDER PROGRESS TIMELINE (5 STAGES) */}
              {!isCancelled && (
                <div className="bg-[#FFFDF9] dark:bg-[#1D1612] rounded-3xl border border-[#d4c3b9] dark:border-[#382C24] p-6 sm:p-8 shadow-md space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d4c3b9]/40 dark:border-[#382C24] pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#B89578] font-bold block">
                        Fulfillment Progress
                      </span>
                      <h2 className="text-lg sm:text-xl font-serif font-bold text-[#27180F] dark:text-[#FFFDF9]">
                        Order Status: {matchedOrder.orderStatus}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {TRACKING_STAGES[currentStageIndex]?.title || matchedOrder.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Desktop / Tablet Horizontal Stepper */}
                  <div className="hidden md:block py-4">
                    <div className="relative flex justify-between items-start">
                      {/* Stepper Connecting Background Line */}
                      <div className="absolute top-5 left-8 right-8 h-1 bg-[#EADCCF] dark:bg-[#34271F] -z-0 rounded-full" />
                      
                      {/* Active Progress Fill Line */}
                      <motion.div
                        className="absolute top-5 left-8 h-1 bg-gradient-to-r from-[#B89578] to-[#8F6B4E] -z-0 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(currentStageIndex / (TRACKING_STAGES.length - 1)) * 100}%`,
                        }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />

                      {TRACKING_STAGES.map((stage, idx) => {
                        const Icon = stage.icon;
                        const isCompleted = idx < currentStageIndex;
                        const isCurrent = idx === currentStageIndex;
                        const isUpcoming = idx > currentStageIndex;

                        return (
                          <div
                            key={stage.key}
                            className="relative z-10 flex flex-col items-center text-center max-w-[130px]"
                          >
                            {/* Circle Indicator */}
                            <motion.div
                              initial={{ scale: 0.9 }}
                              animate={{ scale: isCurrent ? [1, 1.08, 1] : 1 }}
                              transition={
                                isCurrent
                                  ? { repeat: Infinity, duration: 2.2, ease: 'easeInOut' }
                                  : undefined
                              }
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                                isCompleted
                                  ? 'bg-[#8F6B4E] text-[#FFFDF9] ring-4 ring-[#F5E6D3] dark:ring-[#2B2019]'
                                  : isCurrent
                                  ? 'bg-[#B89578] text-[#FFFDF9] ring-4 ring-[#B89578]/30 shadow-md scale-110'
                                  : 'bg-[#FAF6F0] dark:bg-[#281E18] text-[#A08875] border border-[#d4c3b9] dark:border-[#423329]'
                              }`}
                            >
                              {isCompleted ? (
                                <Check className="w-5 h-5 stroke-[2.5]" />
                              ) : isCurrent ? (
                                <Icon className="w-5 h-5 stroke-[2.2]" />
                              ) : (
                                <span className="text-xs font-mono font-bold">{idx + 1}</span>
                              )}
                            </motion.div>

                            {/* Stage Title */}
                            <p
                              className={`mt-3 text-xs font-sans tracking-wide transition-colors ${
                                isCurrent
                                  ? 'font-bold text-[#6B4F3A] dark:text-[#FAF6F0]'
                                  : isCompleted
                                  ? 'font-semibold text-[#4A382D] dark:text-[#E8DACB]'
                                  : 'text-[#A08875] dark:text-[#7A6759]'
                              }`}
                            >
                              {isCompleted ? `✓ ` : isCurrent ? `● ` : `○ `}
                              {stage.title}
                            </p>

                            {/* Short Stage Caption */}
                            <span className="text-[10px] text-[#8C7A6D] dark:text-[#A8988C] mt-1 line-clamp-2 leading-tight">
                              {stage.description}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mobile Vertical Stepper */}
                  <div className="md:hidden space-y-4">
                    {TRACKING_STAGES.map((stage, idx) => {
                      const Icon = stage.icon;
                      const isCompleted = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      const isUpcoming = idx > currentStageIndex;

                      return (
                        <div key={stage.key} className="flex items-start gap-3 relative">
                          {/* Vertical Connector Line */}
                          {idx < TRACKING_STAGES.length - 1 && (
                            <div
                              className={`absolute left-4 top-8 bottom-0 w-0.5 -translate-x-1/2 ${
                                isCompleted
                                  ? 'bg-[#8F6B4E]'
                                  : 'bg-[#EADCCF] dark:bg-[#382C24]'
                              }`}
                            />
                          )}

                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 text-xs transition-all ${
                              isCompleted
                                ? 'bg-[#8F6B4E] text-[#FFFDF9]'
                                : isCurrent
                                ? 'bg-[#B89578] text-[#FFFDF9] ring-4 ring-[#B89578]/25'
                                : 'bg-[#FAF6F0] dark:bg-[#281E18] text-[#A08875] border border-[#d4c3b9] dark:border-[#423329]'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-4 h-4" />
                            ) : isCurrent ? (
                              <Icon className="w-4 h-4" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>

                          <div className="pb-3 flex-1">
                            <div className="flex items-center justify-between">
                              <h4
                                className={`text-xs font-sans tracking-wide ${
                                  isCurrent
                                    ? 'font-bold text-[#6B4F3A] dark:text-[#FFFDF9]'
                                    : isCompleted
                                    ? 'font-semibold text-[#4A382D] dark:text-[#E8DACB]'
                                    : 'text-[#A08875]'
                                }`}
                              >
                                {isCompleted ? `✓ ` : isCurrent ? `● ` : `○ `}
                                {stage.title}
                              </h4>
                              {isCurrent && (
                                <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 bg-[#B89578]/15 text-[#8F6B4E] dark:text-[#D1B198] rounded">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#8C7A6D] dark:text-[#A8988C] mt-0.5">
                              {stage.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* B. ORDER OVERVIEW SUMMARY CARD */}
              <div className="bg-[#FFFDF9] dark:bg-[#1D1612] rounded-3xl border border-[#d4c3b9] dark:border-[#382C24] p-6 sm:p-8 shadow-md space-y-6">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4c3b9]/40 dark:border-[#382C24] pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-2xl font-mono font-bold text-[#6B4F3A] dark:text-[#FAF6F0]">
                        #{matchedOrder.orderNumber}
                      </span>
                      <button
                        onClick={() => handleCopyOrderId(matchedOrder.orderNumber)}
                        className="p-1.5 text-[#8C7A6D] hover:text-[#6B4F3A] dark:hover:text-[#FFFDF9] hover:bg-[#F5E6D3]/40 dark:hover:bg-[#281E18] rounded-lg transition-colors cursor-pointer"
                        title="Copy Order ID"
                      >
                        {copiedOrderId ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8C7A6D] dark:text-[#BFB2A8] mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#B89578]" />
                        {new Date(matchedOrder.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#B89578]" />
                        Est. Delivery: <strong>2 - 3 Business Days</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello OWNonce, I am tracking my order #${matchedOrder.orderNumber} placed on ${new Date(
                          matchedOrder.createdAt
                        ).toLocaleDateString()}. Status: ${matchedOrder.orderStatus}.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Concierge</span>
                    </a>
                  </div>
                </div>

                {/* Two-Column Grid: Customer & Delivery Details / Financials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  
                  {/* Left: Customer & Address */}
                  <div className="space-y-4 bg-[#FAF6F0] dark:bg-[#251B15] p-5 rounded-2xl border border-[#d4c3b9]/40 dark:border-[#382C24]">
                    <h3 className="font-serif font-bold text-sm text-[#27180F] dark:text-[#FFFDF9] flex items-center gap-2">
                      <User className="w-4 h-4 text-[#B89578]" />
                      <span>Customer & Destination</span>
                    </h3>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#8C7A6D] dark:text-[#BFB2A8]">Recipient Name:</span>
                        <span className="font-semibold text-[#27180F] dark:text-[#FFFDF9]">
                          {matchedOrder.customerName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8C7A6D] dark:text-[#BFB2A8]">Contact Phone:</span>
                        <span className="font-mono font-medium text-[#4A382D] dark:text-[#E8DACB]">
                          {matchedOrder.customerPhone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8C7A6D] dark:text-[#BFB2A8]">Governorate:</span>
                        <span className="font-medium text-[#4A382D] dark:text-[#E8DACB]">
                          {matchedOrder.governorate} ({matchedOrder.destinationZone})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8C7A6D] dark:text-[#BFB2A8]">City / Area:</span>
                        <span className="font-medium text-[#4A382D] dark:text-[#E8DACB]">
                          {matchedOrder.city}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8C7A6D] dark:text-[#BFB2A8]">Street Address:</span>
                        <span className="font-medium text-[#4A382D] dark:text-[#E8DACB] text-right max-w-[200px]">
                          {matchedOrder.address}
                        </span>
                      </div>
                      {matchedOrder.notes && (
                        <div className="pt-2 border-t border-[#d4c3b9]/40 dark:border-[#382C24] text-[11px] text-[#77553b] dark:text-[#D1B198] italic">
                          Special Note: &quot;{matchedOrder.notes}&quot;
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Payment & Weight Summary */}
                  <div className="space-y-4 bg-[#FAF6F0] dark:bg-[#251B15] p-5 rounded-2xl border border-[#d4c3b9]/40 dark:border-[#382C24]">
                    <h3 className="font-serif font-bold text-sm text-[#27180F] dark:text-[#FFFDF9] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#B89578]" />
                      <span>Payment & Parcel Metrics</span>
                    </h3>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[#8C7A6D] dark:text-[#BFB2A8]">Payment Method:</span>
                        <span className="font-semibold text-[#27180F] dark:text-[#FFFDF9] capitalize">
                          {matchedOrder.paymentMethod === 'vodafone_cash'
                            ? 'Vodafone Cash'
                            : matchedOrder.paymentMethod === 'instapay'
                            ? 'InstaPay Transfer'
                            : 'Cash on Delivery (COD)'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-[#8C7A6D] dark:text-[#BFB2A8]">Payment Status:</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            matchedOrder.paymentStatus === 'Paid'
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                              : matchedOrder.paymentStatus === 'COD'
                              ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
                              : matchedOrder.paymentStatus === 'Failed'
                              ? 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300'
                              : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {matchedOrder.paymentStatus}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-[#8C7A6D] dark:text-[#BFB2A8]">Total Parcel Weight:</span>
                        <span className="font-mono font-medium text-[#4A382D] dark:text-[#E8DACB]">
                          {matchedOrder.totalWeight} KG
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-[#8C7A6D] dark:text-[#BFB2A8]">Shipping Zone:</span>
                        <span className="font-medium text-[#4A382D] dark:text-[#E8DACB]">
                          {matchedOrder.originZone} → {matchedOrder.destinationZone}
                        </span>
                      </div>

                      {/* Payment Proof View Button if available or digital transfer */}
                      {effectiveProofUrl && (
                        <div className="pt-2 border-t border-[#d4c3b9]/40 dark:border-[#382C24]">
                          <button
                            type="button"
                            onClick={() => setIsProofModalOpen(true)}
                            className="inline-flex items-center gap-1.5 text-xs text-[#8F6B4E] dark:text-[#D1B198] hover:underline font-semibold cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#B89578]" />
                            <span>View Digital Transfer Receipt</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* C. ORDERED PRODUCTS LIST */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-serif font-bold text-base text-[#27180F] dark:text-[#FFFDF9] flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#B89578]" />
                    <span>Ordered Garments ({matchedOrder.items.length})</span>
                  </h3>

                  <div className="divide-y divide-[#d4c3b9]/40 dark:divide-[#382C24] border border-[#d4c3b9]/50 dark:border-[#382C24] rounded-2xl overflow-hidden">
                    {matchedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-[#FAF6F0]/60 dark:bg-[#251B15]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF6F0] dark:hover:bg-[#251B15] transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-14 h-16 object-cover rounded-xl bg-[#F5E6D3] dark:bg-[#34271F] border border-[#d4c3b9]/50 shrink-0"
                          />
                          <div className="space-y-1">
                            <Link
                              to={`/products/${item.productId}`}
                              className="font-serif font-bold text-sm text-[#27180F] dark:text-[#FFFDF9] hover:text-[#B89578] transition-colors block"
                            >
                              {item.productName}
                            </Link>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-[#8C7A6D] dark:text-[#BFB2A8]">
                              {/* Color swatch */}
                              <span className="flex items-center gap-1">
                                <span
                                  className="w-3 h-3 rounded-full inline-block border border-[#d4c3b9]"
                                  style={{ backgroundColor: item.selectedColor.hex }}
                                />
                                <span>{item.selectedColor.name}</span>
                              </span>
                              <span>•</span>
                              <span>Size: <strong className="text-[#4A382D] dark:text-[#E8DACB]">{item.selectedSize}</strong></span>
                              <span>•</span>
                              <span>Qty: <strong className="text-[#4A382D] dark:text-[#E8DACB]">{item.quantity}</strong></span>
                              <span>•</span>
                              <span>Weight: {item.totalItemWeight || item.weight * item.quantity} KG</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right sm:self-center">
                          <span className="text-sm font-sans font-bold text-[#6B4F3A] dark:text-[#FAF6F0] block">
                            {(item.price * item.quantity).toLocaleString()} EGP
                          </span>
                          <span className="text-[10px] text-[#8C7A6D] dark:text-[#BFB2A8]">
                            {item.price.toLocaleString()} EGP each
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* D. FINANCIAL TOTALS SUMMARY */}
                <div className="bg-[#FAF6F0] dark:bg-[#251B15] p-5 rounded-2xl border border-[#d4c3b9]/50 dark:border-[#382C24] space-y-2.5 text-xs">
                  <div className="flex justify-between text-[#8C7A6D] dark:text-[#BFB2A8]">
                    <span>Items Subtotal:</span>
                    <span>{matchedOrder.subtotal.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between text-[#8C7A6D] dark:text-[#BFB2A8]">
                    <span>Shipping Fee ({matchedOrder.destinationZone} • {matchedOrder.totalWeight} KG):</span>
                    <span>{matchedOrder.shippingCost.toLocaleString()} EGP</span>
                  </div>
                  <div className="pt-2 border-t border-[#d4c3b9]/60 dark:border-[#382C24] flex justify-between items-center text-sm font-bold text-[#27180F] dark:text-[#FFFDF9]">
                    <span>Total Amount Paid:</span>
                    <span className="text-base font-serif text-[#6B4F3A] dark:text-[#D1B198]">
                      {matchedOrder.total.toLocaleString()} EGP
                    </span>
                  </div>
                </div>

                {/* Action Links */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <Link
                    to="/products"
                    className="w-full sm:w-auto px-6 py-3 bg-[#8C6B50] hover:bg-[#72533B] text-[#FFFDF9] text-xs font-sans uppercase tracking-[0.15em] font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Explore Collection</span>
                  </Link>

                  <button
                    onClick={() => {
                      setOrderIdInput('');
                      setPhoneInput('');
                      setMatchedOrder(null);
                      setHasSearched(false);
                      setSearchParams({});
                    }}
                    className="text-xs text-[#8F6B4E] dark:text-[#D1B198] hover:underline font-medium cursor-pointer"
                  >
                    Track another order
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. PAYMENT PROOF PREVIEW MODAL */}
        {isProofModalOpen && matchedOrder && effectiveProofUrl && (
          <PaymentProofModal
            isOpen={isProofModalOpen}
            onClose={() => setIsProofModalOpen(false)}
            proofUrl={effectiveProofUrl}
            proofName={matchedOrder.paymentProofName || `${matchedOrder.orderNumber}-receipt`}
            order={matchedOrder}
          />
        )}
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Maximize2,
  Minimize2,
  Download,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Sliders,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { Order } from '../../types';
import { openReceiptFull, printReceiptDirect } from '../../utils/printHelper';

interface PaymentProofModalProps {
  order: Order | null;
  proofUrl: string | null;
  isOpen?: boolean;
  proofName?: string;
  onClose: () => void;
  onUpdatePaymentStatus?: (orderId: string, status: any) => void;
}

type ClarityFilterMode = 'natural' | 'sharp' | 'high_contrast' | 'invert';

export const PaymentProofModal: React.FC<PaymentProofModalProps> = ({
  order,
  proofUrl,
  onClose,
  onUpdatePaymentStatus,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [filterMode, setFilterMode] = useState<ClarityFilterMode>('natural');
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset controls when a new image or order is opened
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setFilterMode('natural');
    setPosition({ x: 0, y: 0 });
  }, [proofUrl, order]);

  if (!proofUrl) return null;

  // Zoom handlers
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.35, 3.5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.35, 0.7));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  // Rotation handlers
  const handleRotateCw = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleRotateCcw = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  // Mouse Drag / Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Download raw receipt
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = proofUrl;
    link.download = `${order?.orderNumber || 'payment-proof'}-receipt.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Full Screen / Standalone Window
  const handleOpenFull = () => {
    openReceiptFull(
      proofUrl,
      order?.orderNumber || 'OWN-RECEIPT',
      order?.total,
      () => setIsFullscreen(true)
    );
  };

  // Direct Print Receipt
  const handlePrint = () => {
    printReceiptDirect(proofUrl, order?.orderNumber || 'OWN-RECEIPT');
  };

  // Filter Styles
  const getFilterStyle = (): string => {
    switch (filterMode) {
      case 'sharp':
        return 'contrast(130%) brightness(105%) saturate(115%)';
      case 'high_contrast':
        return 'grayscale(100%) contrast(175%) brightness(105%)';
      case 'invert':
        return 'invert(100%) contrast(120%)';
      case 'natural':
      default:
        return 'none';
    }
  };

  return (
    <div
      id="payment-proof-viewer-modal"
      className="fixed inset-0 z-50 bg-[#1E1610]/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`bg-[#FFFDF9] rounded-2xl border border-[#E6DCCF] shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isFullscreen ? 'w-full h-full max-w-none rounded-none' : 'w-full max-w-5xl h-[92vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-[#FAF7F2] border-b border-[#E6DCCF] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#B89578]/15 rounded-lg text-[#77553b]">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-[#1E1610]">
                  Payment Transfer Proof
                </h3>
                {order && (
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 bg-[#B89578]/20 text-[#77553b] font-mono text-xs font-semibold rounded">
                      #{order.orderNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(order.orderNumber)}
                      className="p-1 text-[#82756C] hover:text-[#77553b] hover:bg-[#B89578]/20 rounded transition-colors cursor-pointer"
                      title={copiedOrderId ? 'Copied!' : 'Copy Order Number'}
                    >
                      {copiedOrderId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-[#82756c] mt-0.5">
                {order?.customerName ? `${order.customerName} (${order.customerPhone})` : 'Digital Payment Proof'} •{' '}
                <span className="font-semibold text-[#4A382D]">
                  {order?.total?.toLocaleString()} EGP
                </span>
                {order?.paymentMethod && (
                  <span className="ml-1.5 uppercase text-[10px] px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded font-sans font-medium">
                    {order.paymentMethod.replace('_', ' ')}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Quick Payment Status Actions (If provided) */}
          <div className="flex items-center gap-2">
            {order && onUpdatePaymentStatus && (
              <div className="hidden sm:flex items-center gap-1.5 mr-2">
                <span className="text-xs text-[#82756c]">Status:</span>
                <select
                  value={order.paymentStatus}
                  onChange={(e) => onUpdatePaymentStatus(order.id, e.target.value)}
                  className={`text-xs px-2.5 py-1 rounded-md font-semibold border transition-colors cursor-pointer ${
                    order.paymentStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : order.paymentStatus === 'Failed'
                      ? 'bg-red-100 text-red-800 border-red-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  <option value="Pending">Pending Review</option>
                  <option value="Paid">Verified & Paid ✓</option>
                  <option value="Failed">Declined / Invalid ✕</option>
                </select>
              </div>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-[#82756c] hover:text-[#4A382D] hover:bg-[#F5E6D3] rounded-lg transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#82756c] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quality & Viewer Toolbar */}
        <div className="px-5 py-2 bg-[#FAF7F2]/80 border-b border-[#E6DCCF] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* Zoom & Rotation Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-[#82756c] text-[11px] font-medium hidden sm:inline mr-1">Zoom:</span>
            <button
              onClick={handleZoomOut}
              className="p-1.5 bg-[#FFFDF9] border border-[#d4c3b9] hover:border-[#77553b] text-[#4A382D] rounded-md transition-colors cursor-pointer"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono font-semibold text-xs px-2 min-w-[3.5rem] text-center text-[#4A382D]">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 bg-[#FFFDF9] border border-[#d4c3b9] hover:border-[#77553b] text-[#4A382D] rounded-md transition-colors cursor-pointer"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 py-1 bg-[#FFFDF9] border border-[#d4c3b9] hover:border-[#77553b] text-[#4A382D] rounded-md transition-colors text-[11px] font-medium ml-1 cursor-pointer"
              title="Reset 100%"
            >
              Reset 1:1
            </button>

            <div className="h-4 w-[1px] bg-[#d4c3b9] mx-1 sm:mx-2" />

            {/* Rotation */}
            <button
              onClick={handleRotateCcw}
              className="p-1.5 bg-[#FFFDF9] border border-[#d4c3b9] hover:border-[#77553b] text-[#4A382D] rounded-md transition-colors cursor-pointer"
              title="Rotate Left 90°"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleRotateCw}
              className="p-1.5 bg-[#FFFDF9] border border-[#d4c3b9] hover:border-[#77553b] text-[#4A382D] rounded-md transition-colors cursor-pointer"
              title="Rotate Right 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Clarity & Image Enhancer Modes */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#82756c] text-[11px] font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#B89578]" />
              <span className="hidden sm:inline">Clarity Mode:</span>
            </span>
            <div className="inline-flex rounded-lg p-0.5 bg-[#EFE8DF] border border-[#D9CEBF]">
              <button
                onClick={() => setFilterMode('natural')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  filterMode === 'natural'
                    ? 'bg-[#FFFDF9] text-[#1E1610] shadow-xs font-semibold'
                    : 'text-[#82756c] hover:text-[#1E1610]'
                }`}
                title="Natural / HD Original"
              >
                HD Original
              </button>
              <button
                onClick={() => setFilterMode('sharp')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  filterMode === 'sharp'
                    ? 'bg-[#B89578] text-[#FFFDF9] shadow-xs font-semibold'
                    : 'text-[#82756c] hover:text-[#1E1610]'
                }`}
                title="Sharpen & Enhance Numbers and Text"
              >
                ✨ Ultra Sharp
              </button>
              <button
                onClick={() => setFilterMode('high_contrast')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  filterMode === 'high_contrast'
                    ? 'bg-[#4A382D] text-[#FFFDF9] shadow-xs font-semibold'
                    : 'text-[#82756c] hover:text-[#1E1610]'
                }`}
                title="High Contrast B&W for printed receipts"
              >
                High Contrast B&W
              </button>
            </div>
          </div>

          {/* Print, Download & Open in Full Window */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFFDF9] border border-[#d4c3b9] hover:border-[#77553b] text-[#4A382D] rounded-md transition-colors text-[11px] font-medium cursor-pointer"
              title="Print Receipt Directly"
            >
              <Printer className="w-3.5 h-3.5 text-[#B89578]" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFFDF9] border border-[#d4c3b9] hover:border-[#77553b] text-[#4A382D] rounded-md transition-colors text-[11px] font-medium cursor-pointer"
              title="Download Original Quality Image"
            >
              <Download className="w-3.5 h-3.5 text-[#B89578]" />
              <span>Download</span>
            </button>
            <button
              onClick={handleOpenFull}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFFDF9] border border-[#d4c3b9] hover:border-[#77553b] text-[#4A382D] rounded-md transition-colors text-[11px] font-medium cursor-pointer"
              title="Open full resolution in standalone window"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#B89578]" />
              <span>Open Full</span>
            </button>
          </div>
        </div>

        {/* Main Canvas / Image Viewport */}
        <div
          ref={containerRef}
          className={`flex-1 relative overflow-hidden bg-[#241C16] flex items-center justify-center p-4 ${
            zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Subtle grid backdrop for contrast */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, #FAF7F2 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div
            className="transition-transform duration-75 flex items-center justify-center"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
            }}
          >
            <img
              ref={imgRef}
              src={proofUrl}
              alt="Payment Transfer Proof High Resolution"
              className="max-h-[75vh] max-w-[85vw] object-contain rounded-lg shadow-2xl transition-all select-none"
              style={{
                filter: getFilterStyle(),
                imageRendering: 'auto',
              }}
              draggable={false}
            />
          </div>

          {/* Floating Pan Hint when zoomed */}
          {zoom > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#1E1610]/80 text-[#FAF7F2] text-[11px] rounded-full backdrop-blur-md pointer-events-none flex items-center gap-1.5 shadow-lg">
              <span>Drag with mouse to pan • Double click to reset</span>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-2.5 bg-[#FAF7F2] border-t border-[#E6DCCF] flex flex-wrap items-center justify-between text-xs text-[#82756c] shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>High-Definition Digital Receipt Preview (Original 100% Quality Preserved)</span>
          </div>
          <div className="font-mono text-[11px]">
            Scale: {Math.round(zoom * 100)}% | Rotation: {rotation}° | Mode: {filterMode.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

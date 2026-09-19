import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Truck,
  Star,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Eye,
  CheckCircle2,
  Sun,
  Moon,
  Store as StoreIcon,
  Search,
  Printer,
  Copy,
  AlertCircle,
  Layers3,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Product,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  ShippingZoneName,
  ProductColor,
  StoreSettings,
  Category,
} from '../../types';
import { ALL_GOVERNORATES, ZONES } from '../../data/shippingRates';
import { PaymentProofModal } from '../../components/admin/PaymentProofModal';
import { ProductImageUploader } from '../../components/admin/ProductImageUploader';
import {
  ADMIN_DEFAULT_COLORS,
  ADMIN_DEFAULT_SIZES,
  ProductOptionsSelector,
} from '../../components/admin/ProductOptionsSelector';
import { Order } from '../../types';
import { printOrderSummary } from '../../utils/printHelper';
import {
  generateInstapayReceiptSvg,
  generateVodafoneCashReceiptSvg,
} from '../../utils/paymentProofHelper';

export const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, logout, adminUser } = useAdminAuth();
  const { isDark, toggleTheme } = useTheme();
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteAllProducts,
    orders,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    deleteOrderItem,
    shippingConfig,
    updateShippingOrigin,
    updateShippingRates,
    reviews,
    approveReview,
    hideReview,
    deleteReview,
    settings,
    updateSettings,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getShippingForGovernorate,
  } = useStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    'orders' | 'products' | 'categories' | 'shipping' | 'reviews' | 'settings'
  >('orders');

  // Order Filters & Proof Viewer & Deletions
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedProofOrder, setSelectedProofOrder] = useState<Order | null>(null);
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{
    order: Order;
    itemIndex: number;
    item: OrderItem;
  } | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const handleCopyOrderId = (orderNum: string) => {
    navigator.clipboard.writeText(orderNum);
    setCopiedOrderId(orderNum);
    setTimeout(() => {
      setCopiedOrderId((prev) => (prev === orderNum ? null : prev));
    }, 2000);
  };

  // Product Modal (Add / Edit / Delete)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodOriginalPrice, setProdOriginalPrice] = useState<string | number>('');
  const [prodPrice, setProdPrice] = useState<number>(650);
  const [priceValidationError, setPriceValidationError] = useState<string | null>(null);
  const [prodWeight, setProdWeight] = useState(0.35);
  const [prodCategory, setProdCategory] = useState(
    'Basic Round Neck – Short Sleeve'
  );
  const [isCustomCategoryMode, setIsCustomCategoryMode] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [prodStock, setProdStock] = useState(50);
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodColors, setProdColors] = useState<ProductColor[]>(ADMIN_DEFAULT_COLORS);
  const [prodSizes, setProdSizes] = useState<string[]>(ADMIN_DEFAULT_SIZES);
  const [prodAvailable, setProdAvailable] = useState(true);

  // Category Management State
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState<string[]>([]);

  const resetCategoryForm = () => {
    setEditingCategoryId(null);
    setCategoryName('');
    setCategoryDescription('');
    setCategoryImage([]);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryDescription(category.description || '');
    setCategoryImage(category.image ? [category.image] : []);
  };

  const handleSaveCategory = (event: React.FormEvent) => {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name) return;
    const categoryData = {
      name,
      slug: name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: categoryDescription.trim(),
      image: categoryImage[0] || '',
    };

    if (editingCategoryId) {
      updateCategory(editingCategoryId, categoryData);
    } else {
      addCategory(categoryData);
    }
    resetCategoryForm();
  };

  // Shipping Configuration State
  const [originZone, setOriginZone] = useState<ShippingZoneName>(
    shippingConfig.originZone
  );
  const [ratesFormFirst, setRatesFormFirst] = useState<Record<ShippingZoneName, number>>(
    () => {
      const orig = shippingConfig.originZone;
      const baseMap = shippingConfig.firstKgRates[orig] || {};
      return {
        'Greater Cairo': baseMap['Greater Cairo'] ?? 76,
        'Alexandria': baseMap['Alexandria'] ?? 82,
        'Delta': baseMap['Delta'] ?? 93,
        'Canal': baseMap['Canal'] ?? 99,
        'Upper Egypt': baseMap['Upper Egypt'] ?? 122,
        'Beyond Zones': baseMap['Beyond Zones'] ?? 145,
      };
    }
  );
  const [ratesFormAdd, setRatesFormAdd] = useState<Record<ShippingZoneName, number>>(
    () => {
      const orig = shippingConfig.originZone;
      const baseMap = shippingConfig.additionalKgRates[orig] || {};
      return {
        'Greater Cairo': baseMap['Greater Cairo'] ?? 6.6,
        'Alexandria': baseMap['Alexandria'] ?? 9.2,
        'Delta': baseMap['Delta'] ?? 11.8,
        'Canal': baseMap['Canal'] ?? 15.7,
        'Upper Egypt': baseMap['Upper Egypt'] ?? 17,
        'Beyond Zones': baseMap['Beyond Zones'] ?? 6.6,
      };
    }
  );
  const [shippingSaveSuccess, setShippingSaveSuccess] = useState(false);

  // Store Settings State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false);

  // Shipping Tester inside Admin
  const [testGov, setTestGov] = useState('Alexandria');
  const [testWeight, setTestWeight] = useState(1.5);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  // Product Filter State
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory =
      productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) =>
    orderStatusFilter === 'all'
      ? true
      : o.orderStatus.toLowerCase() === orderStatusFilter.toLowerCase()
  );

  // Handle Open Product Modal for Add
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdDesc('');
    setProdOriginalPrice('');
    setProdPrice(650);
    setPriceValidationError(null);
    setProdWeight(0.35);
    setProdCategory(categories[0]?.name || 'Basic Round Neck – Short Sleeve');
    setIsCustomCategoryMode(false);
    setCustomCategoryInput('');
    setProdStock(40);
    setProdImages([]);
    setProdColors(ADMIN_DEFAULT_COLORS);
    setProdSizes(ADMIN_DEFAULT_SIZES);
    setProdAvailable(true);
    setIsProductModalOpen(true);
  };

  // Handle Open Product Modal for Edit
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProdName(prod.name);
    setProdDesc(prod.description);
    setProdOriginalPrice(
      prod.originalPrice !== undefined && prod.originalPrice !== null
        ? prod.originalPrice
        : ''
    );
    setProdPrice(prod.price);
    setPriceValidationError(null);
    setProdWeight(prod.weight);
    setProdCategory(prod.category);
    setIsCustomCategoryMode(false);
    setCustomCategoryInput('');
    setProdStock(prod.stock);
    setProdImages(prod.images || []);
    setProdColors(prod.colors);
    setProdSizes(prod.sizes);
    setProdAvailable(prod.isAvailable);
    setIsProductModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const numOriginal =
      prodOriginalPrice !== '' && Number(prodOriginalPrice) > 0
        ? Number(prodOriginalPrice)
        : undefined;
    const numSale = Number(prodPrice);

    if (numOriginal !== undefined && numSale > numOriginal) {
      setPriceValidationError(
        'Sale Price cannot be greater than Original Price (سعر البيع بعد الخصم لا يمكن أن يكون أكبر من السعر الأصلي)'
      );
      return;
    }

    setPriceValidationError(null);

    const finalCategory =
      isCustomCategoryMode && customCategoryInput.trim()
        ? customCategoryInput.trim()
        : prodCategory;

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: prodName,
        description: prodDesc,
        price: numSale,
        originalPrice: numOriginal,
        weight: Number(prodWeight),
        category: finalCategory,
        stock: Number(prodStock),
        images:
          prodImages.length > 0
            ? prodImages
            : [
                'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
              ],
        colors: prodColors,
        sizes: prodSizes,
        isAvailable: prodAvailable,
      });
    } else {
      addProduct({
        name: prodName,
        description: prodDesc,
        price: numSale,
        originalPrice: numOriginal,
        weight: Number(prodWeight),
        category: finalCategory,
        stock: Number(prodStock),
        images:
          prodImages.length > 0
            ? prodImages
            : [
                'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
              ],
        colors: prodColors,
        sizes: prodSizes,
        isAvailable: prodAvailable,
      });
    }
    setIsProductModalOpen(false);
  };

  // Save Shipping Settings
  const handleSaveShippingConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateShippingOrigin(originZone);
    const updatedFirst = {
      ...shippingConfig.firstKgRates,
      [originZone]: ratesFormFirst,
    };
    const updatedAdd = {
      ...shippingConfig.additionalKgRates,
      [originZone]: ratesFormAdd,
    };
    updateShippingRates(updatedFirst, updatedAdd);
    setShippingSaveSuccess(true);
    setTimeout(() => setShippingSaveSuccess(false), 2500);
  };

  // Save Store Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSaveSuccess(true);
    setTimeout(() => setSettingsSaveSuccess(false), 2500);
  };

  const testCalculation = getShippingForGovernorate(testGov, testWeight);

  return (
    <div
      id="admin-dashboard-container"
      className="min-h-screen bg-[#F5E6D3] text-[#4A382D] flex flex-col"
    >
      {/* Admin Top Navigation */}
      <header className="bg-[#27180F] dark:bg-[#0D0A08] text-[#FFFDF9] sticky top-0 z-30 px-6 py-4 shadow-md flex items-center justify-between border-b border-transparent dark:border-[#3D3027]">
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <span className="font-serif tracking-[0.25em] text-lg font-medium uppercase">
              OW<span className="font-light italic tracking-normal">N</span>ONCE
            </span>
          </Link>
          <span className="hidden sm:inline-block px-2.5 py-0.5 bg-[#4A382D] dark:bg-[#2B221C] text-[#B89578] text-[10px] font-sans font-semibold rounded uppercase tracking-wider">
            Admin Console
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-950/40 border border-emerald-700/40 text-emerald-400 text-[10px] font-sans rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium">Live Cloud Sync</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/"
            className="p-2 bg-[#3E2D22] dark:bg-[#2B221C] hover:bg-[#B89578] text-[#FFFDF9] rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="View Live Storefront"
          >
            <StoreIcon className="w-3.5 h-3.5 text-[#B89578]" />
            <span className="hidden md:inline">View Store</span>
          </Link>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-[#3E2D22] dark:bg-[#2B221C] hover:bg-[#B89578] text-[#FFFDF9] rounded text-xs transition-colors cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-[#F5D061]" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#FFFDF9]" />
            )}
          </button>

          <span className="text-xs text-[#d4c3b9] hidden lg:inline">
            Logged in as <strong>{adminUser?.email}</strong>
          </span>

          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="p-2 bg-[#3E2D22] dark:bg-[#2B221C] hover:bg-[#B89578] text-[#FFFDF9] rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-2 shadow-xs flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-sans font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#B89578] text-[#FFFDF9]'
                : 'text-[#4A382D] hover:bg-[#F5E6D3]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-sans font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#B89578] text-[#FFFDF9]'
                : 'text-[#4A382D] hover:bg-[#F5E6D3]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-sans font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-[#B89578] text-[#FFFDF9]'
                : 'text-[#4A382D] hover:bg-[#F5E6D3]'
            }`}
          >
            <Layers3 className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-sans font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'shipping'
                ? 'bg-[#B89578] text-[#FFFDF9]'
                : 'text-[#4A382D] hover:bg-[#F5E6D3]'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Shipping Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-sans font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-[#B89578] text-[#FFFDF9]'
                : 'text-[#4A382D] hover:bg-[#F5E6D3]'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-sans font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#B89578] text-[#FFFDF9]'
                : 'text-[#4A382D] hover:bg-[#F5E6D3]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Configuration</span>
          </button>
        </div>

        {/* 1. ORDERS MANAGEMENT TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif text-[#4A382D]">Customer Orders</h2>
                <p className="text-xs text-[#82756c]">
                  Manage order fulfillment, verify payment transfers, and update dispatch statuses.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#82756c] font-medium">Filter Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-[#F5E6D3] text-[#4A382D] py-1.5 px-3 rounded border border-[#d4c3b9] focus:outline-none"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="pending">Order Placed / Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="out for delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-12 text-center text-xs text-[#82756c]">
                No orders found matching the filter criteria.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d4c3b9]/50 pb-4 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#77553b] dark:text-[#D1B198]">
                          #{order.orderNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyOrderId(order.orderNumber)}
                          className="inline-flex items-center gap-1 p-1 text-[#82756C] dark:text-[#AD9E92] hover:text-[#77553b] dark:hover:text-[#FFFDF9] hover:bg-[#F5E6D3]/50 dark:hover:bg-[#2B221C] rounded transition-colors cursor-pointer"
                          title={copiedOrderId === order.orderNumber ? 'Copied!' : 'Copy Order Number'}
                        >
                          {copiedOrderId === order.orderNumber ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-sans font-semibold">
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied</span>
                            </span>
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span className="text-xs text-[#82756c] dark:text-[#AD9E92] ml-1">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {/* Status Selectors */}
                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[#82756c]">Order Status:</span>
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              updateOrderStatus(
                                order.id,
                                e.target.value as OrderStatus
                              )
                            }
                            className={`text-xs font-semibold py-1 px-3 rounded border cursor-pointer ${
                              order.orderStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : order.orderStatus === 'Out for Delivery'
                                ? 'bg-teal-100 text-teal-800 border-teal-300'
                                : order.orderStatus === 'Shipped'
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : order.orderStatus === 'Confirmed'
                                ? 'bg-purple-100 text-purple-800 border-purple-300'
                                : order.orderStatus === 'Cancelled'
                                ? 'bg-red-100 text-red-800 border-red-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="Pending">Order Placed (Pending)</option>
                            <option value="Confirmed">Order Confirmed</option>
                            <option value="Shipped">Order Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[#82756c]">Payment:</span>
                          <select
                            value={order.paymentStatus}
                            onChange={(e) =>
                              updatePaymentStatus(
                                order.id,
                                e.target.value as PaymentStatus
                              )
                            }
                            className="text-xs font-semibold py-1 px-2.5 rounded border border-[#d4c3b9] bg-[#F5E6D3]/40 cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Failed">Failed</option>
                            <option value="COD">COD</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Customer & Destination Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#4A382D]">
                      <div className="space-y-1">
                        <span className="text-[#82756c] font-semibold uppercase tracking-wider block">
                          Client Details
                        </span>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-[#82756c]">Phone: {order.customerPhone}</p>
                        {order.notes && (
                          <p className="text-[11px] text-[#77553b] italic">
                            Note: {order.notes}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[#82756c] font-semibold uppercase tracking-wider block">
                          Shipping Address
                        </span>
                        <p>{order.address}</p>
                        <p>
                          {order.city}, {order.governorate}
                        </p>
                        <span className="inline-block px-2 py-0.5 bg-[#F5E6D3] text-[#77553b] text-[10px] rounded font-semibold">
                          Zone: {order.destinationZone}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[#82756c] font-semibold uppercase tracking-wider block">
                          Payment & Financials
                        </span>
                        <p className="capitalize">
                          Method: <strong>{order.paymentMethod.replace('_', ' ')}</strong>
                        </p>
                        <p>
                          Subtotal: {order.subtotal.toLocaleString()} EGP | Shipping:{' '}
                          {order.shippingCost.toLocaleString()} EGP
                        </p>
                        <p className="font-bold text-sm text-[#77553b]">
                          Total: {order.total.toLocaleString()} EGP ({order.totalWeight} KG)
                        </p>

                        {/* Action buttons: Proof & Print Slip */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          {(order.paymentProofUrl || order.paymentMethod !== 'cod') && (
                            <button
                              onClick={() => {
                                const proof =
                                  order.paymentProofUrl ||
                                  (order.paymentMethod === 'instapay'
                                    ? generateInstapayReceiptSvg(
                                        order.orderNumber,
                                        order.total,
                                        order.customerName,
                                        new Date(order.createdAt).toLocaleDateString('en-GB', {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        }),
                                        `IPAY-${order.orderNumber.replace(/[^0-9]/g, '') || '98421'}`
                                      )
                                    : order.paymentMethod === 'vodafone_cash'
                                    ? generateVodafoneCashReceiptSvg(
                                        order.orderNumber,
                                        order.total,
                                        order.customerName,
                                        new Date(order.createdAt).toLocaleDateString('en-GB', {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        }),
                                        `VF-${order.orderNumber.replace(/[^0-9]/g, '') || '98544'}`
                                      )
                                    : null);
                                setSelectedProofOrder(order);
                                setSelectedProofUrl(proof);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] dark:bg-[#251B15] hover:bg-[#B89578] hover:text-[#FFFDF9] text-[#77553b] dark:text-[#D1B198] border border-[#d4c3b9] dark:border-[#382C24] hover:border-[#B89578] rounded-md text-xs font-semibold transition-all shadow-xs cursor-pointer group"
                              title="View High Definition Payment Proof"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#B89578] group-hover:text-[#FFFDF9] transition-colors" />
                              <span>View Payment Proof</span>
                            </button>
                          )}

                          <button
                            onClick={() => printOrderSummary(order, settings)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] dark:bg-[#251B15] hover:bg-[#77553b] hover:text-[#FFFDF9] text-[#4A382D] dark:text-[#E8DACB] border border-[#d4c3b9] dark:border-[#382C24] hover:border-[#77553b] rounded-md text-xs font-semibold transition-all shadow-xs cursor-pointer group"
                            title="Print Formal Order Invoice & Packing Slip"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#B89578] group-hover:text-[#FFFDF9] transition-colors" />
                            <span>Print Slip</span>
                          </button>

                          <button
                            onClick={() => setOrderToDelete(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] dark:bg-[#251B15] hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:border-red-600 rounded-md text-xs font-semibold transition-all shadow-xs cursor-pointer group"
                            title="Delete entire order"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500 group-hover:text-white transition-colors" />
                            <span>Delete Order</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="pt-3 border-t border-[#d4c3b9]/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#82756c]">
                          Ordered Items ({order.items.length})
                        </span>
                        <span className="text-[11px] text-[#82756c] italic">
                          Click trash icon to remove any individual product
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {order.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="group/item relative flex items-center gap-3 p-2.5 bg-[#F5E6D3]/30 dark:bg-[#251B15]/40 rounded-lg border border-[#d4c3b9]/40 dark:border-[#382C24] text-xs hover:border-[#B89578] transition-colors"
                          >
                            <img
                              src={it.productImage}
                              alt={it.productName}
                              className="w-11 h-13 object-cover rounded bg-[#F5E6D3] dark:bg-[#2B221C] shrink-0 border border-[#d4c3b9]/30"
                            />
                            <div className="flex-1 min-w-0 pr-1">
                              <p className="font-medium text-[#4A382D] dark:text-[#E8DACB] line-clamp-1">
                                {it.productName}
                              </p>
                              <div className="text-[10px] text-[#82756c] dark:text-[#AD9E92] flex flex-wrap items-center gap-1 mt-0.5">
                                <span
                                  className="w-2 h-2 rounded-full inline-block border border-[#d4c3b9]"
                                  style={{ backgroundColor: it.selectedColor.hex }}
                                />
                                <span>{it.selectedColor.name}</span>
                                <span>•</span>
                                <span>Size {it.selectedSize}</span>
                                <span>•</span>
                                <span>Qty: {it.quantity}</span>
                              </div>
                              <div className="mt-1 font-semibold text-[#77553b] dark:text-[#C8A882]">
                                {(it.price * it.quantity).toLocaleString()} EGP
                              </div>
                            </div>

                            {/* Delete Product from Order Button */}
                            <button
                              type="button"
                              onClick={() =>
                                setItemToDelete({
                                  order,
                                  itemIndex: idx,
                                  item: it,
                                })
                              }
                              className="p-1.5 text-[#82756C] dark:text-[#AD9E92] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors cursor-pointer shrink-0 border border-transparent hover:border-red-200 dark:hover:border-red-800"
                              title="Delete this product from order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. PRODUCTS MANAGEMENT TAB */}
        {activeTab === 'products' && (
          <div className="space-y-5">
            {/* Header with Title & Action */}
            <div className="bg-[#FFFDF9] dark:bg-[#1D1612] rounded-2xl border border-[#d4c3b9] dark:border-[#382C24] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-[#27180F] dark:text-[#FFFDF9]">
                  Collection Catalog ({products.length})
                </h2>
                <p className="text-xs text-[#82756c] dark:text-[#AD9E92] mt-0.5">
                  Manage pieces, stock counts, garment weights, color swatches, and pricing in EGP.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-xs font-sans uppercase tracking-wider font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Piece</span>
              </button>
              <button
                onClick={() => {
                  if (products.length > 0 && window.confirm('Delete all products permanently?')) {
                    deleteAllProducts().catch(console.error);
                  }
                }}
                disabled={products.length === 0}
                className="w-full sm:w-auto px-4 py-2.5 border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-sans uppercase tracking-wider font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All Products</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-[#FFFDF9] dark:bg-[#1D1612] rounded-2xl border border-[#d4c3b9] dark:border-[#382C24] p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search by name/category */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A08875]" />
                <input
                  type="text"
                  placeholder="Search piece by name or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF6F0] dark:bg-[#281E18] border border-[#d4c3b9] dark:border-[#423329] rounded-xl text-xs font-sans text-[#27180F] dark:text-[#FFFDF9] placeholder:text-[#A08875]/70 focus:outline-none focus:ring-1 focus:ring-[#B89578]"
                />
              </div>

              {/* Filter by Category */}
              <div className="sm:w-64">
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="w-full py-2 px-3 bg-[#FAF6F0] dark:bg-[#281E18] border border-[#d4c3b9] dark:border-[#423329] rounded-xl text-xs font-sans text-[#27180F] dark:text-[#FFFDF9] focus:outline-none focus:ring-1 focus:ring-[#B89578] cursor-pointer"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* If no products match search */}
            {filteredProducts.length === 0 ? (
              <div className="bg-[#FFFDF9] dark:bg-[#1D1612] rounded-2xl border border-[#d4c3b9] dark:border-[#382C24] p-8 text-center space-y-3 shadow-xs">
                <Package className="w-10 h-10 text-[#B89578] mx-auto opacity-75" />
                <h3 className="text-base font-serif font-bold text-[#27180F] dark:text-[#FFFDF9]">
                  No pieces found
                </h3>
                <p className="text-xs text-[#82756c] dark:text-[#AD9E92] max-w-sm mx-auto">
                  {productSearch || productCategoryFilter !== 'all'
                    ? 'Try clearing or changing your search filters.'
                    : 'Get started by clicking "Add New Piece" above.'}
                </p>
                {(productSearch || productCategoryFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setProductSearch('');
                      setProductCategoryFilter('all');
                    }}
                    className="text-xs text-[#8F6B4E] dark:text-[#D1B198] hover:underline font-semibold cursor-pointer pt-1"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* 1. MOBILE CARD VIEW (Visible only on mobile screens < 768px) */}
                <div className="block md:hidden space-y-3.5">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-[#FFFDF9] dark:bg-[#1D1612] rounded-2xl border border-[#d4c3b9] dark:border-[#382C24] p-4 shadow-xs space-y-3 transition-colors"
                    >
                      {/* Top Row: Thumbnail + Info */}
                      <div className="flex items-start gap-3.5">
                        <img
                          src={
                            prod.images[0] ||
                            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80'
                          }
                          alt={prod.name}
                          className="w-16 h-20 object-cover rounded-xl bg-[#F5E6D3] dark:bg-[#251B15] border border-[#d4c3b9]/60 dark:border-[#423329] shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-[#B89578] truncate">
                              {prod.category}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                prod.isAvailable
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                              }`}
                            >
                              {prod.isAvailable ? 'Active' : 'Hidden'}
                            </span>
                          </div>

                          <h4 className="font-serif font-bold text-sm text-[#27180F] dark:text-[#FFFDF9] line-clamp-2 leading-tight">
                            {prod.name}
                          </h4>

                          <div className="pt-0.5 flex items-baseline gap-2 flex-wrap">
                            {prod.originalPrice && prod.originalPrice > prod.price && (
                              <span className="text-xs text-[#82756c] dark:text-[#AD9E92] line-through font-normal">
                                {prod.originalPrice.toLocaleString()} EGP
                              </span>
                            )}
                            <span className="text-sm font-sans font-bold text-[#77553b] dark:text-[#E6D0BA]">
                              {prod.price.toLocaleString()} EGP
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle Row: 3 Spec Stats (Stock, Weight, Colors) */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#d4c3b9]/40 dark:border-[#382C24] text-[11px]">
                        <div className="bg-[#FAF6F0] dark:bg-[#281E18] p-2 rounded-xl border border-[#d4c3b9]/30 dark:border-[#423329] text-center">
                          <span className="text-[9px] uppercase tracking-wider text-[#82756c] dark:text-[#AD9E92] block">
                            Stock
                          </span>
                          <span
                            className={`font-bold ${
                              prod.stock > 10
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-amber-700 dark:text-amber-400'
                            }`}
                          >
                            {prod.stock} units
                          </span>
                        </div>

                        <div className="bg-[#FAF6F0] dark:bg-[#281E18] p-2 rounded-xl border border-[#d4c3b9]/30 dark:border-[#423329] text-center">
                          <span className="text-[9px] uppercase tracking-wider text-[#82756c] dark:text-[#AD9E92] block">
                            Weight
                          </span>
                          <span className="font-bold text-[#4A382D] dark:text-[#E8DACB]">
                            {prod.weight} KG
                          </span>
                        </div>

                        <div className="bg-[#FAF6F0] dark:bg-[#281E18] p-2 rounded-xl border border-[#d4c3b9]/30 dark:border-[#423329] text-center flex flex-col items-center justify-center">
                          <span className="text-[9px] uppercase tracking-wider text-[#82756c] dark:text-[#AD9E92] block mb-1">
                            Colors ({prod.colors.length})
                          </span>
                          <div className="flex items-center gap-1 justify-center">
                            {prod.colors.slice(0, 3).map((c) => (
                              <span
                                key={c.name}
                                className="w-3 h-3 rounded-full border border-[#d4c3b9] dark:border-[#524135]"
                                title={c.name}
                                style={{ backgroundColor: c.hex }}
                              />
                            ))}
                            {prod.colors.length > 3 && (
                              <span className="text-[9px] text-[#82756c] dark:text-[#AD9E92] font-semibold">
                                +{prod.colors.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Edit & Delete Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="flex-1 py-2.5 px-3 bg-[#FAF6F0] dark:bg-[#281E18] hover:bg-[#F5E6D3] dark:hover:bg-[#34271F] border border-[#d4c3b9] dark:border-[#423329] text-[#77553b] dark:text-[#E6D0BA] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#B89578]" />
                          <span>Edit Piece</span>
                        </button>

                        <button
                          onClick={() => setProductToDelete(prod)}
                          className="py-2.5 px-4 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
                          title="Delete Piece"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2. DESKTOP TABLE VIEW (Visible on tablet & desktop >= 768px) */}
                <div className="hidden md:block bg-[#FFFDF9] dark:bg-[#1D1612] rounded-2xl border border-[#d4c3b9] dark:border-[#382C24] overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans border-collapse">
                      <thead>
                        <tr className="bg-[#F5E6D3]/60 dark:bg-[#281E18] border-b border-[#d4c3b9] dark:border-[#382C24] text-[#77553b] dark:text-[#D1B198] uppercase tracking-wider text-[11px]">
                          <th className="py-3 px-4 font-semibold">Product</th>
                          <th className="py-3 px-4 font-semibold">Category</th>
                          <th className="py-3 px-4 font-semibold">Price</th>
                          <th className="py-3 px-4 font-semibold">Weight</th>
                          <th className="py-3 px-4 font-semibold">Stock</th>
                          <th className="py-3 px-4 font-semibold">Colors</th>
                          <th className="py-3 px-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#d4c3b9]/40 dark:divide-[#382C24]">
                        {filteredProducts.map((prod) => (
                          <tr
                            key={prod.id}
                            className="hover:bg-[#F5E6D3]/20 dark:hover:bg-[#281E18]/60 transition-colors"
                          >
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    prod.images[0] ||
                                    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80'
                                  }
                                  alt={prod.name}
                                  className="w-10 h-12 object-cover rounded-lg bg-[#F5E6D3] dark:bg-[#281E18] border border-[#d4c3b9]/40 dark:border-[#423329]"
                                />
                                <div>
                                  <span className="font-semibold text-[#27180F] dark:text-[#FFFDF9] block">
                                    {prod.name}
                                  </span>
                                  <span className="text-[10px] text-[#82756c] dark:text-[#AD9E92]">
                                    {prod.isAvailable ? 'Active in store' : 'Archived / Hidden'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-[#82756c] dark:text-[#AD9E92]">
                              {prod.category}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-[#77553b] dark:text-[#E6D0BA]">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                {prod.originalPrice && prod.originalPrice > prod.price && (
                                  <span className="text-xs text-[#82756c] dark:text-[#AD9E92] line-through font-normal">
                                    {prod.originalPrice.toLocaleString()} EGP
                                  </span>
                                )}
                                <span>{prod.price.toLocaleString()} EGP</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-[#82756c] dark:text-[#AD9E92]">
                              {prod.weight} KG
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`font-semibold ${
                                  prod.stock > 10
                                    ? 'text-emerald-700 dark:text-emerald-400'
                                    : 'text-amber-700 dark:text-amber-400'
                                }`}
                              >
                                {prod.stock} units
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1">
                                {prod.colors.map((c) => (
                                  <span
                                    key={c.name}
                                    className="w-3.5 h-3.5 rounded-full border border-[#d4c3b9] dark:border-[#524135]"
                                    title={c.name}
                                    style={{ backgroundColor: c.hex }}
                                  />
                                ))}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                className="p-2 text-[#77553b] dark:text-[#D1B198] hover:bg-[#F5E6D3] dark:hover:bg-[#2B221C] rounded-lg cursor-pointer transition-colors"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setProductToDelete(prod)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg cursor-pointer transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 3. SHIPPING CONFIGURATION & RATES TAB */}
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#d4c3b9] pb-4">
                <div>
                  <h2 className="text-xl font-serif text-[#4A382D]">
                    Shipping Matrix & Rates
                  </h2>
                  <p className="text-xs text-[#82756c]">
                    Configure your fulfillment center origin and define per-zone base (First 1 KG) and additional KG shipping rates.
                  </p>
                </div>
                {shippingSaveSuccess && (
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Shipping rules updated
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveShippingConfig} className="space-y-6">
                {/* Origin Store Zone */}
                <div className="max-w-xs">
                  <label className="text-xs font-semibold text-[#4A382D] block mb-1">
                    Fulfillment Origin Zone
                  </label>
                  <select
                    value={originZone}
                    onChange={(e) => setOriginZone(e.target.value as ShippingZoneName)}
                    className="w-full text-xs p-2.5 bg-[#F5E6D3]/40 border border-[#d4c3b9] rounded font-semibold text-[#4A382D]"
                  >
                    {ZONES.map((z) => (
                      <option key={z} value={z}>
                        {z}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rates Table for All Zones */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans border-collapse">
                    <thead>
                      <tr className="bg-[#F5E6D3]/60 border-b border-[#d4c3b9] text-[#77553b] uppercase tracking-wider">
                        <th className="py-3 px-4 font-semibold">Destination Zone</th>
                        <th className="py-3 px-4 font-semibold">First 1 KG Rate (EGP)</th>
                        <th className="py-3 px-4 font-semibold">
                          Additional 1 KG Rate (EGP)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d4c3b9]/40">
                      {ZONES.map((zone) => {
                        const firstVal = ratesFormFirst[zone] ?? 70;
                        const addVal = ratesFormAdd[zone] ?? 15;
                        return (
                          <tr key={zone}>
                            <td className="py-3 px-4 font-semibold text-[#4A382D]">
                              {zone}
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="number"
                                min={0}
                                step={1}
                                value={firstVal}
                                onChange={(e) =>
                                  setRatesFormFirst({
                                    ...ratesFormFirst,
                                    [zone]: Number(e.target.value),
                                  })
                                }
                                className="w-32 p-2 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded text-xs"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="number"
                                min={0}
                                step={0.1}
                                value={addVal}
                                onChange={(e) =>
                                  setRatesFormAdd({
                                    ...ratesFormAdd,
                                    [zone]: Number(e.target.value),
                                  })
                                }
                                className="w-32 p-2 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded text-xs"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-xs font-sans uppercase tracking-wider font-semibold rounded transition-colors cursor-pointer"
                >
                  Save Shipping Matrix
                </button>
              </form>
            </div>

            {/* Live Interactive Shipping Rate Tester */}
            <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-6 shadow-xs space-y-4">
              <h3 className="text-base font-serif text-[#4A382D]">
                Live Rate Calculator Simulation
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-[#82756c] block mb-1">Select Governorate</label>
                  <select
                    value={testGov}
                    onChange={(e) => setTestGov(e.target.value)}
                    className="w-full p-2 bg-[#F5E6D3]/40 border border-[#d4c3b9] rounded"
                  >
                    {ALL_GOVERNORATES.map((g) => (
                      <option key={g.name} value={g.name}>
                        {g.name} ({g.zone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[#82756c] block mb-1">Total Weight (KG)</label>
                  <input
                    type="number"
                    step={0.1}
                    min={0.1}
                    value={testWeight}
                    onChange={(e) => setTestWeight(Number(e.target.value))}
                    className="w-full p-2 bg-[#F5E6D3]/40 border border-[#d4c3b9] rounded"
                  />
                </div>

                <div className="p-3 bg-[#F5E6D3]/60 rounded border border-[#d4c3b9] flex flex-col justify-center">
                  <span className="text-[#82756c]">Calculated Cost:</span>
                  <span className="text-base font-bold text-[#77553b]">
                    {testCalculation.isCalculable
                      ? `${testCalculation.shippingCost} EGP`
                      : 'Unavailable'}
                  </span>
                  <span className="text-[10px] text-[#82756c]">
                    Zone: {testCalculation.destinationZone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. CATEGORY MANAGEMENT TAB */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-6">
            <form
              onSubmit={handleSaveCategory}
              className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-6 shadow-xs space-y-4 h-fit"
            >
              <div className="flex items-center justify-between border-b border-[#d4c3b9] pb-4">
                <div>
                  <h2 className="text-xl font-serif text-[#4A382D]">
                    {editingCategoryId ? 'Edit Category' : 'Add Category'}
                  </h2>
                  <p className="text-xs text-[#82756c] mt-1">
                    Manage the cards shown on the public Categories page.
                  </p>
                </div>
                {editingCategoryId && (
                  <button type="button" onClick={resetCategoryForm} className="text-xs text-[#77553b] underline cursor-pointer">
                    Cancel
                  </button>
                )}
              </div>

              <div>
                <label className="font-semibold block mb-1 text-xs">Category Name *</label>
                <input
                  required
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  placeholder="e.g. Summer Collection"
                  className="w-full p-2.5 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-xs">Description</label>
                <textarea
                  rows={3}
                  value={categoryDescription}
                  onChange={(event) => setCategoryDescription(event.target.value)}
                  placeholder="Short description shown on the category card"
                  className="w-full p-2.5 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded text-xs"
                />
              </div>

              <ProductImageUploader images={categoryImage} onChange={setCategoryImage} />

              <button
                type="submit"
                className="w-full px-4 py-3 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-xs uppercase tracking-wider font-semibold rounded transition-colors cursor-pointer"
              >
                {editingCategoryId ? 'Save Category Changes' : 'Add Category'}
              </button>
            </form>

            <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-6 shadow-xs space-y-3">
              <div className="border-b border-[#d4c3b9] pb-4">
                <h2 className="text-xl font-serif text-[#4A382D]">Your Categories</h2>
                <p className="text-xs text-[#82756c] mt-1">Products use these exact names to appear inside each category.</p>
              </div>
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-3 p-3 bg-[#F5E6D3]/30 rounded-lg border border-[#d4c3b9]">
                  {category.image ? (
                    <img src={category.image} alt="" className="w-14 h-14 rounded object-cover shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded bg-[#B89578] text-[#FFFDF9] flex items-center justify-center text-center text-[10px] font-semibold p-1 shrink-0">
                      {category.name}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm truncate">{category.name}</h3>
                    <p className="text-[11px] text-[#82756c] line-clamp-2">{category.description || 'No description'}</p>
                  </div>
                  <button type="button" onClick={() => handleEditCategory(category)} className="p-2 text-[#77553b] hover:bg-[#F5E6D3] rounded cursor-pointer" title="Edit category">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => deleteCategory(category.id)} className="p-2 text-red-600 hover:bg-red-50 rounded cursor-pointer" title="Delete category">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. REVIEWS MODERATION TAB */}
        {activeTab === 'reviews' && (
          <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-6 shadow-xs space-y-4">
            <h2 className="text-xl font-serif text-[#4A382D]">Client Reviews Moderation</h2>
            <p className="text-xs text-[#82756c]">
              Review verified customer feedback, toggle public visibility, or delete inappropriate entries.
            </p>

            <div className="space-y-3 pt-2">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 bg-[#F5E6D3]/30 rounded-lg border border-[#d4c3b9] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#4A382D]">
                        {rev.customerName}
                      </span>
                      {rev.orderId && (
                        <span className="text-[10px] bg-[#F5E6D3] text-[#77553b] px-2 py-0.5 rounded font-mono">
                          Order #{rev.orderId}
                        </span>
                      )}
                      <div className="flex items-center text-amber-600">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[#4A382D]">"{rev.comment}"</p>
                    <span className="text-[10px] text-[#82756c]">
                      Submitted: {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        rev.isApproved ? hideReview(rev.id) : approveReview(rev.id)
                      }
                      className={`px-3 py-1.5 rounded font-semibold cursor-pointer ${
                        rev.isApproved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {rev.isApproved ? 'Approved (Visible)' : 'Pending Approval'}
                    </button>
                    <button
                      onClick={() => deleteReview(rev.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. STORE SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#d4c3b9] pb-4">
              <div>
                <h2 className="text-xl font-serif text-[#4A382D]">
                  Store & Payment Settings
                </h2>
                <p className="text-xs text-[#82756c]">
                  Configure your payment endpoints, wallet numbers, and brand communication channels.
                </p>
              </div>
              {settingsSaveSuccess && (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Settings updated
                </span>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Payment Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#77553b]">
                  Payment Receiving Accounts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#4A382D] block mb-1">
                      Vodafone Cash Wallet Number
                    </label>
                    <input
                      type="text"
                      value={settingsForm.vodafoneCashNumber}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          vodafoneCashNumber: e.target.value,
                        })
                      }
                      className="w-full text-xs p-2.5 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A382D] block mb-1">
                      InstaPay Address (IPA)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.instapayAccount}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          instapayAccount: e.target.value,
                        })
                      }
                      className="w-full text-xs p-2.5 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A382D] block mb-1">
                      InstaPay Display Account Name
                    </label>
                    <input
                      type="text"
                      value={settingsForm.instapayName}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          instapayName: e.target.value,
                        })
                      }
                      className="w-full text-xs p-2.5 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Communication channels */}
              <div className="space-y-4 border-t border-[#d4c3b9]/50 pt-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#77553b]">
                  Brand Contact & Social
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#4A382D] block mb-1">
                      WhatsApp Concierge Line
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsapp}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          whatsapp: e.target.value,
                        })
                      }
                      className="w-full text-xs p-2.5 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A382D] block mb-1">
                      Customer Service Email
                    </label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full text-xs p-2.5 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A382D] block mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="text"
                      value={settingsForm.instagram}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          instagram: e.target.value,
                        })
                      }
                      className="w-full text-xs p-2.5 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A382D] block mb-1">
                      Facebook URL
                    </label>
                    <input
                      type="text"
                      value={settingsForm.facebook}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          facebook: e.target.value,
                        })
                      }
                      className="w-full text-xs p-2.5 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A382D] block mb-1">
                      TikTok URL
                    </label>
                    <input
                      type="text"
                      value={settingsForm.tiktok}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          tiktok: e.target.value,
                        })
                      }
                      className="w-full text-xs p-2.5 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-xs font-sans uppercase tracking-wider font-semibold rounded transition-colors cursor-pointer"
              >
                Save Store Settings
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#27180F]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#FFFDF9] text-[#4A382D] rounded-xl border border-[#d4c3b9] p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#d4c3b9] pb-3 mb-6">
              <h3 className="text-lg font-serif text-[#4A382D]">
                {editingProductId ? 'Edit Garment Piece' : 'Add New Garment Piece'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-[#82756c] hover:text-[#4A382D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Classic Organic V-Neck Top"
                    className="w-full p-2.5 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold block">Category Style *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategoryMode(!isCustomCategoryMode);
                        if (!isCustomCategoryMode) {
                          setCustomCategoryInput('');
                        }
                      }}
                      className="text-[11px] text-[#77553b] hover:text-[#4A382D] underline font-medium cursor-pointer"
                    >
                      {isCustomCategoryMode ? '← Choose Existing' : '+ New Category'}
                    </button>
                  </div>

                  {isCustomCategoryMode ? (
                    <input
                      type="text"
                      required
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      placeholder="Type new category name..."
                      className="w-full p-2.5 bg-[#FFFDF9] border-2 border-[#77553b] rounded focus:outline-none"
                    />
                  ) : (
                    <select
                      value={prodCategory}
                      onChange={(e) => {
                        if (e.target.value === '__NEW__') {
                          setIsCustomCategoryMode(true);
                          setCustomCategoryInput('');
                        } else {
                          setProdCategory(e.target.value);
                        }
                      }}
                      className="w-full p-2.5 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                      <option value="__NEW__">+ Add Custom Category...</option>
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                    placeholder="Details on fabric, style, care instructions..."
                  className="w-full p-2.5 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded"
                />
              </div>

              {/* Price Fields (Original Price & Sale Price) */}
              <div className="bg-[#F5E6D3]/30 dark:bg-[#281E18]/60 p-3.5 rounded-lg border border-[#d4c3b9]/70 dark:border-[#423329] space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold block mb-1 text-[#4A382D] dark:text-[#E8DACB]">
                      Original Price (السعر قبل الخصم)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={prodOriginalPrice}
                        onChange={(e) => {
                          setProdOriginalPrice(e.target.value);
                          setPriceValidationError(null);
                        }}
                        placeholder="e.g. 1500 (اختياري)"
                        className="w-full p-2.5 bg-[#FFFDF9] dark:bg-[#1E1712] border border-[#d4c3b9] dark:border-[#523E30] rounded text-[#4A382D] dark:text-[#FAF6F0] pr-12 focus:outline-none focus:border-[#77553b]"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-[#82756c] dark:text-[#AD9E92] font-semibold pointer-events-none">
                        EGP
                      </span>
                    </div>
                    <span className="text-[10px] text-[#82756c] dark:text-[#AD9E92] mt-1 block">
                      إذا كان أكبر من سعر البيع، سيظهر مشطوباً تلقائياً
                    </span>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-[#4A382D] dark:text-[#E8DACB]">
                      Sale Price (السعر بعد الخصم / سعر البيع) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min={1}
                        step={1}
                        value={prodPrice}
                        onChange={(e) => {
                          setProdPrice(Number(e.target.value));
                          setPriceValidationError(null);
                        }}
                        placeholder="e.g. 999"
                        className="w-full p-2.5 bg-[#FFFDF9] dark:bg-[#1E1712] border border-[#d4c3b9] dark:border-[#523E30] rounded text-[#4A382D] dark:text-[#FAF6F0] pr-12 focus:outline-none focus:border-[#77553b]"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-[#82756c] dark:text-[#AD9E92] font-semibold pointer-events-none">
                        EGP
                      </span>
                    </div>
                    <span className="text-[10px] text-[#82756c] dark:text-[#AD9E92] mt-1 block">
                      السعر الفعلي المطلوب للدفع عند الشراء
                    </span>
                  </div>
                </div>

                {priceValidationError && (
                  <div className="p-2.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/70 rounded text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{priceValidationError}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Item Weight (KG) *</label>
                  <input
                    type="number"
                    step={0.01}
                    required
                    min={0.05}
                    value={prodWeight}
                    onChange={(e) => setProdWeight(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded"
                  />
                </div>
              </div>

              <ProductOptionsSelector
                colors={prodColors}
                sizes={prodSizes}
                onColorsChange={setProdColors}
                onSizesChange={setProdSizes}
              />

              {/* Direct Image File Uploader */}
              <ProductImageUploader
                images={prodImages}
                onChange={(imgs) => setProdImages(imgs)}
              />

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodAvailable}
                    onChange={(e) => setProdAvailable(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="font-medium">Active & Available in Store</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#d4c3b9] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-[#d4c3b9] rounded hover:bg-[#F5E6D3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] font-semibold rounded uppercase tracking-wider cursor-pointer"
                >
                  Save Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-[#1E1610]/70 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] dark:bg-[#1D1612] text-[#4A382D] dark:text-[#F0E6DC] rounded-xl border border-[#d4c3b9] dark:border-[#3D3027] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-[#27180F] dark:text-[#FFFDF9]">
                  Delete Product?
                </h3>
                <p className="text-xs text-[#82756C] dark:text-[#AD9E92]">
                  Are you sure you want to delete this piece? This action will remove it from the catalog immediately.
                </p>
              </div>
            </div>

            {/* Product Item Preview */}
            <div className="flex items-center gap-3 p-3 bg-[#FAF7F2] dark:bg-[#241C17] border border-[#d4c3b9] dark:border-[#3D3027] rounded-lg">
              <div className="w-12 h-14 bg-stone-100 dark:bg-stone-900 rounded overflow-hidden shrink-0 border border-[#d4c3b9] dark:border-[#3D3027]">
                <img
                  src={productToDelete.images[0]}
                  alt={productToDelete.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-serif font-semibold text-xs text-[#27180F] dark:text-[#FFFDF9] truncate">
                  {productToDelete.name}
                </h4>
                <p className="text-[11px] text-[#82756C] dark:text-[#AD9E92] truncate">
                  {productToDelete.category}
                </p>
                <p className="text-xs font-semibold text-[#77553b] dark:text-[#C8A882] mt-0.5">
                  EGP {productToDelete.price}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 border border-[#d4c3b9] dark:border-[#3D3027] rounded-md text-xs font-medium hover:bg-[#F5E6D3] dark:hover:bg-[#2B221C] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Product From Order Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-[#1E1610]/70 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] dark:bg-[#1D1612] text-[#4A382D] dark:text-[#F0E6DC] rounded-xl border border-[#d4c3b9] dark:border-[#3D3027] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-[#27180F] dark:text-[#FFFDF9]">
                  Delete Product from Order?
                </h3>
                <p className="text-xs text-[#82756C] dark:text-[#AD9E92]">
                  Are you sure you want to remove this product from order <span className="font-mono font-bold text-[#77553b] dark:text-[#D1B198]">#{itemToDelete.order.orderNumber}</span>? Order totals and shipping weights will be automatically recalculated.
                </p>
              </div>
            </div>

            {/* Item Preview */}
            <div className="flex items-center gap-3 p-3 bg-[#FAF7F2] dark:bg-[#241C17] border border-[#d4c3b9] dark:border-[#3D3027] rounded-lg">
              <div className="w-12 h-14 bg-stone-100 dark:bg-stone-900 rounded overflow-hidden shrink-0 border border-[#d4c3b9] dark:border-[#3D3027]">
                <img
                  src={itemToDelete.item.productImage}
                  alt={itemToDelete.item.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <h4 className="font-serif font-semibold text-[#27180F] dark:text-[#FFFDF9] truncate">
                  {itemToDelete.item.productName}
                </h4>
                <p className="text-[11px] text-[#82756C] dark:text-[#AD9E92] mt-0.5">
                  Color: {itemToDelete.item.selectedColor.name} • Size: {itemToDelete.item.selectedSize} • Qty: {itemToDelete.item.quantity}
                </p>
                <p className="text-xs font-semibold text-[#77553b] dark:text-[#C8A882] mt-0.5">
                  {(itemToDelete.item.price * itemToDelete.item.quantity).toLocaleString()} EGP
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 border border-[#d4c3b9] dark:border-[#3D3027] rounded-md text-xs font-medium hover:bg-[#F5E6D3] dark:hover:bg-[#2B221C] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteOrderItem(itemToDelete.order.id, itemToDelete.itemIndex);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Yes, Delete from Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Entire Order Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 bg-[#1E1610]/70 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] dark:bg-[#1D1612] text-[#4A382D] dark:text-[#F0E6DC] rounded-xl border border-[#d4c3b9] dark:border-[#3D3027] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-[#27180F] dark:text-[#FFFDF9]">
                  Delete Entire Order?
                </h3>
                <p className="text-xs text-[#82756C] dark:text-[#AD9E92]">
                  Are you sure you want to completely delete order <span className="font-mono font-bold text-[#77553b] dark:text-[#D1B198]">#{orderToDelete.orderNumber}</span> for <span className="font-semibold text-[#4A382D] dark:text-[#FFFDF9]">{orderToDelete.customerName}</span>?
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#FAF7F2] dark:bg-[#241C17] border border-[#d4c3b9] dark:border-[#3D3027] rounded-lg text-xs space-y-1">
              <div className="flex justify-between text-[#82756C] dark:text-[#AD9E92]">
                <span>Date:</span>
                <span className="font-medium text-[#4A382D] dark:text-[#FFFDF9]">{new Date(orderToDelete.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#82756C] dark:text-[#AD9E92]">
                <span>Total Items:</span>
                <span className="font-medium text-[#4A382D] dark:text-[#FFFDF9]">{orderToDelete.items.length} items</span>
              </div>
              <div className="flex justify-between text-[#82756C] dark:text-[#AD9E92]">
                <span>Total Amount:</span>
                <span className="font-bold text-[#77553b] dark:text-[#C8A882]">{orderToDelete.total.toLocaleString()} EGP</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 border border-[#d4c3b9] dark:border-[#3D3027] rounded-md text-xs font-medium hover:bg-[#F5E6D3] dark:hover:bg-[#2B221C] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteOrder(orderToDelete.id);
                  setOrderToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Yes, Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* High-Definition Interactive Payment Proof Viewer Modal */}
      {(selectedProofUrl || selectedProofOrder) && (
        <PaymentProofModal
          order={selectedProofOrder}
          proofUrl={selectedProofOrder?.paymentProofUrl || selectedProofUrl}
          onClose={() => {
            setSelectedProofOrder(null);
            setSelectedProofUrl(null);
          }}
          onUpdatePaymentStatus={updatePaymentStatus}
        />
      )}
    </div>
  );
};

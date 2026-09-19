export type ShippingZoneName =
  | 'Greater Cairo'
  | 'Alexandria'
  | 'Delta'
  | 'Canal'
  | 'Upper Egypt'
  | 'Beyond Zones';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in EGP (Current / Sale Price)
  originalPrice?: number; // in EGP (Original Price before discount)
  category: string;
  images: string[];
  sizes: string[]; // e.g. ['S', 'M', 'L', 'XL']
  colors: ProductColor[];
  stock: number;
  isAvailable: boolean;
  weight: number; // in KG, e.g. 0.4
  featured?: boolean;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  types?: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
}

export type PaymentMethod = 'instapay' | 'vodafone_cash' | 'cod';

export type OrderStatus =
  | 'Order Placed'
  | 'Pending'
  | 'Confirmed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'COD';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  selectedColor: ProductColor;
  selectedSize: string;
  price: number;
  quantity: number;
  weight: number; // per unit in KG
  totalItemWeight: number; // weight * quantity
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: number;
  customerName: string;
  customerPhone: string;
  governorate: string;
  destinationZone: ShippingZoneName;
  city: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  totalWeight: number; // in KG
  originZone: ShippingZoneName;
  shippingCost: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentProofUrl?: string;
  paymentProofName?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  governorate: string;
  city: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: number;
}

export interface Review {
  id: string;
  productId: string;
  orderId?: string;
  customerName: string;
  rating: number; // 1 - 5
  comment: string;
  imageUrl?: string;
  createdAt: number;
  isApproved: boolean;
}

export type OriginZoneRateMap = Record<ShippingZoneName, Record<ShippingZoneName, number>>;

export interface ShippingRatesConfig {
  originZone: ShippingZoneName;
  firstKgRates: Partial<OriginZoneRateMap>;
  additionalKgRates: Partial<OriginZoneRateMap>;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  vodafoneCashNumber: string;
  instapayAccount: string;
  instapayName: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

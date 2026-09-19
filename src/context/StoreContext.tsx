import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  Product,
  Category,
  CartItem,
  ProductColor,
  Order,
  Customer,
  Review,
  ShippingRatesConfig,
  StoreSettings,
  ShippingZoneName,
  OrderStatus,
  PaymentStatus,
} from '../types';
import {
  DEFAULT_CATEGORIES,
  INITIAL_REVIEWS,
  DEFAULT_STORE_SETTINGS,
} from '../data/initialProducts';
import {
  DEFAULT_SHIPPING_CONFIG,
  calculateShippingCost,
  getZoneForGovernorate,
} from '../data/shippingRates';
import {
  generateInstapayReceiptSvg,
  generateVodafoneCashReceiptSvg,
  readFileAsHighResDataUrl,
} from '../utils/paymentProofHelper';

interface AddToCartNotification {
  show: boolean;
  message: string;
  productName?: string;
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlistIds: string[];
  orders: Order[];
  customers: Customer[];
  reviews: Review[];
  shippingConfig: ShippingRatesConfig;
  settings: StoreSettings;
  isGlobalLoading: boolean;
  cartNotification: AddToCartNotification;
  totalCartCount: number;
  totalCartWeight: number; // in KG
  cartSubtotal: number; // in EGP
  
  // Cart Actions
  addToCart: (product: Product, selectedColor: ProductColor, selectedSize: string, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;

  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Order Actions
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus' | 'paymentStatus'> & { paymentProofFile?: File }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  deleteOrder: (orderId: string) => void;
  deleteOrderItem: (orderId: string, itemIndex: number) => void;

  // Product Admin Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  deleteAllProducts: () => Promise<void>;

  // Category Admin Actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Review Actions
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'isApproved'>) => void;
  approveReview: (id: string) => void;
  hideReview: (id: string) => void;
  deleteReview: (id: string) => void;

  // Shipping Config Actions
  updateShippingOrigin: (origin: ShippingZoneName) => void;
  updateShippingRates: (firstKgRates: any, additionalKgRates: any) => void;
  getShippingForGovernorate: (governorate: string, weightKg?: number) => { shippingCost: number; destinationZone: ShippingZoneName | null; isCalculable: boolean; errorMessage?: string };

  // Settings Actions
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Global Loader
  triggerGlobalLoading: (durationMs?: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Helper to remove any undefined properties for Firestore compatibility
function cleanData<T extends Record<string, any>>(obj: T): T {
  const result: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      if (Array.isArray(obj[key])) {
        result[key] = obj[key].map((item: any) =>
          typeof item === 'object' && item !== null ? cleanData(item) : item
        );
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = cleanData(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
  });
  return result;
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ownonce_products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 2. Categories State
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('ownonce_categories');
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  // 3. Cart State (Local to device)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ownonce_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 4. Wishlist State (Local to device)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ownonce_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Orders State (Synced via Firestore in Real-time)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ownonce_orders');
      if (saved) return JSON.parse(saved);
      return [];
    } catch {
      return [];
    }
  });

  // 6. Reviews State (Synced via Firestore)
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('ownonce_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // 7. Shipping Configuration (Synced via Firestore)
  const [shippingConfig, setShippingConfig] = useState<ShippingRatesConfig>(() => {
    try {
      const saved = localStorage.getItem('ownonce_shipping_config');
      return saved ? JSON.parse(saved) : DEFAULT_SHIPPING_CONFIG;
    } catch {
      return DEFAULT_SHIPPING_CONFIG;
    }
  });

  // 8. Settings State (Synced via Firestore)
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('ownonce_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_STORE_SETTINGS,
          ...parsed,
        };
      }
      return DEFAULT_STORE_SETTINGS;
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  });

  // UI state
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [cartNotification, setCartNotification] = useState<AddToCartNotification>({
    show: false,
    message: 'Product added to your shopping cart.',
  });

  // =========================================================================
  // REAL-TIME FIRESTORE SYNCHRONIZATION LISTENERS
  // =========================================================================

  // 1. Orders Real-time Sync (Crucial for multi-device sync!)
  useEffect(() => {
    let isInitialCheckDone = false;
    const unsubscribe = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedOrders: Order[] = [];
          snapshot.forEach((docSnap) => {
            loadedOrders.push(docSnap.data() as Order);
          });
          // Sort by creation time descending (newest first)
          loadedOrders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setOrders(loadedOrders);
        } else if (!isInitialCheckDone) {
          isInitialCheckDone = true;
          // Seed demo orders if database has no orders yet
          const initialSeedOrders: Order[] = [
            {
              id: 'ord-1001',
              orderNumber: 'OWN-98421',
              createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
              customerName: 'Nour El-Din',
              customerPhone: '01012345678',
              governorate: 'Cairo',
              destinationZone: 'Greater Cairo',
              city: 'Nasr City',
              address: 'Building 12, Tayaran Street, Apt 4',
              notes: 'Please call upon arrival.',
              items: [
                {
                  productId: 'prod-rn-ss-01',
                  productName: 'Essential Ribbed Round Neck Top',
                  productImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
                  selectedColor: { name: 'Beige', hex: '#D9C2A6' },
                  selectedSize: 'M',
                  price: 680,
                  quantity: 2,
                  weight: 0.35,
                  totalItemWeight: 0.7,
                },
              ],
              subtotal: 1360,
              totalWeight: 0.7,
              originZone: 'Greater Cairo',
              shippingCost: 76,
              total: 1436,
              paymentMethod: 'instapay',
              paymentStatus: 'Paid',
              orderStatus: 'Delivered',
              paymentProofUrl: generateInstapayReceiptSvg('OWN-98421', 1436, 'Nour El-Din', '20 Aug 2026, 04:32 PM', 'IPAY-20260820-98421'),
            },
            {
              id: 'ord-1002',
              orderNumber: 'OWN-98544',
              createdAt: Date.now() - 1000 * 60 * 60 * 8,
              customerName: 'Farida Mansour',
              customerPhone: '01298765432',
              governorate: 'Alexandria',
              destinationZone: 'Alexandria',
              city: 'Smouha',
              address: 'Villa 5, Victor Emanuel Square',
              notes: 'Leave at gate reception if not answering.',
              items: [
                {
                  productId: 'prod-vn-ss-01',
                  productName: 'Classic Tailored V-Neck Short Sleeve',
                  productImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80',
                  selectedColor: { name: 'Black', hex: '#000000' },
                  selectedSize: 'S',
                  price: 750,
                  quantity: 1,
                  weight: 0.36,
                  totalItemWeight: 0.36,
                },
                {
                  productId: 'prod-rn-sl-01',
                  productName: 'High-Neck Minimalist Sleeveless Top',
                  productImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
                  selectedColor: { name: 'Olive', hex: '#808000' },
                  selectedSize: 'M',
                  price: 590,
                  quantity: 1,
                  weight: 0.28,
                  totalItemWeight: 0.28,
                },
              ],
              subtotal: 1340,
              totalWeight: 0.64,
              originZone: 'Greater Cairo',
              shippingCost: 82,
              total: 1422,
              paymentMethod: 'vodafone_cash',
              paymentStatus: 'Paid',
              orderStatus: 'Shipped',
              paymentProofUrl: generateVodafoneCashReceiptSvg('OWN-98544', 1422, 'Farida Mansour', '23 Aug 2026, 02:15 PM', 'VF-98544-20260823'),
            },
          ];
          initialSeedOrders.forEach((ord) => {
            setDoc(doc(db, 'orders', ord.id), cleanData(ord)).catch(console.error);
          });
          setOrders(initialSeedOrders);
        } else {
          setOrders([]);
        }
      },
      (err) => {
        console.warn('Firestore orders sync warning:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Products Real-time Sync
  useEffect(() => {
    let isInitialCheckDone = false;
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedProds: Product[] = [];
          snapshot.forEach((docSnap) => {
            loadedProds.push(docSnap.data() as Product);
          });
          loadedProds.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setProducts(loadedProds);
        } else if (!isInitialCheckDone) {
          isInitialCheckDone = true;
          setProducts([]);
        }
      },
      (err) => {
        console.warn('Firestore products sync warning:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // 3. Categories Real-time Sync
  useEffect(() => {
    let isInitialCheckDone = false;
    const unsubscribe = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedCats: Category[] = [];
          snapshot.forEach((docSnap) => {
            loadedCats.push(docSnap.data() as Category);
          });
          setCategories(loadedCats);
        } else if (!isInitialCheckDone) {
          isInitialCheckDone = true;
          DEFAULT_CATEGORIES.forEach((cat) => {
            setDoc(doc(db, 'categories', cat.id), cleanData(cat)).catch(console.error);
          });
          setCategories(DEFAULT_CATEGORIES);
        }
      },
      (err) => {
        console.warn('Firestore categories sync warning:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // 4. Reviews Real-time Sync
  useEffect(() => {
    let isInitialCheckDone = false;
    const unsubscribe = onSnapshot(
      collection(db, 'reviews'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedReviews: Review[] = [];
          snapshot.forEach((docSnap) => {
            loadedReviews.push(docSnap.data() as Review);
          });
          loadedReviews.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setReviews(loadedReviews);
        } else if (!isInitialCheckDone) {
          isInitialCheckDone = true;
          INITIAL_REVIEWS.forEach((rev) => {
            setDoc(doc(db, 'reviews', rev.id), cleanData(rev)).catch(console.error);
          });
          setReviews(INITIAL_REVIEWS);
        }
      },
      (err) => {
        console.warn('Firestore reviews sync warning:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // 5. Store Settings Real-time Sync
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'settings', 'store'),
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings((prev) => ({
            ...prev,
            ...(docSnap.data() as StoreSettings),
          }));
        } else {
          setDoc(doc(db, 'settings', 'store'), cleanData(DEFAULT_STORE_SETTINGS)).catch(console.error);
        }
      },
      (err) => {
        console.warn('Firestore settings sync warning:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // 6. Shipping Configuration Real-time Sync
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'settings', 'shipping'),
      (docSnap) => {
        if (docSnap.exists()) {
          setShippingConfig(docSnap.data() as ShippingRatesConfig);
        } else {
          setDoc(doc(db, 'settings', 'shipping'), cleanData(DEFAULT_SHIPPING_CONFIG)).catch(console.error);
        }
      },
      (err) => {
        console.warn('Firestore shipping config sync warning:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // LocalStorage Local Fallback Persistence
  useEffect(() => {
    try {
      localStorage.setItem('ownonce_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('ownonce_categories', JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('ownonce_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('ownonce_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('ownonce_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('ownonce_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('ownonce_shipping_config', JSON.stringify(shippingConfig));
    } catch (e) {
      console.error(e);
    }
  }, [shippingConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('ownonce_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Derived Customers from Orders
  const customers: Customer[] = React.useMemo(() => {
    const map = new Map<string, Customer>();
    orders.forEach((ord) => {
      const phone = ord.customerPhone.trim();
      const existing = map.get(phone);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += ord.total;
        if (ord.createdAt > existing.lastOrderDate) {
          existing.lastOrderDate = ord.createdAt;
          existing.address = ord.address;
          existing.governorate = ord.governorate;
          existing.city = ord.city;
        }
      } else {
        map.set(phone, {
          id: `cust-${phone}`,
          name: ord.customerName,
          phone: ord.customerPhone,
          governorate: ord.governorate,
          city: ord.city,
          address: ord.address,
          orderCount: 1,
          totalSpent: ord.total,
          lastOrderDate: ord.createdAt,
        });
      }
    });
    return Array.from(map.values());
  }, [orders]);

  // Cart Computations
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Total weight is item.product.weight * item.quantity for all items
  const totalCartWeight = Number(
    cart.reduce((sum, item) => sum + (item.product.weight || 0.4) * item.quantity, 0).toFixed(2)
  );

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Global loader helper
  const triggerGlobalLoading = (durationMs = 1800) => {
    setIsGlobalLoading(true);
    setTimeout(() => {
      setIsGlobalLoading(false);
    }, durationMs);
  };

  // Add to cart with notification directly below navbar
  const addToCart = (product: Product, selectedColor: ProductColor, selectedSize: string, quantity = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedColor.name === selectedColor.name &&
          item.selectedSize === selectedSize
      );

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          quantity: copy[existingIdx].quantity + quantity,
        };
        return copy;
      }

      const newItem: CartItem = {
        id: `cart-${product.id}-${selectedColor.name}-${selectedSize}-${Date.now()}`,
        productId: product.id,
        product,
        selectedColor,
        selectedSize,
        quantity,
      };
      return [...prev, newItem];
    });

    // Trigger specified notification below navbar
    setCartNotification({
      show: true,
      message: 'Product added to your shopping cart.',
      productName: product.name,
    });

    setTimeout(() => {
      setCartNotification((prev) => ({ ...prev, show: false }));
    }, 2800);
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  // Orders creation and mutations with Firestore Realtime Sync
  const createOrder = async (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus' | 'paymentStatus'> & {
      paymentProofFile?: File;
    }
  ): Promise<Order> => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `OWN-${randomNum}`;

    let proofUrl = orderData.paymentProofUrl;
    if (orderData.paymentProofFile) {
      try {
        proofUrl = await readFileAsHighResDataUrl(orderData.paymentProofFile);
      } catch {
        proofUrl = URL.createObjectURL(orderData.paymentProofFile);
      }
    }

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}-${randomNum}`,
      orderNumber,
      createdAt: Date.now(),
      orderStatus: 'Pending',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'COD' : 'Pending',
      paymentProofUrl: proofUrl || '',
      paymentProofName: orderData.paymentProofFile?.name || '',
    };

    // Save directly to Firestore for instant global multi-device sync
    try {
      await setDoc(doc(db, 'orders', newOrder.id), cleanData(newOrder));
    } catch (err) {
      console.error('Failed to sync order to cloud Firestore:', err);
    }

    // Reserve the ordered quantities so the product card closes when stock reaches zero.
    const orderedQuantities = newOrder.items.reduce<Record<string, number>>((totals, item) => {
      totals[item.productId] = (totals[item.productId] || 0) + item.quantity;
      return totals;
    }, {});

    setProducts((prev) =>
      prev.map((product) => {
        const orderedQuantity = orderedQuantities[product.id];
        if (!orderedQuantity) return product;

        const nextStock = Math.max(0, product.stock - orderedQuantity);
        updateDoc(doc(db, 'products', product.id), { stock: nextStock }).catch((err) => {
          console.error(`Failed to update stock for product ${product.id}:`, err);
        });

        return { ...product, stock: nextStock };
      })
    );

    // Also update local state for immediate feedback
    setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
    );
    try {
      updateDoc(doc(db, 'orders', orderId), { orderStatus: status }).catch(console.error);
    } catch (e) {
      console.error(e);
    }
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o))
    );
    try {
      updateDoc(doc(db, 'orders', orderId), { paymentStatus: status }).catch(console.error);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    try {
      deleteDoc(doc(db, 'orders', orderId)).catch(console.error);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteOrderItem = (orderId: string, itemIndex: number) => {
    setOrders((prev) => {
      const order = prev.find((o) => o.id === orderId);
      if (!order) return prev;

      const updatedItems = order.items.filter((_, idx) => idx !== itemIndex);
      if (updatedItems.length === 0) {
        deleteOrder(orderId);
        return prev.filter((o) => o.id !== orderId);
      }

      const subtotal = updatedItems.reduce(
        (sum, it) => sum + it.price * it.quantity,
        0
      );
      const totalWeight =
        Math.round(
          updatedItems.reduce(
            (sum, it) => sum + (it.weight || 0.35) * it.quantity,
            0
          ) * 100
        ) / 100;
      const total = subtotal + order.shippingCost;

      const updatedOrder: Order = {
        ...order,
        items: updatedItems,
        subtotal,
        totalWeight,
        total,
      };

      try {
        setDoc(doc(db, 'orders', orderId), cleanData(updatedOrder)).catch(console.error);
      } catch (e) {
        console.error(e);
      }

      return prev.map((o) => (o.id === orderId ? updatedOrder : o));
    });
  };

  // Products CRUD
  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProd: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: Date.now(),
    };
    setProducts((prev) => [newProd, ...prev]);
    try {
      setDoc(doc(db, 'products', newProd.id), cleanData(newProd)).catch(console.error);
    } catch (e) {
      console.error(e);
    }

    // Ensure category exists in categories state & cloud
    if (product.category && product.category.trim()) {
      const cleanCategoryName = product.category.trim();
      setCategories((prevCats) => {
        const exists = prevCats.some(
          (c) => c.name.trim().toLowerCase() === cleanCategoryName.toLowerCase()
        );
        if (!exists) {
          const newCat: Category = {
            id: `cat-${Date.now()}`,
            name: cleanCategoryName,
            slug: cleanCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: `Signature ${cleanCategoryName} designs crafted with meticulous attention to detail.`,
            image:
              product.images?.[0] ||
              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
          };
          try {
            setDoc(doc(db, 'categories', newCat.id), cleanData(newCat)).catch(console.error);
          } catch (e) {
            console.error(e);
          }
          return [...prevCats, newCat];
        }
        return prevCats;
      });
    }
  };

  const updateProduct = (id: string, partial: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...partial } : p))
    );
    try {
      updateDoc(doc(db, 'products', id), cleanData(partial)).catch(console.error);
    } catch (e) {
      console.error(e);
    }

    // If category changed, ensure it exists in categories
    if (partial.category && partial.category.trim()) {
      const cleanCategoryName = partial.category.trim();
      setCategories((prevCats) => {
        const exists = prevCats.some(
          (c) => c.name.trim().toLowerCase() === cleanCategoryName.toLowerCase()
        );
        if (!exists) {
          const newCat: Category = {
            id: `cat-${Date.now()}`,
            name: cleanCategoryName,
            slug: cleanCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: `Signature ${cleanCategoryName} designs crafted with meticulous attention to detail.`,
            image:
              partial.images?.[0] ||
              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
          };
          try {
            setDoc(doc(db, 'categories', newCat.id), cleanData(newCat)).catch(console.error);
          } catch (e) {
            console.error(e);
          }
          return [...prevCats, newCat];
        }
        return prevCats;
      });
    }
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      deleteDoc(doc(db, 'products', id)).catch(console.error);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteAllProducts = async () => {
    const productIds = products.map((product) => product.id);
    setProducts([]);
    localStorage.removeItem('ownonce_products');
    await Promise.all(productIds.map((id) => deleteDoc(doc(db, 'products', id))));
  };

  // Categories CRUD
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
    try {
      setDoc(doc(db, 'categories', newCat.id), cleanData(newCat)).catch(console.error);
    } catch (e) {
      console.error(e);
    }
  };

  const updateCategory = (id: string, partial: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...partial } : c))
    );
    try {
      updateDoc(doc(db, 'categories', id), cleanData(partial)).catch(console.error);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    try {
      deleteDoc(doc(db, 'categories', id)).catch(console.error);
    } catch (e) {
      console.error(e);
    }
  };

  // Reviews CRUD
  const addReview = (rev: Omit<Review, 'id' | 'createdAt' | 'isApproved'>) => {
    const newRev: Review = {
      ...rev,
      id: `rev-${Date.now()}`,
      createdAt: Date.now(),
      isApproved: true,
    };
    setReviews((prev) => [newRev, ...prev]);
    try {
      setDoc(doc(db, 'reviews', newRev.id), cleanData(newRev)).catch(console.error);
    } catch (e) {
      console.error(e);
    }
  };

  const approveReview = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isApproved: true } : r))
    );
    try {
      updateDoc(doc(db, 'reviews', id), { isApproved: true }).catch(console.error);
    } catch (e) {
      console.error(e);
    }
  };

  const hideReview = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isApproved: false } : r))
    );
    try {
      updateDoc(doc(db, 'reviews', id), { isApproved: false }).catch(console.error);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    try {
      deleteDoc(doc(db, 'reviews', id)).catch(console.error);
    } catch (e) {
      console.error(e);
    }
  };

  // Shipping Configuration
  const updateShippingOrigin = (origin: ShippingZoneName) => {
    const updated = { ...shippingConfig, originZone: origin };
    setShippingConfig(updated);
    try {
      setDoc(doc(db, 'settings', 'shipping'), cleanData(updated)).catch(console.error);
    } catch (e) {
      console.error(e);
    }
  };

  const updateShippingRates = (firstKgRates: any, additionalKgRates: any) => {
    const updated = {
      ...shippingConfig,
      firstKgRates,
      additionalKgRates,
    };
    setShippingConfig(updated);
    try {
      setDoc(doc(db, 'settings', 'shipping'), cleanData(updated)).catch(console.error);
    } catch (e) {
      console.error(e);
    }
  };

  const getShippingForGovernorate = (
    governorate: string,
    weightKg = totalCartWeight
  ) => {
    const destinationZone = getZoneForGovernorate(governorate);
    if (!destinationZone) {
      return {
        shippingCost: 0,
        destinationZone: null,
        isCalculable: false,
        errorMessage: `Governorate "${governorate}" not recognized in shipping zones.`,
      };
    }

    const calcResult = calculateShippingCost({
      originZone: shippingConfig.originZone,
      destinationZone,
      weightKg,
      config: shippingConfig,
    });

    return {
      shippingCost: calcResult.shippingCost,
      destinationZone,
      isCalculable: calcResult.isCalculable,
      errorMessage: calcResult.errorMessage,
    };
  };

  // Settings
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      setDoc(doc(db, 'settings', 'store'), cleanData(updated)).catch(console.error);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlistIds,
        orders,
        customers,
        reviews,
        shippingConfig,
        settings,
        isGlobalLoading,
        cartNotification,
        totalCartCount,
        totalCartWeight,
        cartSubtotal,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        deleteOrder,
        deleteOrderItem,
        addProduct,
        updateProduct,
        deleteProduct,
        deleteAllProducts,
        addCategory,
        updateCategory,
        deleteCategory,
        addReview,
        approveReview,
        hideReview,
        deleteReview,
        updateShippingOrigin,
        updateShippingRates,
        getShippingForGovernorate,
        updateSettings,
        triggerGlobalLoading,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

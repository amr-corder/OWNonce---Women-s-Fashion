import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { OrderDeliveryExperience } from '../components/OrderDeliveryExperience';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, settings } = useStore();

  const order = orders.find(
    (o) => o.orderNumber === orderId || o.id === orderId
  ) || orders[0];

  const displayOrderNumber = orderId && orderId !== 'demo' ? orderId : order?.orderNumber || 'OWN-98544';

  return (
    <div
      id="order-success-page"
      className="min-h-screen bg-[#F5EFE6] dark:bg-[#120D0A] text-[#4A382D] dark:text-[#F0E6DC] py-8 sm:py-14 transition-colors"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <OrderDeliveryExperience
          order={order}
          orderNumber={displayOrderNumber}
          settings={settings}
        />
      </div>
    </div>
  );
};

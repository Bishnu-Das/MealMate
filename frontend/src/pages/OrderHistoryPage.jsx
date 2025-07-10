import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../lib/axios';
import { Button } from '../restaurant/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('/customer/order');
        setOrders(res.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-50 text-gray-800">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mr-2">
          <ArrowLeft />
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
      </div>

      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.order_id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-pink-600">{order.restaurant_name}</h2>
                <span className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700">Order ID: {order.order_id}</p>
                  <p className="text-gray-700">
                    Status:{' '}
                    <span
                      className={`font-semibold ${
                        order.status === 'delivered'
                          ? 'text-green-600'
                          : order.status === 'cancelled'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                </div>
                <p className="text-lg font-bold text-gray-900">${order.total_amount}</p>
              </div>

              <div className="mt-4 border-t pt-4">
                <h3 className="text-md font-semibold mb-2">Items:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {order.items &&
                    order.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-600">
                        {item.menu_item_name} (x{item.quantity}) - ${item.price}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">You have no orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
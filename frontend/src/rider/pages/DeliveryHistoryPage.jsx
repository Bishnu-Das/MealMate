import React, { useEffect, useState } from "react";
import Navbar from "../../Components/skeleton/Navbar";
import { axiosInstance } from "../../../lib/axios";
import { Loader2, Package, Calendar, DollarSign, CheckCircle, Clock, MapPin, TrendingUp, Award } from "lucide-react";
import toast from "react-hot-toast";

const DeliveryHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get("/rider/data/history");
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching delivery history:", err);
        toast.error("Failed to load delivery history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Calculate statistics
  const totalEarnings = history.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
  const totalDeliveries = history.length;
  const averageOrderValue = totalDeliveries > 0 ? (totalEarnings / totalDeliveries).toFixed(2) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
          <div className="flex items-center space-x-3">
            <Loader2 className="size-8 animate-spin text-blue-600" />
            <span className="text-xl font-medium text-gray-700">Loading delivery history...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-8">
          <div className="flex items-center mb-6">
            <Package className="size-8 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-800">Delivery History</h1>
          </div>
          
          {/* Statistics Cards */}
          {history.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-800">${totalEarnings.toFixed(2)}</p>
                  </div>
                  <DollarSign className="size-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Deliveries</p>
                    <p className="text-2xl font-bold text-blue-800">{totalDeliveries}</p>
                  </div>
                  <Package className="size-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Average Order Value</p>
                    <p className="text-2xl font-bold text-purple-800">${averageOrderValue}</p>
                  </div>
                  <TrendingUp className="size-8 text-purple-600" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delivery History Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Clock className="size-6 mr-3 text-gray-600" />
            Recent Deliveries
          </h2>

          {history.length > 0 ? (
            <div className="space-y-6">
              {history.map((order, index) => (
                <div key={order.order_id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-600 text-white rounded-full p-2">
                        <Package className="size-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">Order #{order.order_id}</h3>
                        <div className="flex items-center mt-1">
                          <CheckCircle className="size-4 text-green-600 mr-1" />
                          <span className="text-sm text-green-600 font-medium">Delivered Successfully</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Completed
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <DollarSign className="size-5 mr-2 text-green-600" />
                        <span className="font-medium">Total Amount:</span>
                        <span className="ml-2 text-lg font-bold text-green-600">${order.total_amount}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <Calendar className="size-5 mr-2 text-blue-600" />
                        <span className="font-medium">Delivered At:</span>
                        <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {new Date(order.delivered_at).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {order.customer_name && (
                        <div className="flex items-center text-gray-700">
                          <MapPin className="size-5 mr-2 text-red-600" />
                          <span className="font-medium">Customer:</span>
                          <span className="ml-2">{order.customer_name}</span>
                        </div>
                      )}
                      
                      {order.restaurant_name && (
                        <div className="flex items-center text-gray-700">
                          <Package className="size-5 mr-2 text-orange-600" />
                          <span className="font-medium">Restaurant:</span>
                          <span className="ml-2">{order.restaurant_name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order rank indicator */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Award className="size-4 mr-1" />
                      Delivery #{history.length - index}
                    </div>
                    {order.delivery_time && (
                      <div className="text-sm text-gray-500">
                        <Clock className="size-4 inline mr-1" />
                        Delivery time: {order.delivery_time}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="size-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Delivery History</h3>
              <p className="text-gray-500 text-lg">You haven't completed any deliveries yet.</p>
              <p className="text-gray-400 text-sm mt-2">Once you start delivering orders, they'll appear here.</p>
              <div className="mt-6">
                <button 
                  onClick={() => window.history.back()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Go Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Achievement Section */}
        {history.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl shadow-lg border border-yellow-200 p-8">
            <div className="flex items-center mb-4">
              <Award className="size-6 text-yellow-600 mr-3" />
              <h2 className="text-2xl font-bold text-yellow-800">Your Achievement</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Delivery Milestone</h3>
                <p className="text-gray-600">
                  {totalDeliveries < 10 ? 'Getting Started' : 
                   totalDeliveries < 50 ? 'Regular Rider' : 
                   totalDeliveries < 100 ? 'Experienced Rider' : 'Expert Rider'}
                </p>
                <div className="mt-3 bg-yellow-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((totalDeliveries / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Earnings</h3>
                <p className="text-2xl font-bold text-green-600">${totalEarnings.toFixed(2)}</p>
                <p className="text-sm text-gray-600 mt-1">Keep up the great work!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryHistoryPage;
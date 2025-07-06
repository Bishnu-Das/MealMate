import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";  
import { useRiderAuthStore } from "../store/riderAuthStore";
import Navbar from "../../Components/skeleton/Navbar";
import { Loader2, MapPin, Phone, Mail, User, Package, Clock, CheckCircle, Truck, History, Settings, LogOut } from "lucide-react";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

const HomepageRider = () => {
  const { authrider, logout } = useRiderAuthStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(authrider?.is_available || true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axiosInstance.get("/rider/data/dashboard");
        setDashboardData(res.data);
        setIsAvailable(res.data.isAvailable);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    if (authrider) {
      fetchDashboardData();
    }
  }, [authrider]);

  const handleAvailabilityToggle = async () => {
    try {
      const newAvailability = !isAvailable;
      await axiosInstance.put("/rider/data/availability", { is_available: newAvailability });
      setIsAvailable(newAvailability);
      toast.success(`Availability set to ${newAvailability ? "Available" : "Unavailable"}`);
    } catch (err) {
      console.error("Error updating availability:", err);
      toast.error("Failed to update availability.");
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/rider/data/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order ${orderId} status updated to ${newStatus}`);
      setLoading(true);
      const res = await axiosInstance.get("/rider/data/dashboard");
      setDashboardData(res.data);
      setIsAvailable(res.data.isAvailable);
      setLoading(false);
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error(err?.response?.data?.message || "Failed to update order status.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
          <div className="flex items-center space-x-3">
            <Loader2 className="size-8 animate-spin text-blue-600" />
            <span className="text-xl font-medium text-gray-700">Loading dashboard...</span>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Rider Dashboard</h1>
              <p className="text-xl text-gray-600 flex items-center">
                <User className="size-5 mr-2 text-blue-600" />
                Welcome back, {authrider?.name || "Rider"}!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                isAvailable 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                <div className={`w-2 h-2 rounded-full inline-block mr-2 ${
                  isAvailable ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                {isAvailable ? 'Available' : 'Unavailable'}
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Order Section */}
        {dashboardData?.assignedOrder ? (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl shadow-lg border border-amber-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <Package className="size-6 text-amber-600 mr-3" />
              <h2 className="text-2xl font-bold text-amber-800">Active Delivery</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-amber-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Package className="size-5 mr-2 text-blue-600" />
                    Order Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700"><span className="font-medium">Order ID:</span> #{dashboardData.assignedOrder.order_id}</p>
                    <p className="text-gray-700 flex items-center">
                      <Clock className="size-4 mr-2 text-gray-500" />
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                        dashboardData.assignedOrder.order_status === 'preparing' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {dashboardData.assignedOrder.order_status}
                      </span>
                    </p>
                    <p className="text-gray-700 text-lg font-semibold">
                      Total: <span className="text-green-600">${dashboardData.assignedOrder.total_amount}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-amber-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="size-5 mr-2 text-green-600" />
                    Restaurant Details
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700"><span className="font-medium">Name:</span> {dashboardData.assignedOrder.restaurant_name}</p>
                    <p className="text-gray-700 flex items-center">
                      <Phone className="size-4 mr-2 text-gray-500" />
                      {dashboardData.assignedOrder.restaurant_phone}
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <Mail className="size-4 mr-2 text-gray-500" />
                      {dashboardData.assignedOrder.restaurant_email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-amber-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin className="size-5 mr-2 text-red-600" />
                    Customer Details
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700"><span className="font-medium">Name:</span> {dashboardData.assignedOrder.customer_name}</p>
                    <p className="text-gray-700">
                      <span className="font-medium">Drop-off Address:</span><br />
                      <span className="text-sm bg-gray-100 p-2 rounded-lg block mt-1">
                        {dashboardData.assignedOrder.dropoff_addr}
                      </span>
                    </p>
                    {dashboardData.assignedOrder.dropoff_latitude && dashboardData.assignedOrder.dropoff_longitude && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${dashboardData.assignedOrder.dropoff_latitude},${dashboardData.assignedOrder.dropoff_longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <MapPin className="size-4 mr-2" />
                        View on Map
                      </a>
                    )}
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-amber-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {dashboardData.assignedOrder.order_status === 'preparing' && (
                      <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        onClick={() => handleUpdateOrderStatus(dashboardData.assignedOrder.order_id, 'out_for_delivery')}
                      >
                        <Truck className="size-5 mr-2" />
                        Mark as Picked Up
                      </button>
                    )}
                    {dashboardData.assignedOrder.order_status === 'out_for_delivery' && (
                      <button
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        onClick={() => handleUpdateOrderStatus(dashboardData.assignedOrder.order_id, 'delivered')}
                      >
                        <CheckCircle className="size-5 mr-2" />
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-200 p-8 mb-8">
            <div className="text-center">
              <Package className="size-16 text-blue-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-blue-800 mb-2">No Active Deliveries</h2>
              <p className="text-blue-600">You are currently not assigned to any delivery.</p>
            </div>
          </div>
        )}

        {/* Available Orders Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Package className="size-6 mr-3 text-green-600" />
            Available Orders
          </h2>
          
          {dashboardData?.availableOrders && dashboardData.availableOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.availableOrders.map((order) => (
                <div key={order.order_id} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Order #{order.order_id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'preparing' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mb-4">${order.total_amount}</p>
                  <div className="space-y-2">
                    <button
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                      onClick={async () => {
                        try {
                          await axiosInstance.put(`/rider/data/orders/${order.order_id}/accept`);
                          toast.success("Order accepted!");
                          setLoading(true);
                          const res = await axiosInstance.get("/rider/data/dashboard");
                          setDashboardData(res.data);
                          setIsAvailable(res.data.isAvailable);
                          setLoading(false);
                        } catch (err) {
                          console.error("Error accepting order:", err);
                          toast.error(err?.response?.data?.message || "Failed to accept order.");
                        }
                      }}
                    >
                      <CheckCircle className="size-5 mr-2" />
                      Accept Order
                    </button>
                    <Link
                      to={`/rider/data/orders/${order.order_id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <Package className="size-5 mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="size-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No available orders at the moment.</p>
              <p className="text-gray-400 text-sm mt-2">Check back later for new delivery opportunities.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/rider/history"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
          >
            <History className="size-5 mr-2" />
            View Delivery History
          </Link>
          <Link
            to="/rider/data/profile"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
          >
            <Settings className="size-5 mr-2" />
            View Profile
          </Link>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
          >
            <LogOut className="size-5 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomepageRider;
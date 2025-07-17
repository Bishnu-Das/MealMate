import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useRiderAuthStore } from "../store/riderAuthStore";
import Navbar from "../../Components/skeleton/Navbar";
import {
  Loader2,
  MapPin,
  Phone,
  Mail,
  User,
  Package,
  Clock,
  CheckCircle,
  Truck,
  History,
  Settings,
  LogOut,
  Bell,
  MessageCircle,
} from "lucide-react";
import ChatModal from "../../Components/ChatModal";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";
import socketService from "../../services/socketService";
import { useNotificationStore } from "../../store/notificationStore";

const HomepageRider = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  // Initialize isAvailable to true by default, it will be updated by fetched data
  const [isAvailable, setIsAvailable] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const { authrider, logout, checkAuthRider } = useRiderAuthStore();
  const {
    notifications: globalNotifications,
    addNotification,
    clearNotifications,
  } = useNotificationStore();

  useEffect(() => {
    checkAuthRider(); // Call checkAuthRider once on component mount
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axiosInstance.get("/rider/data/dashboard");
        setDashboardData(res.data);
        setIsAvailable(res.data.isAvailable); // Set availability based on fetched data
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    if (authrider) {
      fetchDashboardData();
      socketService.joinRoom("riders");

      const handleNewDelivery = (newOrder) => {
        toast.success(`New order #${newOrder.order_id} available!`);
        addNotification(newOrder);
        setDashboardData((prevData) => ({
          ...prevData,
          availableOrders: [newOrder, ...(prevData?.availableOrders || [])],
        }));
      };

      const handleOrderAccepted = ({ orderId, riderProfile }) => {
        console.log(`Order ${orderId} accepted by rider:`, riderProfile);
        // Remove the accepted order from available orders if it was accepted by another rider
        setDashboardData((prevData) => ({
          ...prevData,
          availableOrders: prevData.availableOrders.filter(
            (order) => order.order_id !== orderId
          ),
        }));
      };

      socketService.on("new_delivery", handleNewDelivery);
      socketService.on("order_accepted", handleOrderAccepted);

      return () => {
        socketService.off("new_delivery", handleNewDelivery);
        socketService.off("order_accepted", handleOrderAccepted);
      };
    }
  }, [authrider]); // Only re-run when authrider changes

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const handleAvailabilityToggle = async () => {
    try {
      const newAvailability = !isAvailable;
      await axiosInstance.put("/rider/data/availability", {
        is_available: newAvailability,
      });
      setIsAvailable(newAvailability);
      toast.success(
        `Availability set to ${newAvailability ? "Available" : "Unavailable"}`
      );
    } catch (err) {
      console.error("Error updating availability:", err);
      toast.error("Failed to update availability.");
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/rider/data/orders/${orderId}/status`, {
        status: newStatus,
      });
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error(
        err?.response?.data?.message || "Failed to update order status."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
          <div className="flex items-center space-x-3">
            <Loader2 className="size-8 animate-spin text-blue-600" />
            <span className="text-xl font-medium text-gray-700">
              Loading dashboard...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        currentAuthUser={authrider}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Rider Dashboard
              </h1>
              <p className="text-xl text-gray-600 flex items-center">
                <User className="size-5 mr-2 text-blue-600" />
                Welcome back, {authrider?.name || "Rider"}!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications((v) => !v)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <Bell className="size-5 mr-2" />
                  Notifications
                  {globalNotifications.length > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {globalNotifications.length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-10 max-h-96 overflow-y-auto">
                    {globalNotifications.length > 0 ? (
                      <div>
                        {globalNotifications.map((order) => (
                          <div
                            key={order.order_id}
                            className="p-4 border-b border-gray-200 last:border-b-0"
                          >
                            <p className="font-medium text-gray-900">
                              New Order #{order.order_id} from{" "}
                              {order.restaurant_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Total: ${order.total_amount}
                            </p>
                            <p className="text-sm text-gray-600">
                              Drop-off: {order.dropoff_addr}
                            </p>
                            <button>
                              className="mt-2 w-full bg-green-600
                              hover:bg-green-700 text-white font-semibold py-2
                              px-4 rounded-lg transition-colors duration-200
                              text-sm" onClick=
                              {async () => {
                                try {
                                  await axiosInstance.put(
                                    `/rider/data/orders/${order.order_id}/accept`
                                  );
                                  toast.success("Order accepted!");
                                  clearNotifications(); // Clear all notifications after accepting one
                                  // Optimistically remove the order from available orders and add to assigned
                                  setDashboardData((prevData) => ({
                                    ...prevData,
                                    availableOrders:
                                      prevData.availableOrders.filter(
                                        (ao) => ao.order_id !== order.order_id
                                      ),
                                    assignedOrder: order, // Assuming the accepted order becomes the assigned one
                                  }));
                                  setShowNotifications(false); // Close notifications after accepting
                                } catch (err) {
                                  console.error(
                                    "Error accepting order from notification:",
                                    err
                                  );
                                  toast.error(
                                    err?.response?.data?.message ||
                                      "Failed to accept order."
                                  );
                                }
                              }}
                              {/* > */}
                              Accept Order
                            </button>
                          </div>
                        ))}
                        <div className="p-4 border-t border-gray-200">
                          <button
                            className="w-full text-blue-600 hover:text-blue-800"
                            onClick={clearNotifications}
                          >
                            Clear All
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="p-4 text-gray-600">No new deliveries</p>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={handleAvailabilityToggle}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 flex items-center ${
                  isAvailable
                    ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
                    : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full inline-block mr-2 ${
                    isAvailable ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                {isAvailable ? "Available" : "Unavailable"}
              </button>
            </div>
          </div>
        </div>

        {/* Assigned Order Section */}
        {dashboardData?.assignedOrder ? (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl shadow-lg border border-amber-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <Package className="size-6 text-amber-600 mr-3" />
              <h2 className="text-2xl font-bold text-amber-800">
                Active Delivery
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-amber-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Package className="size-5 mr-2 text-blue-600" />
                    Order Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Order ID:</span> #
                      {dashboardData.assignedOrder.order_id}
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <Clock className="size-4 mr-2 text-gray-500" />
                      <span className="font-medium">Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                          dashboardData.assignedOrder.order_status ===
                          "preparing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {dashboardData.assignedOrder.order_status}
                      </span>
                    </p>
                    <p className="text-gray-700 text-lg font-semibold">
                      Total:{" "}
                      <span className="text-green-600">
                        ${dashboardData.assignedOrder.total_amount}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-amber-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="size-5 mr-2 text-green-600" />
                    Restaurant Details
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Name:</span>{" "}
                      {dashboardData.assignedOrder.restaurant_name}
                    </p>
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
                    <p className="text-gray-700">
                      <span className="font-medium">Name:</span>{" "}
                      {dashboardData.assignedOrder.customer_name}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Drop-off Address:</span>
                      <br />
                      <span className="text-sm bg-gray-100 p-2 rounded-lg block mt-1">
                        {dashboardData.assignedOrder.dropoff_addr}
                      </span>
                    </p>
                    {dashboardData.assignedOrder.dropoff_latitude &&
                      dashboardData.assignedOrder.dropoff_longitude && (
                        <a
                          href={`http://maps.google.com/?q=${dashboardData.assignedOrder.dropoff_latitude},${dashboardData.assignedOrder.dropoff_longitude}`}
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    {dashboardData.assignedOrder.order_status ===
                      "preparing" && (
                      <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        onClick={() =>
                          handleUpdateOrderStatus(
                            dashboardData.assignedOrder.order_id,
                            "out_for_delivery"
                          )
                        }
                      >
                        <Truck className="size-5 mr-2" />
                        Mark as Picked Up
                      </button>
                    )}
                    {dashboardData.assignedOrder.order_status ===
                      "out_for_delivery" && (
                      <button
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        onClick={() =>
                          handleUpdateOrderStatus(
                            dashboardData.assignedOrder.order_id,
                            "delivered"
                          )
                        }
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
              <h2 className="text-2xl font-bold text-blue-800 mb-2">
                No Active Deliveries
              </h2>
              <p className="text-blue-600">
                You are currently not assigned to any delivery.
              </p>
            </div>
          </div>
        )}

        {/* Available Orders Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Package className="size-6 mr-3 text-green-600" />
            Available Orders
          </h2>

          {dashboardData?.availableOrders &&
          dashboardData.availableOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.availableOrders.map((order) => (
                <div
                  key={order.order_id}
                  className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order #{order.order_id}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "preparing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mb-4">
                    ${order.total_amount}
                  </p>
                  <div className="space-y-2">
                    <button
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                      onClick={async () => {
                        try {
                          await axiosInstance.put(
                            `/rider/data/orders/${order.order_id}/accept`
                          );
                          clearNotifications(); // Clear all notifications after accepting one
                          setShowNotifications(false); // Close notifications after accepting
                        } catch (err) {
                          console.error(
                            "Error accepting order from notification:",
                            err
                          );
                          toast.error(
                            err?.response?.data?.message ||
                              "Failed to accept order."
                          );
                        }
                      }}
                    >
                      {/* > */}
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
              <p className="text-gray-500 text-lg">
                No available orders at the moment.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Check back later for new delivery opportunities.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setIsChatModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
          >
            <MessageCircle className="size-5 mr-2" />
            Chats
          </button>
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

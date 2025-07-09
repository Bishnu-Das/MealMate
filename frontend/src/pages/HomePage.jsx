import React, { useEffect, useState, useRef } from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import FeaturedRestaurants from "../components/FeaturedRestaurants";
import CTASection from "../components/CTASection";
import { useRestaurantStore } from "../store/useRestaurantStore";
import FeaturedCategories from "../Components/FeaturedCategory";
import Navbar from "../Components/skeleton/Navbar";
import socketService from "../services/socketService";
import { userAuthStore } from "../store/userAuthStore";
import { Bell } from "lucide-react";
import { useNotificationStore } from "../store/notificationStore";

const Home = () => {
  const { restaurants, categories, getrestaurants, loading, getcategories } =
    useRestaurantStore();
  const { authUser: user } = userAuthStore();
  const { notifications, addNotification, clearNotifications } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef();

  useEffect(() => {
    getrestaurants();
    getcategories();

    if (user && user.user_id) {
      socketService.connect("customer", user.user_id);

      socketService.on("order_accepted", ({ orderId, riderProfile }) => {
        console.log(`Order ${orderId} accepted by rider:`, riderProfile);
        addNotification({ orderId, riderProfile, type: 'order_accepted' });
      });
    }

    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      socketService.off("order_accepted");
      // No need to disconnect here, as socketService is shared
    };
  }, [user, showNotifications]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="relative">
        <button
          onClick={() => setShowNotifications((v) => !v)}
          className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg z-10"
        >
          <Bell className="h-6 w-6" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute top-16 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fade-in" ref={notificationRef}>
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            </div>
            {notifications.length > 0 ? (
              <div className="max-h-60 overflow-y-auto">
                {notifications.map((notif, index) => (
                  <div key={index} className="p-4 border-b border-gray-200 last:border-b-0">
                    {notif.type === 'order_accepted' && (
                      <p className="font-medium text-gray-900">
                        Order #{notif.orderId} accepted by {notif.riderProfile.name} ({notif.riderProfile.phone_number})
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-4 text-gray-600">No new notifications</p>
            )}
            <div className="p-4 border-t border-gray-200">
              <button className="w-full text-blue-600 hover:text-blue-800" onClick={clearNotifications}>
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
      <HeroSection />
      <FeaturesSection />

      {loading ? (
        <div className="text-center py-20 text-xl text-gray-500">
          Loading restaurants...
        </div>
      ) : (
        <FeaturedRestaurants restaurants={restaurants} />
      )}

      <FeaturedCategories categories={categories} />
      <CTASection />
    </div>
  );
};

export default Home;

import React from "react";
import SidebarRest from "../components/SidebarRest";
import HeaderRest from "../components/HeaderRest";
import DashboardRest from "../components/DashboardRest";
import MenuManagementRest from "../components/MenuManagementRest";
import OrderManagement from "../components/OrderManagementRest";
import RestaurantProfile from "../components/RestaurantProfile";
import AnalyticsRest from "../components/AnalyticsRest";
import LoginPage from "../components/LoginPageRest";
import { restaurantAuthStore } from "../store/restaurantAuthStore";

function HomepageRest() {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const { authRestaurant } = restaurantAuthStore();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardRest activeTab={activeTab} setActiveTab={setActiveTab} />
        );
      case "menu":
        return <MenuManagementRest />;
      case "orders":
        return <OrderManagement />;
      case "profile":
        return <RestaurantProfile />;
      case "analytics":
        return <AnalyticsRest />;
      default:
        return <DashboardRest />;
    }
  };

  if (!authRestaurant) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <SidebarRest activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <HeaderRest />
        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
}

export default HomepageRest;

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { restaurantAuthStore } from "../store/restaurantAuthStore";
import { useEffect } from "react";
import { useState } from "react";
import { axiosInstance } from "../../../lib/axios";

const getStatusColor = (status) => {
  switch (status) {
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "preparing":
      return "bg-orange-100 text-orange-800";
    case "ready":
      return "bg-green-100 text-green-800";
    case "delivered":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Icon mapping based on stat titles
const iconMap = {
  "Today's Revenue": DollarSign,
  "Orders Today": ShoppingBag,
  "Avg Order Value": TrendingUp,
  "Customer Rating": Star,
};

const DashboardRest = ({ setActiveTab, setCurrentView }) => {
  const { authRestaurant } = restaurantAuthStore();

  const [recentOrders, setRecentOrders] = useState([]);
  const [statsCards, setStastCards] = useState([]);

  const getStatCard = async () => {
    try {
      const respons = await axiosInstance.get("/restaurant/today_stat");

      return respons.data;
    } catch (err) {
      console.error("Error fetching today stat:", err.message);
      return [];
    }
  };

  useEffect(() => {
    const fetchStat = async () => {
      const stat = await getStatCard();
      setStastCards(stat);
    };
    fetchStat();
  }, []);

  const getRecentOrder = async () => {
    try {
      const response = await axiosInstance.get("/restaurant/recent_orders");
      const rawOrders = response.data;

      const formattedOrders = rawOrders.map((order) => ({
        id: order.id,
        customer: order.customer,
        items: order.items
          .map((item) => `${item.quantity}x ${item.name}`)
          .join(", "),
        amount: `$${order.total.toFixed(2)}`,
        status: order.status,
        time: "3 min ago", // Placeholder; replace with real time logic if available
      }));

      return formattedOrders;
    } catch (err) {
      console.error("Error fetching recent orders:", err.message);
      return [];
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getRecentOrder();
      setRecentOrders(orders);
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen text-gray-100">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className="bg-gray-800 hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {stat.title}
              </CardTitle>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                {(() => {
                  const Icon = iconMap[stat.title] || DollarSign;
                  return <Icon className="h-4 w-4 text-white" />;
                })()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="flex items-center space-x-1 mt-1">
                {stat.changeType === "increase" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-400" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-400" />
                )}
                <span
                  className={`text-sm ${
                    stat.changeType === "increase"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-400">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="bg-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent Orders</CardTitle>
              <CardDescription className="text-gray-400">
                Your latest customer orders
              </CardDescription>
            </div>
            <Button variant="outline" className="border-gray-600 text-gray-100">
              View All Orders
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                    <ShoppingBag className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-white">{order.id}</p>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300">{order.customer}</p>
                    <p className="text-sm text-gray-400">{order.items}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{order.amount}</p>
                  <p className="text-sm text-gray-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {order.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardHeader>
            <CardTitle className="text-white">Add New Menu Item</CardTitle>
            <CardDescription className="text-orange-100">
              Expand your menu with delicious offerings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              className="bg-white text-orange-600 hover:bg-gray-100"
              onClick={() => {
                setActiveTab("menu");
                setCurrentView && setCurrentView("add");
              }}
            >
              Add Item
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <CardHeader>
            <CardTitle className="text-white">
              Update Restaurant Hours
            </CardTitle>
            <CardDescription className="text-green-100">
              Keep customers informed about availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              className="bg-white text-green-600 hover:bg-gray-100"
              onClick={() => setActiveTab("profile")}
            >
              Update Hours
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <CardHeader>
            <CardTitle className="text-white">View Analytics</CardTitle>
            <CardDescription className="text-blue-100">
              Track your restaurant's performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => setActiveTab("analytics")}
            >
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardRest;

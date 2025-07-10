import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../lib/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Clock, MapPin, Phone, User } from "lucide-react";

function getStatusColor(status) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "preparing":
      return "bg-orange-100 text-orange-800";
    case "ready":
      return "bg-green-100 text-green-800";
    case "picked-up":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-gray-100 text-gray-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// 'pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'

function getNextStatus(currentStatus) {
  switch (currentStatus) {
    case "pending":
      return "preparing";
    case "preparing":
      return "out_for_delivary";
    case "out_for_delivery":
      return "delivered";
    default:
      return currentStatus;
  }
}

function getStatusLabel(status) {
  switch (status) {
    case "pending":
      return "Confirm Order";
    case "preparing":
      return "Mark Ready";
    case "out_for_delivery":
      return "Mark Delivered";
    default:
      return "Update Status";
  }
}

function OrderCard({ order, onUpdateStatus }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg text-gray-400">
                {order.id}
              </CardTitle>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {order.orderTime}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {order.estimatedTime}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-blue-400">
              ${order.total.toFixed(2)}
            </p>
            <p className="text-sm text-amber-200">{order.paymentMethod}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{order.customer}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-200">{order.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-200" />
              <span className="text-sm text-gray-200">{order.address}</span>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-500">Order Items:</h4>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {order.status !== "delivered" && order.status !== "cancelled" && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button
              onClick={() => onUpdateStatus(order.id)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {getStatusLabel(order.status)}
            </Button>

            {order.status === "pending" && (
              <Button
                onClick={() => onUpdateStatus(order.id, "cancelled")}
                className="bg-gradient-to-r from-gray-600 to-red-800 hover:from-gray-700 hover:to-red-900"
              >
                Cancel Order
              </Button>
            )}

            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Call Customer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OrderManagement() {
  const [orderList, setOrderList] = useState([]);

  const getOrders = async () => {
    try {
      const response = await axiosInstance.get("/restaurant/recent_orders");
      return response.data;
    } catch (err) {
      console.error("Error fetching recent orders:", err.message);
      return [];
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getOrders();
      setOrderList(orders);
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, forcedStatus = null) => {
    const updatedOrders = orderList.map((order) => {
      if (order.id === orderId) {
        const newStatus = forcedStatus || getNextStatus(order.status);
        return { ...order, status: newStatus };
      }
      return order;
    });

    const updatedOrder = updatedOrders.find((o) => o.id === orderId);
    const newStatus = updatedOrder.status;

    try {
      await axiosInstance.put("/restaurant/update_order_status", {
        order_id: orderId,
        new_status: newStatus,
      });

      setOrderList(updatedOrders);
    } catch (error) {
      console.error("Failed to update order status:", error.message);
      alert("Failed to update order status. Try again.");
    }
  };

  const filterOrdersByStatus = (status) => {
    if (status === "all") return orderList;
    return orderList.filter((order) => order.status === status);
  };

  // 'pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'
  const statuses = [
    "all",
    "pending",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen text-gray-100">
      <div>
        <h1 className="text-2xl font-bold text-white">Order Management</h1>
        <p className="text-gray-400">Track and manage incoming orders</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-8 bg-gray-800 border border-gray-700">
          {statuses.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600"
            >
              {tab === "all"
                ? "All Orders"
                : tab
                    .split("_")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
            </TabsTrigger>
          ))}
        </TabsList>

        {statuses.map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {filterOrdersByStatus(tab).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={updateOrderStatus}
              />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default OrderManagement;

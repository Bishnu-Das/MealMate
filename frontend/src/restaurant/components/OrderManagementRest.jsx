import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Clock, MapPin, Phone, User } from "lucide-react";
import socketService from "../../services/socketService";
import { restaurantAuthStore } from "../store/restaurantAuthStore";
import axios from "axios";
import { toast } from "../../hooks/use-toast";

function getStatusColor(status) {
  switch (status) {
    case "pending_restaurant_acceptance":
      return "bg-blue-100 text-blue-800";
    case "preparing":
      return "bg-orange-100 text-orange-800";
    case "ready_for_pickup":
      return "bg-green-100 text-green-800";
    case "out_for_delivery":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-gray-100 text-gray-800";
    case "restaurant_rejected":
      return "bg-red-100 text-red-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// 'pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'

function getNextStatus(currentStatus) {
  switch (currentStatus) {
    case "pending_restaurant_acceptance":
      return "preparing"; // Restaurant accepts
    case "preparing":
      return "ready_for_pickup"; // Food is ready
    case "ready_for_pickup":
      return currentStatus; // Restaurant cannot set to out_for_delivery
    default:
      return currentStatus;
  }
}

function getStatusLabel(status) {
  switch (status) {
    case "pending_restaurant_acceptance":
      return "Accept Order";
    case "preparing":
      return "Mark Ready for Pickup";
    case "ready_for_pickup":
      return "Mark Out for Delivery"; // This will be handled by rider
    default:
      return "Update Status";
  }
}

function OrderCard({ order, onUpdateStatus, onRejectOrder }) {
  const showActionButtons = ![
    "delivered",
    "restaurant_rejected",
    "cancelled",
    "out_for_delivery",
    "ready_for_pickup",
  ].includes(order.status);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lgt text-gray-300">
                Order #{order.order_id}
              </CardTitle>
              <Badge className={getStatusColor(order.status)}>
                {order.status ? order.status.replace(/_/g, " ") : "N/A"}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(order.created_at).toLocaleTimeString()}
              </div>
              {order.rider_name && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {order.rider_name} (Rider)
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-purple-500">
              ${parseFloat(order.total_amount).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              {order.payment_method || "N/A"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{order.customer_name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {order.customer_phone}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {order.dropoff_addr}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-100">Order Items:</h4>
            {order.items &&
              order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.menu_item_name}
                  </span>
                  <span>
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {showActionButtons && (
          <div className="flex space-x-2 pt-4 border-t">
            <Button
              onClick={() => {
                console.log(
                  `Order status before getNextStatus: ${order.status}`
                );
                const nextStatus = getNextStatus(order.status);
                console.log(`Next status calculated: ${nextStatus}`);
                onUpdateStatus(order.order_id, nextStatus);
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {getStatusLabel(order.status)}
            </Button>
            {order.status === "pending_restaurant_acceptance" && (
              <Button
                variant="outline"
                onClick={() => onRejectOrder(order.order_id)}
              >
                Reject Order
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
  const { authRestaurant: restaurant } = restaurantAuthStore();

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get("/api/restaurant/orders");
      console.log("Fetched orders data:", response.data);
      setOrderList(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrderList([]); // Ensure orderList is always an array on error
    }
  }, []);

  useEffect(() => {
    if (restaurant && restaurant.restaurant_id) {
      socketService.connect("restaurant", restaurant.restaurant_id);
      socketService.on("new_order", (newOrder) => {
        console.log("New order received:", newOrder);
        setOrderList((prevOrders) => [newOrder, ...prevOrders]);

        toast({
          title: "New Order Received!",
          description: `Order #${newOrder.order_id} from ${
            newOrder.customer_name
          } for ${parseFloat(newOrder.total_amount).toFixed(2)}`,
          action: {
            label: "Accept",
            onClick: () => updateOrderStatus(newOrder.order_id, "preparing"),
          },
          cancel: {
            label: "Reject",
            onClick: () => rejectOrder(newOrder.order_id),
          },
          duration: 1000000, // Keep toast visible until action is taken
        });
      });

      socketService.on("order_status_updated", (updatedOrder) => {
        console.log("Order status updated:", updatedOrder);
        setOrderList((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === updatedOrder.order_id ? updatedOrder : order
          )
        );
      });

      socketService.on("order_accepted", ({ orderId, riderProfile }) => {
        console.log(`Order ${orderId} accepted by rider:`, riderProfile);
        setOrderList((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId
              ? {
                  ...order,
                  rider_name: riderProfile.name,
                  rider_phone: riderProfile.phone_number,
                  status: "out_for_delivery",
                } // Update status to out_for_delivery
              : order
          )
        );
      });

      fetchOrders();
    }

    return () => {
      socketService.off("new_order");
      socketService.off("order_status_updated");
      socketService.off("order_accepted");
      socketService.disconnect();
    };
  }, [restaurant, fetchOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    console.log(
      `Attempting to update order ${orderId} to status: ${newStatus}`
    );
    console.log(`Frontend sending status: ${newStatus} for order ${orderId}`);
    console.log(`Value of newStatus before sending: ${newStatus}`);
    try {
      await axios.put(`/api/restaurant/orders/${orderId}/status`, {
        status: newStatus,
      });
      console.log(
        `Successfully sent update status request for order ${orderId}`
      );
      // The order list will be updated via socket.io event from the backend
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const rejectOrder = async (orderId) => {
    console.log(`Attempting to reject order ${orderId}`);
    try {
      await axios.put(`/api/restaurant/orders/${orderId}/status`, {
        status: "restaurant_rejected",
      });
      console.log(
        `Successfully sent reject order request for order ${orderId}`
      );
      // The order list will be updated via socket.io event from the backend
    } catch (error) {
      console.error("Error rejecting order:", error);
    }
  };

  const filterOrdersByStatus = (status) => {
    if (status === "all") return orderList;
    return orderList.filter((order) => order.status === status);
  };

  // 'pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'
  const statuses = [
    "all",
    "pending_restaurant_acceptance",
    "preparing",
    "ready_for_pickup",
    "out_for_delivery",
    "delivered",
    "restaurant_rejected",
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen text-gray-100">
      <div>
        <h1 className="text-2xl font-bold text-white">Order Management</h1>
        <p className="text-gray-400">Track and manage incoming orders</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-gray-800 border border-gray-700">
          {[
            "all",
            "pending_restaurant_acceptance",
            "preparing",
            "ready_for_pickup",
            "out_for_delivery",
            "delivered",
            "restaurant_rejected",
          ].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600"
            >
              {tab === "all"
                ? "All Orders"
                : tab.replace(/_/g, " ").charAt(0).toUpperCase() +
                  tab.replace(/_/g, " ").slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {[
          "all",
          "pending_restaurant_acceptance",
          "preparing",
          "ready_for_pickup",
          "out_for_delivery",
          "delivered",
          "restaurant_rejected",
        ].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {filterOrdersByStatus(tab).map((order) => (
              <OrderCard
                key={order.order_id}
                order={order}
                onUpdateStatus={updateOrderStatus}
                onRejectOrder={rejectOrder}
              />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default OrderManagement;

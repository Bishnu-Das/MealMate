import React, { useState } from "react";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Clock, MapPin, Phone, User } from "lucide-react";

const orders = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    phone: "+1 234 567 8900",
    address: "123 Main St, Apt 4B",
    items: [
      { name: "Margherita Pizza", quantity: 2, price: 14.99 },
      { name: "Coca Cola", quantity: 1, price: 2.99 },
    ],
    total: 32.97,
    status: "confirmed",
    orderTime: "2:45 PM",
    estimatedTime: "25 min",
    paymentMethod: "Credit Card",
  },
  {
    id: "#ORD-002",
    customer: "Sarah Wilson",
    phone: "+1 234 567 8901",
    address: "456 Oak Ave, Unit 12",
    items: [
      { name: "Chicken Burger", quantity: 1, price: 12.99 },
      { name: "Fries", quantity: 1, price: 4.99 },
    ],
    total: 17.98,
    status: "preparing",
    orderTime: "2:38 PM",
    estimatedTime: "20 min",
    paymentMethod: "PayPal",
  },
  {
    id: "#ORD-003",
    customer: "Mike Johnson",
    phone: "+1 234 567 8902",
    address: "789 Pine St, House",
    items: [{ name: "Pasta Carbonara", quantity: 3, price: 15.99 }],
    total: 47.97,
    status: "ready",
    orderTime: "2:20 PM",
    estimatedTime: "Ready",
    paymentMethod: "Cash",
  },
];

function getStatusColor(status) {
  switch (status) {
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
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getNextStatus(currentStatus) {
  switch (currentStatus) {
    case "confirmed":
      return "preparing";
    case "preparing":
      return "ready";
    case "ready":
      return "picked-up";
    case "picked-up":
      return "delivered";
    default:
      return currentStatus;
  }
}

function getStatusLabel(status) {
  switch (status) {
    case "confirmed":
      return "Start Preparing";
    case "preparing":
      return "Mark Ready";
    case "ready":
      return "Mark Picked Up";
    case "picked-up":
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
              <CardTitle className="text-lg">{order.id}</CardTitle>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
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
            <p className="text-xl font-bold text-gray-900">
              ${order.total.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">{order.paymentMethod}</p>
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
              <span className="text-sm text-gray-600">{order.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{order.address}</span>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Order Items:</h4>
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

        {order.status !== "delivered" && (
          <div className="flex space-x-2 pt-4 border-t">
            <Button
              onClick={onUpdateStatus}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {getStatusLabel(order.status)}
            </Button>
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
  const [orderList, setOrderList] = useState(orders);

  const updateOrderStatus = (orderId) => {
    setOrderList((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: getNextStatus(order.status) }
          : order
      )
    );
  };

  const filterOrdersByStatus = (status) => {
    if (status === "all") return orderList;
    return orderList.filter((order) => order.status === status);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen text-gray-100">
      <div>
        <h1 className="text-2xl font-bold text-white">Order Management</h1>
        <p className="text-gray-400">Track and manage incoming orders</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800 border border-gray-700">
          {["all", "confirmed", "preparing", "ready", "delivered"].map(
            (tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600"
              >
                {tab === "all"
                  ? "All Orders"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            )
          )}
        </TabsList>

        {["all", "confirmed", "preparing", "ready", "delivered"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {filterOrdersByStatus(tab).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={() => updateOrderStatus(order.id)}
              />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );

  // return (
  //   <div className="p-6 space-y-6">
  //     <div>
  //       <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
  //       <p className="text-gray-600">Track and manage incoming orders</p>
  //     </div>

  //     <Tabs defaultValue="all" className="w-full">
  //       <TabsList className="grid w-full grid-cols-5">
  //         <TabsTrigger value="all">All Orders</TabsTrigger>
  //         <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
  //         <TabsTrigger value="preparing">Preparing</TabsTrigger>
  //         <TabsTrigger value="ready">Ready</TabsTrigger>
  //         <TabsTrigger value="delivered">Completed</TabsTrigger>
  //       </TabsList>

  //       {["all", "confirmed", "preparing", "ready", "delivered"].map((tab) => (
  //         <TabsContent key={tab} value={tab} className="space-y-4">
  //           {filterOrdersByStatus(tab).map((order) => (
  //             <OrderCard
  //               key={order.id}
  //               order={order}
  //               onUpdateStatus={() => updateOrderStatus(order.id)}
  //             />
  //           ))}
  //         </TabsContent>
  //       ))}
  //     </Tabs>
  //   </div>
  // );
}

export default OrderManagement;

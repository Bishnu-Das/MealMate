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

const statsCards = [
  {
    title: "Today's Revenue",
    value: "$1,247",
    change: "+12.5%",
    changeType: "increase",
    icon: DollarSign,
    description: "vs yesterday",
  },
  {
    title: "Orders Today",
    value: "47",
    change: "+8.2%",
    changeType: "increase",
    icon: ShoppingBag,
    description: "vs yesterday",
  },
  {
    title: "Avg Order Value",
    value: "$26.50",
    change: "-2.1%",
    changeType: "decrease",
    icon: TrendingUp,
    description: "vs yesterday",
  },
  {
    title: "Customer Rating",
    value: "4.8",
    change: "+0.2",
    changeType: "increase",
    icon: Star,
    description: "this month",
  },
];

const recentOrders = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    items: "2x Margherita Pizza, 1x Coca Cola",
    amount: "$28.50",
    status: "preparing",
    time: "5 min ago",
  },
  {
    id: "#ORD-002",
    customer: "Sarah Wilson",
    items: "1x Chicken Burger, 1x Fries",
    amount: "$18.99",
    status: "ready",
    time: "12 min ago",
  },
  {
    id: "#ORD-003",
    customer: "Mike Johnson",
    items: "3x Pasta Carbonara",
    amount: "$45.00",
    status: "delivered",
    time: "25 min ago",
  },
  {
    id: "#ORD-004",
    customer: "Emma Davis",
    items: "2x Caesar Salad, 2x Lemonade",
    amount: "$32.00",
    status: "confirmed",
    time: "3 min ago",
  },
];

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

const DashboardRest = ({ setActiveTab, setCurrentView }) => {
  const { authRestaurant } = restaurantAuthStore();
  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen text-gray-100">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <stat.icon className="h-4 w-4 text-white" />
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

  // return (
  //   <div className="p-6 space-y-6">
  //     {/* Stats Grid */}
  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  //       {statsCards.map((stat, index) => (
  //         <Card
  //           key={index}
  //           className="hover:shadow-lg transition-shadow duration-200"
  //         >
  //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  //             <CardTitle className="text-sm font-medium text-gray-600">
  //               {stat.title}
  //             </CardTitle>
  //             <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
  //               <stat.icon className="h-4 w-4 text-white" />
  //             </div>
  //           </CardHeader>
  //           <CardContent>
  //             <div className="text-2xl font-bold text-gray-900">
  //               {stat.value}
  //             </div>
  //             <div className="flex items-center space-x-1 mt-1">
  //               {stat.changeType === "increase" ? (
  //                 <ArrowUpRight className="h-4 w-4 text-green-500" />
  //               ) : (
  //                 <ArrowDownRight className="h-4 w-4 text-red-500" />
  //               )}
  //               <span
  //                 className={`text-sm ${
  //                   stat.changeType === "increase"
  //                     ? "text-green-600"
  //                     : "text-red-600"
  //                 }`}
  //               >
  //                 {stat.change}
  //               </span>
  //               <span className="text-sm text-gray-500">
  //                 {stat.description}
  //               </span>
  //             </div>
  //           </CardContent>
  //         </Card>
  //       ))}
  //     </div>

  //     {/* Recent Orders */}
  //     <Card>
  //       <CardHeader>
  //         <div className="flex items-center justify-between">
  //           <div>
  //             <CardTitle>Recent Orders</CardTitle>
  //             <CardDescription>Your latest customer orders</CardDescription>
  //           </div>
  //           <Button variant="outline">View All Orders</Button>
  //         </div>
  //       </CardHeader>
  //       <CardContent>
  //         <div className="space-y-4">
  //           {recentOrders.map((order, index) => (
  //             <div
  //               key={index}
  //               className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
  //             >
  //               <div className="flex items-center space-x-4">
  //                 <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
  //                   <ShoppingBag className="h-4 w-4 text-white" />
  //                 </div>
  //                 <div>
  //                   <div className="flex items-center space-x-2">
  //                     <p className="font-medium text-gray-900">{order.id}</p>
  //                     <Badge className={getStatusColor(order.status)}>
  //                       {order.status}
  //                     </Badge>
  //                   </div>
  //                   <p className="text-sm text-gray-600">{order.customer}</p>
  //                   <p className="text-sm text-gray-500">{order.items}</p>
  //                 </div>
  //               </div>
  //               <div className="text-right">
  //                 <p className="font-semibold text-gray-900">{order.amount}</p>
  //                 <p className="text-sm text-gray-500 flex items-center">
  //                   <Clock className="h-3 w-3 mr-1" />
  //                   {order.time}
  //                 </p>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </CardContent>
  //     </Card>

  //     {/* Quick Actions */}
  //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //       <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
  //         <CardHeader>
  //           <CardTitle className="text-white">Add New Menu Item</CardTitle>
  //           <CardDescription className="text-orange-100">
  //             Expand your menu with delicious offerings
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <Button
  //             variant="secondary"
  //             className="bg-white text-orange-600 hover:bg-gray-100"
  //           >
  //             Add Item
  //           </Button>
  //         </CardContent>
  //       </Card>

  //       <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
  //         <CardHeader>
  //           <CardTitle className="text-white">
  //             Update Restaurant Hours
  //           </CardTitle>
  //           <CardDescription className="text-green-100">
  //             Keep customers informed about availability
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <Button
  //             variant="secondary"
  //             className="bg-white text-green-600 hover:bg-gray-100"
  //           >
  //             Update Hours
  //           </Button>
  //         </CardContent>
  //       </Card>

  //       <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
  //         <CardHeader>
  //           <CardTitle className="text-white">View Analytics</CardTitle>
  //           <CardDescription className="text-blue-100">
  //             Track your restaurant's performance
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <Button
  //             variant="secondary"
  //             className="bg-white text-blue-600 hover:bg-gray-100"
  //           >
  //             View Reports
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   </div>
  // );
};

export default DashboardRest;

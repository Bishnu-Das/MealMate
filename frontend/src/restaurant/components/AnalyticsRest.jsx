import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Star,
} from "lucide-react";

const dailyRevenueData = [
  { day: "Mon", revenue: 850, orders: 28 },
  { day: "Tue", revenue: 1200, orders: 35 },
  { day: "Wed", revenue: 980, orders: 31 },
  { day: "Thu", revenue: 1450, orders: 42 },
  { day: "Fri", revenue: 1800, orders: 58 },
  { day: "Sat", revenue: 2100, orders: 67 },
  { day: "Sun", revenue: 1650, orders: 48 },
];

const weeklyTrendsData = [
  { week: "Week 1", revenue: 8500, orders: 280 },
  { week: "Week 2", revenue: 9200, orders: 310 },
  { week: "Week 3", revenue: 8800, orders: 295 },
  { week: "Week 4", revenue: 10100, orders: 340 },
];

const categoryData = [
  { name: "Pizza", value: 35, color: "#FF6B6B" },
  { name: "Burgers", value: 25, color: "#4ECDC4" },
  { name: "Pasta", value: 20, color: "#45B7D1" },
  { name: "Salads", value: 12, color: "#96CEB4" },
  { name: "Drinks", value: 8, color: "#FFEAA7" },
];

const topItems = [
  { name: "Margherita Pizza", orders: 89, revenue: "$1,334.11" },
  { name: "Chicken Burger", orders: 76, revenue: "$987.24" },
  { name: "Pasta Carbonara", orders: 65, revenue: "$1,039.35" },
  { name: "Caesar Salad", orders: 54, revenue: "$593.46" },
  { name: "Pepperoni Pizza", orders: 48, revenue: "$719.52" },
];

const AnalyticsRest = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen text-gray-100">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics & Insights</h1>
        <p className="text-gray-400">
          Track your restaurant's performance and growth
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border border-gray-700 text-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Weekly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$10,030</div>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-400">+14.2%</span>
              <span className="text-sm text-gray-400">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border border-gray-700 text-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Orders
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">309</div>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-400">+8.1%</span>
              <span className="text-sm text-gray-400">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border border-gray-700 text-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              New Customers
            </CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">47</div>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingDown className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-400">-2.3%</span>
              <span className="text-sm text-gray-400">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border border-gray-700 text-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Avg Rating
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">4.8</div>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-400">+0.2</span>
              <span className="text-sm text-gray-400">vs last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs + Charts */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800 border border-gray-700">
          <TabsTrigger
            value="revenue"
            className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500"
          >
            Revenue Trends
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500"
          >
            Order Analytics
          </TabsTrigger>
          <TabsTrigger
            value="menu"
            className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500"
          >
            Menu Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Daily Revenue</CardTitle>
                <CardDescription className="text-gray-400">
                  Revenue trends for the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                    <XAxis dataKey="day" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        color: "#fff",
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#FF6B6B"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Weekly Growth</CardTitle>
                <CardDescription className="text-gray-400">
                  Revenue growth over the past month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                    <XAxis dataKey="week" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#FF6B6B"
                      strokeWidth={3}
                      dot={{ fill: "#FF6B6B", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Daily Orders</CardTitle>
                <CardDescription className="text-gray-400">
                  Number of orders per day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                    <XAxis dataKey="day" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        color: "#fff",
                      }}
                    />
                    <Bar
                      dataKey="orders"
                      fill="#4ECDC4"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Order Categories</CardTitle>
                <CardDescription className="text-gray-400">
                  Distribution of orders by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Top Performing Items</CardTitle>
              <CardDescription className="text-gray-400">
                Your best-selling menu items this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-gray-400">
                          {item.orders} orders
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{item.revenue}</p>
                      <p className="text-sm text-gray-400">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // return (
  //   <div className="p-6 space-y-6">
  //     {/* Header */}
  //     <div>
  //       <h1 className="text-2xl font-bold text-gray-900">
  //         Analytics & Insights
  //       </h1>
  //       <p className="text-gray-600">
  //         Track your restaurant's performance and growth
  //       </p>
  //     </div>

  //     {/* Key Metrics */}
  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  //       <Card>
  //         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  //           <CardTitle className="text-sm font-medium text-gray-600">
  //             Weekly Revenue
  //           </CardTitle>
  //           <DollarSign className="h-4 w-4 text-green-600" />
  //         </CardHeader>
  //         <CardContent>
  //           <div className="text-2xl font-bold text-gray-900">$10,030</div>
  //           <div className="flex items-center space-x-1 mt-1">
  //             <TrendingUp className="h-4 w-4 text-green-500" />
  //             <span className="text-sm text-green-600">+14.2%</span>
  //             <span className="text-sm text-gray-500">vs last week</span>
  //           </div>
  //         </CardContent>
  //       </Card>

  //       <Card>
  //         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  //           <CardTitle className="text-sm font-medium text-gray-600">
  //             Total Orders
  //           </CardTitle>
  //           <ShoppingBag className="h-4 w-4 text-blue-600" />
  //         </CardHeader>
  //         <CardContent>
  //           <div className="text-2xl font-bold text-gray-900">309</div>
  //           <div className="flex items-center space-x-1 mt-1">
  //             <TrendingUp className="h-4 w-4 text-green-500" />
  //             <span className="text-sm text-green-600">+8.1%</span>
  //             <span className="text-sm text-gray-500">vs last week</span>
  //           </div>
  //         </CardContent>
  //       </Card>

  //       <Card>
  //         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  //           <CardTitle className="text-sm font-medium text-gray-600">
  //             New Customers
  //           </CardTitle>
  //           <Users className="h-4 w-4 text-purple-600" />
  //         </CardHeader>
  //         <CardContent>
  //           <div className="text-2xl font-bold text-gray-900">47</div>
  //           <div className="flex items-center space-x-1 mt-1">
  //             <TrendingDown className="h-4 w-4 text-red-500" />
  //             <span className="text-sm text-red-600">-2.3%</span>
  //             <span className="text-sm text-gray-500">vs last week</span>
  //           </div>
  //         </CardContent>
  //       </Card>

  //       <Card>
  //         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  //           <CardTitle className="text-sm font-medium text-gray-600">
  //             Avg Rating
  //           </CardTitle>
  //           <Star className="h-4 w-4 text-yellow-600" />
  //         </CardHeader>
  //         <CardContent>
  //           <div className="text-2xl font-bold text-gray-900">4.8</div>
  //           <div className="flex items-center space-x-1 mt-1">
  //             <TrendingUp className="h-4 w-4 text-green-500" />
  //             <span className="text-sm text-green-600">+0.2</span>
  //             <span className="text-sm text-gray-500">vs last week</span>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </div>

  //     {/* Charts */}
  //     <Tabs defaultValue="revenue" className="w-full">
  //       <TabsList className="grid w-full grid-cols-3">
  //         <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
  //         <TabsTrigger value="orders">Order Analytics</TabsTrigger>
  //         <TabsTrigger value="menu">Menu Performance</TabsTrigger>
  //       </TabsList>

  //       <TabsContent value="revenue" className="space-y-6">
  //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //           <Card>
  //             <CardHeader>
  //               <CardTitle>Daily Revenue</CardTitle>
  //               <CardDescription>
  //                 Revenue trends for the past week
  //               </CardDescription>
  //             </CardHeader>
  //             <CardContent>
  //               <ResponsiveContainer width="100%" height={300}>
  //                 <BarChart data={dailyRevenueData}>
  //                   <CartesianGrid strokeDasharray="3 3" />
  //                   <XAxis dataKey="day" />
  //                   <YAxis />
  //                   <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
  //                   <Bar
  //                     dataKey="revenue"
  //                     fill="#FF6B6B"
  //                     radius={[4, 4, 0, 0]}
  //                   />
  //                 </BarChart>
  //               </ResponsiveContainer>
  //             </CardContent>
  //           </Card>

  //           <Card>
  //             <CardHeader>
  //               <CardTitle>Weekly Growth</CardTitle>
  //               <CardDescription>
  //                 Revenue growth over the past month
  //               </CardDescription>
  //             </CardHeader>
  //             <CardContent>
  //               <ResponsiveContainer width="100%" height={300}>
  //                 <LineChart data={weeklyTrendsData}>
  //                   <CartesianGrid strokeDasharray="3 3" />
  //                   <XAxis dataKey="week" />
  //                   <YAxis />
  //                   <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
  //                   <Line
  //                     type="monotone"
  //                     dataKey="revenue"
  //                     stroke="#FF6B6B"
  //                     strokeWidth={3}
  //                     dot={{ fill: "#FF6B6B", strokeWidth: 2, r: 6 }}
  //                   />
  //                 </LineChart>
  //               </ResponsiveContainer>
  //             </CardContent>
  //           </Card>
  //         </div>
  //       </TabsContent>

  //       <TabsContent value="orders" className="space-y-6">
  //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //           <Card>
  //             <CardHeader>
  //               <CardTitle>Daily Orders</CardTitle>
  //               <CardDescription>Number of orders per day</CardDescription>
  //             </CardHeader>
  //             <CardContent>
  //               <ResponsiveContainer width="100%" height={300}>
  //                 <BarChart data={dailyRevenueData}>
  //                   <CartesianGrid strokeDasharray="3 3" />
  //                   <XAxis dataKey="day" />
  //                   <YAxis />
  //                   <Tooltip />
  //                   <Bar
  //                     dataKey="orders"
  //                     fill="#4ECDC4"
  //                     radius={[4, 4, 0, 0]}
  //                   />
  //                 </BarChart>
  //               </ResponsiveContainer>
  //             </CardContent>
  //           </Card>

  //           <Card>
  //             <CardHeader>
  //               <CardTitle>Order Categories</CardTitle>
  //               <CardDescription>
  //                 Distribution of orders by category
  //               </CardDescription>
  //             </CardHeader>
  //             <CardContent>
  //               <ResponsiveContainer width="100%" height={300}>
  //                 <PieChart>
  //                   <Pie
  //                     data={categoryData}
  //                     cx="50%"
  //                     cy="50%"
  //                     outerRadius={100}
  //                     fill="#8884d8"
  //                     dataKey="value"
  //                     label={({ name, value }) => `${name} ${value}%`}
  //                   >
  //                     {categoryData.map((entry, index) => (
  //                       <Cell key={`cell-${index}`} fill={entry.color} />
  //                     ))}
  //                   </Pie>
  //                   <Tooltip />
  //                 </PieChart>
  //               </ResponsiveContainer>
  //             </CardContent>
  //           </Card>
  //         </div>
  //       </TabsContent>

  //       <TabsContent value="menu" className="space-y-6">
  //         <Card>
  //           <CardHeader>
  //             <CardTitle>Top Performing Items</CardTitle>
  //             <CardDescription>
  //               Your best-selling menu items this month
  //             </CardDescription>
  //           </CardHeader>
  //           <CardContent>
  //             <div className="space-y-4">
  //               {topItems.map((item, index) => (
  //                 <div
  //                   key={index}
  //                   className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
  //                 >
  //                   <div className="flex items-center space-x-4">
  //                     <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
  //                       {index + 1}
  //                     </div>
  //                     <div>
  //                       <p className="font-medium text-gray-900">{item.name}</p>
  //                       <p className="text-sm text-gray-500">
  //                         {item.orders} orders
  //                       </p>
  //                     </div>
  //                   </div>
  //                   <div className="text-right">
  //                     <p className="font-semibold text-gray-900">
  //                       {item.revenue}
  //                     </p>
  //                     <p className="text-sm text-gray-500">Revenue</p>
  //                   </div>
  //                 </div>
  //               ))}
  //             </div>
  //           </CardContent>
  //         </Card>
  //       </TabsContent>
  //     </Tabs>
  //   </div>
  // );
};

export default AnalyticsRest;

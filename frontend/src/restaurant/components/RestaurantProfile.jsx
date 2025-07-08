import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Clock, MapPin, Star, Camera, Upload } from "lucide-react";
import axios from "axios";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

// Example data from backend (replace with your actual fetch logic)
// const backendData = {
//   restaurant_name: "Mario's Kitchen",
//   cuisine_type: "Italian, Pizza",
//   description:
//     "Authentic Italian cuisine with fresh ingredients and traditional recipes passed down through generations.",
//   phone: "+1 (555) 123-4567",
//   email: "mario@marioskitchen.com",
//   address: "123 Italian Street, Food District, City 12345",
//   delivery_settings: {
//     delivery_fee: "$2.99",
//     min_order: "$15.00",
//     delivery_time: "30-45 min",
//     delivery_radius: "5",
//   },
//   operating_hours: [
//     { day_of_week: "monday", open_time: "10:00", close_time: "22:00" },
//     { day_of_week: "tuesday", open_time: "10:00", close_time: "22:00" },
//     { day_of_week: "wednesday", open_time: "10:00", close_time: "22:00" },
//     { day_of_week: "thursday", open_time: "10:00", close_time: "22:00" },
//     { day_of_week: "friday", open_time: "10:00", close_time: "22:00" },
//     { day_of_week: "saturday", open_time: "10:00", close_time: "22:00" },
//     // Sunday is closed
//   ],
// };

function RestaurantProfile() {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const dayAbbrToFull = {
    Mon: "monday",
    Tue: "tuesday",
    Wed: "wednesday",
    Thu: "thursday",
    Fri: "friday",
    Sat: "saturday",
    Sun: "sunday",
  };
  React.useEffect(() => {
    axiosInstance.get("/restaurant/get_restaurant_profile").then((res) => {
      const data = res.data;
      console.log(data);
      setRestaurantName(data.restaurant_name || "");
      setCuisineType(data.cuisine_type || "");
      setDescription(data.description || "");
      setPhone(data.phone || "");
      setEmail(data.email || "");
      setAddress(data.address || "");
      setDeliveryFee(data.delivery_settings?.delivery_fee || "");
      setMinOrder(data.delivery_settings?.min_order || "");
      setDeliveryTime(data.delivery_settings?.delivery_time || "");
      setDeliveryRadius(data.delivery_settings?.delivery_radius || "");
      // Map backend operating_hours to state for all days
      const backendHoursMap = {};
      (data.operating_hours || []).forEach((h) => {
        const fullDay =
          dayAbbrToFull[h.day_of_week] || h.day_of_week.toLowerCase();
        backendHoursMap[fullDay] = h;
      });
      //console.log(backendHoursMap);
      setOperatingHours(
        days.map((day) => {
          const key = day.toLowerCase();
          if (backendHoursMap[key]) {
            return {
              day,
              enabled: true,
              open: backendHoursMap[key].open_time,
              close: backendHoursMap[key].close_time,
            };
          } else {
            return {
              day,
              enabled: false,
              open: "09:00",
              close: "22:00",
            };
          }
        })
      );
    });
  }, []);
  // Initialize state with backend data
  const [restaurantName, setRestaurantName] = React.useState("");
  const [cuisineType, setCuisineType] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState(""); // Email is not editable
  const [address, setAddress] = React.useState("");

  const [deliveryFee, setDeliveryFee] = React.useState("");
  const [minOrder, setMinOrder] = React.useState("");
  const [deliveryTime, setDeliveryTime] = React.useState("");
  const [deliveryRadius, setDeliveryRadius] = React.useState("");

  // Map backend operating_hours to state for all days
  // const [operatingHours, setOperatingHours] = React.useState(() => {
  //   // Create a lookup for backend days
  //   const backendHoursMap = {};
  //   backendData.operating_hours.forEach((h) => {
  //     backendHoursMap[h.day_of_week] = h;
  //   });
  //   // Build state for all days
  //   return days.map((day) => {
  //     const key = day.toLowerCase();
  //     if (backendHoursMap[key]) {
  //       return {
  //         day,
  //         enabled: true,
  //         open: backendHoursMap[key].open_time,
  //         close: backendHoursMap[key].close_time,
  //       };
  //     } else {
  //       return {
  //         day,
  //         enabled: false,
  //         open: "10:00",
  //         close: "22:00",
  //       };
  //     }
  //   });
  // });
  const [operatingHours, setOperatingHours] = React.useState(
    days.map((day) => ({
      day,
      enabled: false,
      open: "10:00",
      close: "22:00",
    }))
  );

  const handleToggleDay = (idx) => {
    setOperatingHours((hours) =>
      hours.map((h, i) => (i === idx ? { ...h, enabled: !h.enabled } : h))
    );
  };

  const handleTimeChange = (idx, field, value) => {
    setOperatingHours((hours) =>
      hours.map((h, i) => (i === idx ? { ...h, [field]: value } : h))
    );
  };

  // Prepare data for backend
  const handleSave = async () => {
    const backendHours = operatingHours
      .filter((h) => h.enabled)
      .map((h) => ({
        day_of_week: h.day.toLowerCase(),
        open_time: h.open,
        close_time: h.close,
      }));

    const data = {
      restaurant_name: restaurantName,
      cuisine_type: cuisineType,
      description,
      phone,
      email,
      address,
      delivery_settings: {
        delivery_fee: deliveryFee,
        min_order: minOrder,
        delivery_time: deliveryTime,
        delivery_radius: deliveryRadius,
      },
      operating_hours: backendHours,
    };

    try {
      await axiosInstance.post("/restaurant/edit_profile", data);
      toast.success("Profile updated!", { duration: 3000 });
    } catch (err) {
      toast.success("Failed to update profile!", { duration: 3000 });
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-900 text-white min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-white">Restaurant Profile</h1>
        <p className="text-gray-400">
          Manage your restaurant information and settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
              <CardDescription className="text-gray-400">
                Update your restaurant's basic details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="restaurant-name">Restaurant Name</Label>
                  <Input
                    id="restaurant-name"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuisine-type">Cuisine Type</Label>
                  <Input
                    id="cuisine-type"
                    value={cuisineType}
                    onChange={(e) => setCuisineType(e.target.value)}
                    className="bg-gray-700 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-gray-700 text-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    disabled
                    className="bg-gray-700 text-white opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-gray-700 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Hours */}
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Operating Hours</CardTitle>
              <CardDescription className="text-gray-400">
                Set your restaurant's operating schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {operatingHours.map((h, idx) => (
                <div key={h.day} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={h.enabled}
                      onCheckedChange={() => handleToggleDay(idx)}
                    />
                    <Label className="w-20">{h.day}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="time"
                      value={h.open}
                      onChange={(e) =>
                        handleTimeChange(idx, "open", e.target.value)
                      }
                      className="w-32 bg-gray-700 text-white"
                      disabled={!h.enabled}
                    />
                    <span className="text-gray-300">to</span>
                    <Input
                      type="time"
                      value={h.close}
                      onChange={(e) =>
                        handleTimeChange(idx, "close", e.target.value)
                      }
                      className="w-32 bg-gray-700 text-white"
                      disabled={!h.enabled}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Delivery Settings */}
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Delivery Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure your delivery options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delivery-fee">Delivery Fee</Label>
                  <Input
                    id="delivery-fee"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(e.target.value)}
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-order">Minimum Order</Label>
                  <Input
                    id="min-order"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-time">Delivery Time</Label>
                  <Input
                    id="delivery-time"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="bg-gray-700 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-radius">Delivery Radius (km)</Label>
                <Input
                  id="delivery-radius"
                  value={deliveryRadius}
                  onChange={(e) => setDeliveryRadius(e.target.value)}
                  className="bg-gray-700 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Content */}
        <div className="space-y-6">
          {/* Restaurant Photo */}
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Restaurant Photo</CardTitle>
              <CardDescription className="text-gray-400">
                Upload your restaurant's main photo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop"
                  alt="Restaurant"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  size="sm"
                  className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white"
                >
                  <Camera className="h-4 w-4 mr-1" />
                  Change
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full border-gray-600 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload New Photo
              </Button>
            </CardContent>
          </Card>

          {/* Restaurant Stats */}
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Restaurant Stats</CardTitle>
              <CardDescription className="text-gray-400">
                Your current performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">Customer Rating</span>
                </div>
                <Badge className="bg-yellow-800 text-yellow-100">
                  4.8 / 5.0
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">Avg Delivery Time</span>
                </div>
                <Badge className="bg-blue-800 text-blue-100">32 min</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-green-400" />
                  <span className="text-sm">Partner Since</span>
                </div>
                <Badge className="bg-green-800 text-green-100">Jan 2023</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Account Status</CardTitle>
              <CardDescription className="text-gray-400">
                Your partnership status and verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Account Verified</span>
                <Badge className="bg-green-800 text-green-100">Verified</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Partnership Level</span>
                <Badge className="bg-purple-800 text-purple-100">Premium</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge className="bg-green-800 text-green-100">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export default RestaurantProfile;

// return (
//   <div className="p-6 space-y-6">
//     <div>
//       <h1 className="text-2xl font-bold text-gray-900">Restaurant Profile</h1>
//       <p className="text-gray-600">
//         Manage your restaurant information and settings
//       </p>
//     </div>

//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       <div className="lg:col-span-2 space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Basic Information</CardTitle>
//             <CardDescription>
//               Update your restaurant's basic details
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="restaurant-name">Restaurant Name</Label>
//                 <Input id="restaurant-name" defaultValue="Mario's Kitchen" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="cuisine-type">Cuisine Type</Label>
//                 <Input id="cuisine-type" defaultValue="Italian, Pizza" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 defaultValue="Authentic Italian cuisine with fresh ingredients and traditional recipes passed down through generations."
//                 rows={3}
//               />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="phone">Phone Number</Label>
//                 <Input id="phone" defaultValue="+1 (555) 123-4567" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input id="email" defaultValue="mario..marioskitchen.com" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="address">Address</Label>
//               <Input
//                 id="address"
//                 defaultValue="123 Italian Street, Food District, City 12345"
//               />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Operating Hours</CardTitle>
//             <CardDescription>
//               Set your restaurant's operating schedule
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {[
//               "Monday",
//               "Tuesday",
//               "Wednesday",
//               "Thursday",
//               "Friday",
//               "Saturday",
//               "Sunday",
//             ].map((day) => (
//               <div key={day} className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <Switch defaultChecked={day !== "Sunday"} />
//                   <Label className="w-20">{day}</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Input
//                     type="time"
//                     defaultValue={day === "Sunday" ? "" : "10:00"}
//                     className="w-24"
//                     disabled={day === "Sunday"}
//                   />
//                   <span>to</span>
//                   <Input
//                     type="time"
//                     defaultValue={day === "Sunday" ? "" : "22:00"}
//                     className="w-24"
//                     disabled={day === "Sunday"}
//                   />
//                 </div>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Delivery Settings</CardTitle>
//             <CardDescription>Configure your delivery options</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="delivery-fee">Delivery Fee</Label>
//                 <Input id="delivery-fee" defaultValue="$2.99" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="min-order">Minimum Order</Label>
//                 <Input id="min-order" defaultValue="$15.00" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="delivery-time">Delivery Time</Label>
//                 <Input id="delivery-time" defaultValue="30-45 min" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="delivery-radius">Delivery Radius (km)</Label>
//               <Input id="delivery-radius" defaultValue="5" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Restaurant Photo</CardTitle>
//             <CardDescription>
//               Upload your restaurant's main photo
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="relative">
//               <img
//                 src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop"
//                 alt="Restaurant"
//                 className="w-full h-48 object-cover rounded-lg"
//               />
//               <Button
//                 size="sm"
//                 className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70"
//               >
//                 <Camera className="h-4 w-4 mr-1" />
//                 Change
//               </Button>
//             </div>
//             <Button variant="outline" className="w-full">
//               <Upload className="h-4 w-4 mr-2" />
//               Upload New Photo
//             </Button>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Restaurant Stats</CardTitle>
//             <CardDescription>
//               Your current performance metrics
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <Star className="h-4 w-4 text-yellow-500" />
//                 <span className="text-sm">Customer Rating</span>
//               </div>
//               <Badge className="bg-yellow-100 text-yellow-800">
//                 4.8 / 5.0
//               </Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <Clock className="h-4 w-4 text-blue-500" />
//                 <span className="text-sm">Avg Delivery Time</span>
//               </div>
//               <Badge className="bg-blue-100 text-blue-800">32 min</Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <MapPin className="h-4 w-4 text-green-500" />
//                 <span className="text-sm">Partner Since</span>
//               </div>
//               <Badge className="bg-green-100 text-green-800">Jan 2023</Badge>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Account Status</CardTitle>
//             <CardDescription>
//               Your partnership status and verification
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div className="flex items-center justify-between">
//               <span className="text-sm">Account Verified</span>
//               <Badge className="bg-green-100 text-green-800">Verified</Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm">Partnership Level</span>
//               <Badge className="bg-purple-100 text-purple-800">Premium</Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm">Status</span>
//               <Badge className="bg-green-100 text-green-800">Active</Badge>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>

//     <div className="flex justify-end">
//       <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
//         Save Changes
//       </Button>
//     </div>
//   </div>
// );
//}

//export default RestaurantProfile;

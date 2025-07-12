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
      setCustomerRating(data.rating);

      setImagePreview(
        data.restaurant_image ||
          "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop"
      );
      setDescription(data.description);
      setCuisineType(data.cuisine_type);
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
  const [imageFile, setImageFile] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);
  const [customerRating, setCustomerRating] = React.useState(null);

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
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
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

    const formData = new FormData();
    formData.append("restaurant_name", restaurantName);
    formData.append("cuisine_type", cuisineType);
    formData.append("description", description);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("delivery_fee", deliveryFee);
    formData.append("min_order", minOrder);
    formData.append("delivery_time", deliveryTime);
    formData.append("delivery_radius", deliveryRadius);

    // convert operating hours to JSON string (or handle it on backend)
    formData.append("operating_hours", JSON.stringify(backendHours));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await axiosInstance.post("/restaurant/edit_profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("profile updated..");
      toast.success("Profile updated!", { duration: 3000 });
    } catch (err) {
      toast.error("Failed to update profile!", { duration: 3000 });
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
                  src={imagePreview}
                  alt="Restaurant"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-gray-700 text-white file:cursor-pointer"
              />
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
                  {customerRating} / 5.0
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

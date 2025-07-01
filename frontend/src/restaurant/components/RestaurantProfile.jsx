import React from "react";
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
import { Clock, MapPin, Phone, Mail, Star, Camera, Upload } from "lucide-react";

function RestaurantProfile() {
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
                    defaultValue="Mario's Kitchen"
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuisine-type">Cuisine Type</Label>
                  <Input
                    id="cuisine-type"
                    defaultValue="Italian, Pizza"
                    className="bg-gray-700 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  defaultValue="Authentic Italian cuisine with fresh ingredients and traditional recipes passed down through generations."
                  className="bg-gray-700 text-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    defaultValue="+1 (555) 123-4567"
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    defaultValue="mario..marioskitchen.com"
                    className="bg-gray-700 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  defaultValue="123 Italian Street, Food District, City 12345"
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
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <div key={day} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Switch defaultChecked={day !== "Sunday"} />
                    <Label className="w-20">{day}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="time"
                      defaultValue={day === "Sunday" ? "" : "10:00"}
                      className="w-24 bg-gray-700 text-white"
                      disabled={day === "Sunday"}
                    />
                    <span className="text-gray-300">to</span>
                    <Input
                      type="time"
                      defaultValue={day === "Sunday" ? "" : "22:00"}
                      className="w-24 bg-gray-700 text-white"
                      disabled={day === "Sunday"}
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
                    defaultValue="$2.99"
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-order">Minimum Order</Label>
                  <Input
                    id="min-order"
                    defaultValue="$15.00"
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-time">Delivery Time</Label>
                  <Input
                    id="delivery-time"
                    defaultValue="30-45 min"
                    className="bg-gray-700 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-radius">Delivery Radius (km)</Label>
                <Input
                  id="delivery-radius"
                  defaultValue="5"
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
        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
          Save Changes
        </Button>
      </div>
    </div>
  );

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
}

export default RestaurantProfile;

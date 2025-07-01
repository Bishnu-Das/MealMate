import { useState } from "react";
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
import { ArrowLeft, Upload, Save } from "lucide-react";
import { restaurantAuthStore } from "../store/restaurantAuthStore";

const categories = [
  "Pizza",
  "Burgers",
  "Pasta",
  "Salads",
  "Desserts",
  "Beverages",
];

export const AddMenuItemRest = ({ onBack, onSave }) => {
  const { add_menu_item } = restaurantAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Pizza",
    image: "",
    discount: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      is_available: true,
      disscount: formData.discount,
      image:
        formData.image ||
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop",
    };
    add_menu_item(newItem);
    onBack();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Menu</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add New Menu Item</h1>
          <p className="text-gray-400">
            Create a new item for your restaurant menu
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <Card className="bg-gray-900 border border-gray-700">
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription className="text-gray-400">
              Fill in the information for your new menu item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Item Image</Label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-400 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  <Input
                    id="image"
                    name="image"
                    type="text"
                    placeholder="Or paste image URL here"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="mt-4 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Item Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Margherita Pizza"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your menu item ingredients and preparation..."
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Price and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      $
                    </span>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="pl-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Discount */}
              <div className="space-y-2">
                <Label htmlFor="discount">Discount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    $
                  </span>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="pl-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Menu Item
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { Textarea } from "../components/ui/textarea";
// import { ArrowLeft, Upload, Save } from "lucide-react";
// import { restaurantAuthStore } from "../store/restaurantAuthStore";

// const categories = [
//   "Pizza",
//   "Burgers",
//   "Pasta",
//   "Salads",
//   "Desserts",
//   "Beverages",
// ];

// export const AddMenuItemRest = ({ onBack, onSave }) => {
//   const { add_menu_item } = restaurantAuthStore();
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "Pizza",
//     image: "",
//     discount: "",
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newItem = {
//       name: formData.name,
//       description: formData.description,
//       price: formData.price,
//       category: formData.category,
//       is_available: true,
//       disscount: formData.discount,
//       image:
//         formData.image ||
//         "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop",
//     };
//     add_menu_item(newItem);
//     //onSave(newItem);

//     onBack();
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center space-x-4">
//         <Button
//           variant="outline"
//           onClick={onBack}
//           className="flex items-center space-x-2"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           <span>Back to Menu</span>
//         </Button>
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Add New Menu Item
//           </h1>
//           <p className="text-gray-600">
//             Create a new item for your restaurant menu
//           </p>
//         </div>
//       </div>

//       {/* Form */}
//       <div className="max-w-2xl">
//         <Card>
//           <CardHeader>
//             <CardTitle>Item Details</CardTitle>
//             <CardDescription>
//               Fill in the information for your new menu item
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Image Upload */}
//               <div className="space-y-2">
//                 <Label htmlFor="image">Item Image</Label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
//                   <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
//                   <p className="text-sm text-gray-600 mb-2">
//                     Click to upload or drag and drop
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     PNG, JPG, GIF up to 10MB
//                   </p>
//                   <Input
//                     id="image"
//                     name="image"
//                     type="text"
//                     placeholder="Or paste image URL here"
//                     value={formData.image}
//                     onChange={handleInputChange}
//                     className="mt-4"
//                   />
//                 </div>
//               </div>

//               {/* Item Name */}
//               <div className="space-y-2">
//                 <Label htmlFor="name">Item Name *</Label>
//                 <Input
//                   id="name"
//                   name="name"
//                   type="text"
//                   placeholder="e.g., Margherita Pizza"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               {/* Description */}
//               <div className="space-y-2">
//                 <Label htmlFor="description">Description *</Label>
//                 <Textarea
//                   id="description"
//                   name="description"
//                   placeholder="Describe your menu item ingredients and preparation..."
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   required
//                   rows={3}
//                 />
//               </div>

//               {/* Price and Category */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="price">Price *</Label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                       $
//                     </span>
//                     <Input
//                       id="price"
//                       name="price"
//                       type="number"
//                       step="0.01"
//                       placeholder="0.00"
//                       value={formData.price}
//                       onChange={handleInputChange}
//                       className="pl-8"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="category">Category *</Label>
//                   <select
//                     id="category"
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
//                     required
//                   >
//                     {categories.map((category) => (
//                       <option key={category} value={category}>
//                         {category}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/*discount*/}
//               <div className="space-y-2">
//                 <Label htmlFor="price">Discount</Label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                     $
//                   </span>
//                   <Input
//                     id="discount"
//                     name="discount"
//                     type="number"
//                     step="0.01"
//                     placeholder="0.00"
//                     value={formData.discount}
//                     onChange={handleInputChange}
//                     className="pl-8"
//                   />
//                 </div>
//               </div>

//               {/* Submit Buttons */}
//               <div className="flex space-x-4 pt-4">
//                 <Button
//                   type="submit"
//                   className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 flex-1"
//                   onClick={handleSubmit}
//                 >
//                   <Save className="h-4 w-4 mr-2" />
//                   Save Menu Item
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={onBack}
//                   className="flex-1"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

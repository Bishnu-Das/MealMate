import { useState, useEffect } from "react";
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
import { ArrowLeft, Upload, Save, Eye, EyeOff } from "lucide-react";
import { restaurantAuthStore } from "../store/restaurantAuthStore";

const categories = [
  "Pizza",
  "Burgers",
  "Pasta",
  "Salads",
  "Desserts",
  "Beverages",
];

const EditMenuItemRest = ({ item, onBack, onSave }) => {
  const { edit_menu_item } = restaurantAuthStore();

  const [formData, setFormData] = useState({
    menu_item_id: item.menu_item_id,
    name: "",
    description: "",
    price: "",
    category: "Pizza",
    menu_item_image_url: "",
    is_available: true,
    discount: "",
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (item) {
      setFormData({
        menu_item_id: item.menu_item_id,
        name: item.name || "",
        description: item.description || "",
        price: item.price || "",
        category: item.category || "Pizza",
        menu_item_image_url: item.menu_item_image_url || "",
        is_available: item.is_available,
        discount: item.discount || "",
      });
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("menu_item_id", formData.menu_item_id);
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("price", formData.price);
    payload.append("category", formData.category);
    payload.append("is_available", formData.is_available ? "true" : "false");
    payload.append("discount", formData.discount);

    if (imageFile) {
      payload.append("image", imageFile);
    } else {
      payload.append("menu_item_image_url", formData.menu_item_image_url);
    }

    const success = await edit_menu_item(payload, item.menu_item_id);
    if (success) onBack();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      is_available: !prev.is_available,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  if (!item) return <div className="text-white">Item not found</div>;

  return (
    <div className="p-6 space-y-6 text-white bg-gray-900 min-h-screen">
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
          <h1 className="text-2xl font-bold">Edit Menu Item</h1>
          <p className="text-gray-400">Update your menu item details</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card className="bg-gray-900 border border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-200">Item Details</CardTitle>
            <CardDescription className="text-gray-200">
              Fill in the updated information for your menu item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {formData.menu_item_image_url && !imageFile && (
                <div className="space-y-2">
                  <Label>Current Image</Label>
                  <img
                    src={formData.menu_item_image_url}
                    alt={formData.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="image">Upload New Image</Label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-400 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-4 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>

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
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="pl-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge
                  className={
                    formData.is_available ? "bg-green-500" : "bg-gray-600"
                  }
                >
                  {formData.is_available ? "active" : "inactive"}
                </Badge>
                <Button variant="outline" onClick={toggleStatus}>
                  {formData.is_available ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="ml-2">
                    {formData.is_available ? "Set Inactive" : "Set Active"}
                  </span>
                </Button>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
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

export default EditMenuItemRest;

// import { useState, useEffect } from "react";
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
// import { Badge } from "../components/ui/badge";
// import { ArrowLeft, Upload, Save, Eye, EyeOff } from "lucide-react";

// const categories = [
//   "Pizza",
//   "Burgers",
//   "Pasta",
//   "Salads",
//   "Desserts",
//   "Beverages",
// ];

// const EditMenuItemRest = ({ item, onBack, onSave }) => {
//   const [formData, setFormData] = useState({
//     menu_item_id: item.menu_item_id,
//     name: "",
//     description: "",
//     price: "",
//     category: "Pizza",
//     menu_item_image_url: "",
//     is_available: true,
//     discount: "",
//   });

//   useEffect(() => {
//     if (item) {
//       setFormData({
//         name: item.name || "",
//         description: item.description || "",
//         price: item.price ? item.price.replace("$", "") : "",
//         category: item.category || "Pizza",
//         menu_item_image_url: item.image || "",
//         is_available: item.is_available || true,
//         discount: item.discount ? item.price.replace("$", "") : "",
//       });
//     }
//   }, [item]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const updatedItem = {
//       ...item,
//       name: formData.name,
//       description: formData.description,
//       price: formData.price,
//       category: formData.category,
//       menu_item_image_url: formData.menu_item_image_url,
//       is_available: formData.is_available || formData.is_available === "active",
//       discount: formData.discount,
//     };
//     onSave(updatedItem);
//     onBack();
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const toggleStatus = () => {
//     setFormData((prev) => ({
//       ...prev,
//       is_available: prev.is_available === true ? false : true,
//     }));
//   };

//   if (!item) {
//     return <div className="text-white">Item not found</div>;
//   }

//   return (
//     <div className="p-6 space-y-6 text-white">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <Button
//             variant="outline"
//             onClick={onBack}
//             className="flex items-center space-x-2"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             <span>Back to Menu</span>
//           </Button>
//           <div>
//             <h1 className="text-2xl font-bold">Edit Menu Item</h1>
//             <p className="text-gray-400">Update your menu item details</p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Badge
//             className={
//               formData.is_available === true ? "bg-green-500" : "bg-gray-600"
//             }
//           >
//             {formData.is_available === true ? "active" : "incactive"}
//           </Badge>
//           <Button
//             variant="outline"
//             onClick={toggleStatus}
//             className="flex items-center space-x-2"
//           >
//             {formData.is_available === true ? (
//               <EyeOff className="h-4 w-4" />
//             ) : (
//               <Eye className="h-4 w-4" />
//             )}
//             <span>{formData.is_available === true ? false : true}</span>
//           </Button>
//         </div>
//       </div>

//       {/* Form */}
//       <div className="max-w-2xl">
//         <Card className="bg-gray-900 border border-gray-700">
//           <CardHeader>
//             <CardTitle>Item Details</CardTitle>
//             <CardDescription className="text-gray-400">
//               Update the information for this menu item
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {formData.menu_item_image_url && (
//                 <div className="space-y-2">
//                   <Label>Current Image</Label>
//                   <div className="w-full h-48 rounded-lg overflow-hidden">
//                     <img
//                       src={formData.menu_item_image_url}
//                       alt={formData.name}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-2">
//                 <Label htmlFor="image">Update Image</Label>
//                 <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
//                   <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
//                   <p className="text-sm text-gray-400 mb-2">
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
//                     value={formData.menu_item_image_url}
//                     onChange={handleInputChange}
//                     className="mt-4 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
//                   />
//                 </div>
//               </div>

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
//                   className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="description">Description *</Label>
//                 <Textarea
//                   id="description"
//                   name="description"
//                   placeholder="Describe your menu item..."
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   required
//                   rows={3}
//                   className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="price">Price *</Label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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
//                       className="pl-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
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
//                     required
//                     className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   >
//                     {categories.map((category) => (
//                       <option key={category} value={category}>
//                         {category}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="price">Discount</Label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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
//                     className="pl-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="flex space-x-4 pt-4">
//                 <Button
//                   type="submit"
//                   className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 flex-1"
//                 >
//                   <Save className="h-4 w-4 mr-2" />
//                   Save Changes
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

// export default EditMenuItemRest;

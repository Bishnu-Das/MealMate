import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { AddMenuItemRest } from "./AddMenuItemRest";
import EditMenuItemRest from "./EditMenuItemRest";
import { restaurantAuthStore } from "../store/restaurantAuthStore";
import toast from "react-hot-toast";

const initialMenuItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Fresh tomatoes, mozzarella cheese, basil",
    price: "$14.99",
    category: "Pizza",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Chicken Burger",
    description: "Grilled chicken breast, lettuce, tomato, mayo",
    price: "$12.99",
    category: "Burgers",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Pasta Carbonara",
    description: "Creamy pasta with bacon and parmesan",
    price: "$15.99",
    category: "Pasta",
    status: "inactive",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop",
  },
  {
    id: 4,
    name: "Caesar Salad",
    description: "Romaine lettuce, croutons, caesar dressing",
    price: "$10.99",
    category: "Salads",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop",
  },
];

const categories = ["All", "Pizza", "Burgers", "Pasta", "Salads"];

function MenuManagementRest() {
  const { initialMenuItems2, get_menus, delete_menu_item, edit_menu_item } =
    restaurantAuthStore();
  const [menuItems, setMenuItems] = useState(initialMenuItems2);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("list");
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        //await get_menus();
        //setMenuItems(items);
        const items = await get_menus();
        setMenuItems(items);
      } catch (err) {
        // Optionally handle error
        setMenuItems([]);
      }
    };
    fetchMenus();
  }, [get_menus]);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddItem = (newItem) => {
    setMenuItems((prev) => [...prev, newItem]);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setCurrentView("edit");
  };

  const handleSaveEdit = async (updatedItem) => {
    const items = await edit_menu_item(updatedItem, editingItem.menu_item_id);
    if (items != false) {
      setMenuItems((prev) =>
        prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
      setMenuItems(items);
    }
  };

  const handleDeleteItem = async (itemId) => {
    // console.log("the mneu item id is: ", itemId);
    const items = await delete_menu_item(itemId);
    if (items !== false) {
      setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
      setMenuItems(items);
    } else {
    }
  };

  const handleToggleStatus = (itemId) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: item.status === "active" ? "inactive" : "active",
            }
          : item
      )
    );
  };

  if (currentView === "add") {
    return (
      <AddMenuItemRest
        onBack={() => setCurrentView("list")}
        onSave={handleAddItem}
      />
    );
  }

  if (currentView === "edit" && editingItem) {
    return (
      <EditMenuItemRest
        item={editingItem}
        onBack={() => {
          setCurrentView("list");
          setEditingItem(null);
        }}
        onSave={handleSaveEdit}
      />
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen text-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Menu Management</h1>
          <p className="text-gray-400">Manage your restaurant's menu items</p>
        </div>
        <Button
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          onClick={() => setCurrentView("add")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="flex space-x-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category)}
                  className={`${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      : "bg-gray-700 text-gray-300 border-gray-600"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="hover:shadow-lg transition-shadow duration-200 bg-gray-800 border-gray-700"
          >
            {console.log(item.name)}
            <div className="relative">
              <img
                src={item.menu_category_image_url}
                alt={item.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-3 right-3">
                <Badge
                  className={
                    item.is_available === true
                      ? "bg-green-500 text-white"
                      : "bg-gray-600 text-white"
                  }
                >
                  {item.is_available ? "available" : "not avaialbe"}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start text-white">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription className="mt-1 text-gray-400">
                    {item.description}
                  </CardDescription>
                </div>
                <span className="text-lg font-bold text-orange-400">
                  {item.price}
                </span>
              </div>
              <Badge
                variant="outline"
                className="w-fit bg-gray-700 border-gray-500 text-white"
              >
                {item.category_name}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-gray-600 text-gray-300"
                  onClick={() => handleEditItem(item)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300"
                  onClick={() => handleToggleStatus(item.menu_item_id)}
                >
                  {item.status === "active" ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-red-500 hover:text-red-600"
                  onClick={() => handleDeleteItem(item.menu_item_id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {menuItems.length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Active Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {menuItems.filter((item) => item.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {categories.length - 1}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Avg Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">$13.49</div>
          </CardContent>
        </Card>
      </div>
    </div>

    // <div className="p-6 space-y-6">
    //   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
    //     <div>
    //       <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
    //       <p className="text-gray-600">Manage your restaurant's menu items</p>
    //     </div>
    //     <Button
    //       className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
    //       onClick={() => setCurrentView("add")}
    //     >
    //       <Plus className="h-4 w-4 mr-2" />
    //       Add New Item
    //     </Button>
    //   </div>

    //   <Card>
    //     <CardContent className="pt-6">
    //       <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
    //         <div className="relative flex-1">
    //           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
    //           <Input
    //             placeholder="Search menu items..."
    //             value={searchTerm}
    //             onChange={(e) => setSearchTerm(e.target.value)}
    //             className="pl-10"
    //           />
    //         </div>
    //         <div className="flex space-x-2">
    //           {categories.map((category) => (
    //             <Button
    //               key={category}
    //               variant={
    //                 selectedCategory === category ? "default" : "outline"
    //               }
    //               onClick={() => setSelectedCategory(category)}
    //               className={
    //                 selectedCategory === category
    //                   ? "bg-gradient-to-r from-orange-500 to-red-500"
    //                   : ""
    //               }
    //             >
    //               {category}
    //             </Button>
    //           ))}
    //         </div>
    //       </div>
    //     </CardContent>
    //   </Card>

    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //     {filteredItems.map((item) => (
    //       <Card
    //         key={item.id}
    //         className="hover:shadow-lg transition-shadow duration-200"
    //       >
    //         <div className="relative">
    //           <img
    //             src={item.image}
    //             alt={item.name}
    //             className="w-full h-48 object-cover rounded-t-lg"
    //           />
    //           <div className="absolute top-3 right-3">
    //             <Badge
    //               className={
    //                 item.status === "active" ? "bg-green-500" : "bg-gray-500"
    //               }
    //             >
    //               {item.status}
    //             </Badge>
    //           </div>
    //         </div>
    //         <CardHeader>
    //           <div className="flex justify-between items-start">
    //             <div>
    //               <CardTitle className="text-lg">{item.name}</CardTitle>
    //               <CardDescription className="mt-1">
    //                 {item.description}
    //               </CardDescription>
    //             </div>
    //             <span className="text-lg font-bold text-orange-600">
    //               {item.price}
    //             </span>
    //           </div>
    //           <Badge variant="outline" className="w-fit">
    //             {item.category}
    //           </Badge>
    //         </CardHeader>
    //         <CardContent>
    //           <div className="flex space-x-2">
    //             <Button
    //               variant="outline"
    //               size="sm"
    //               className="flex-1"
    //               onClick={() => handleEditItem(item)}
    //             >
    //               <Edit className="h-4 w-4 mr-1" />
    //               Edit
    //             </Button>
    //             <Button
    //               variant="outline"
    //               size="sm"
    //               onClick={() => handleToggleStatus(item.id)}
    //             >
    //               {item.status === "active" ? (
    //                 <EyeOff className="h-4 w-4" />
    //               ) : (
    //                 <Eye className="h-4 w-4" />
    //               )}
    //             </Button>
    //             <Button
    //               variant="outline"
    //               size="sm"
    //               className="text-red-600 hover:text-red-700"
    //               onClick={() => handleDeleteItem(item.id)}
    //             >
    //               <Trash2 className="h-4 w-4" />
    //             </Button>
    //           </div>
    //         </CardContent>
    //       </Card>
    //     ))}
    //   </div>

    //   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    //     <Card>
    //       <CardHeader className="pb-2">
    //         <CardTitle className="text-sm font-medium text-gray-600">
    //           Total Items
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-2xl font-bold text-gray-900">
    //           {menuItems.length}
    //         </div>
    //       </CardContent>
    //     </Card>
    //     <Card>
    //       <CardHeader className="pb-2">
    //         <CardTitle className="text-sm font-medium text-gray-600">
    //           Active Items
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-2xl font-bold text-green-600">
    //           {menuItems.filter((item) => item.status === "active").length}
    //         </div>
    //       </CardContent>
    //     </Card>
    //     <Card>
    //       <CardHeader className="pb-2">
    //         <CardTitle className="text-sm font-medium text-gray-600">
    //           Categories
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-2xl font-bold text-blue-600">
    //           {categories.length - 1}
    //         </div>
    //       </CardContent>
    //     </Card>
    //     <Card>
    //       <CardHeader className="pb-2">
    //         <CardTitle className="text-sm font-medium text-gray-600">
    //           Avg Price
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-2xl font-bold text-orange-600">$13.49</div>
    //       </CardContent>
    //     </Card>
    //   </div>
    // </div>
  );
}

export default MenuManagementRest;

import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";

import { Input } from "../restaurant/components/ui/input";
import { RestaurantHeader } from "../Components/restprof/RestaurantHeader";
import { FoodItem } from "../Components/restprof/FoodItem";
import { CartSidebar } from "../Components/restprof/CartSidebar";
import { MenuCategories } from "../Components/restprof/MenuCategories";
import { axiosInstance } from "../../lib/axios";
import { useCartStore } from "../store/cartStore";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/skeleton/Navbar";

export default function Restaurant() {
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [searchQuery, setSearchQuery] = useState("");
  const { cartItems, addToCart, updateQuantity, removeFromCart, setCartItems: setCartItemsFromStore } = useCartStore();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [menuItems, setmenuItems] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [restaurant, setRestaurant] = useState();

  const { id } = useParams();
  console.log("rest id: ", id);

  const fetchCart = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/customer/cart");
      setCartItemsFromStore(res.data.cart.sort((a, b) => a.cart_item_id - b.cart_item_id));
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  }, [setCartItemsFromStore]);

  useEffect(() => {
    axiosInstance
      .get(`/customer/getRestaurant/${id}`)
      .then((res) => {
        setRestaurant(res.data.restaruntDetails);
        setmenuItems(res.data.menuItems);
        // Extract unique categories from menuItems
        const uniqueCategories = [
          ...new Set(res.data.menuItems.map((item) => item.category_name)),
        ].map((category_name) => {
          const item = res.data.menuItems.find(
            (item) => item.category_name === category_name
          );
          return {
            category_id: item.category_id,
            name: category_name,
            menu_category_image_url: item.menu_category_image_url,
          };
        });
        setMenuCategories(uniqueCategories);
        console.log("Restaurant data: ", res.data);
      })
      .catch((err) => {
        console.error("Error fetching restaurant details:", err);
      });

    fetchCart();
  }, [id, fetchCart]);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "Popular" ? true : item.category_name === activeCategory;
    const matchesSearch =
      item.menu_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = async (item) => {
    try {
      const res = await axiosInstance.post("/customer/add_cart", {
        menu_item_id: item.menu_item_id,
        restaurant_id: restaurant.restaurant_id,
        quantity: 1,
      });
      addToCart({ ...item, quantity: 1, cart_item_id: res.data.item.cart_item_id, restaurant_name: restaurant.name, restaurant_id: restaurant.restaurant_id });
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleUpdateQuantity = async (menu_item_id, quantity) => {
    try {
      if (quantity === 0) {
        await axiosInstance.delete(`/customer/cart/${menu_item_id}`);
        removeFromCart(menu_item_id);
      } else {
        await axiosInstance.post("/customer/add_cart", {
          menu_item_id: menu_item_id,
          restaurant_id: restaurant.restaurant_id,
          quantity: quantity,
        });
        updateQuantity(menu_item_id, quantity);
      }
    } catch (err) {
      console.error("Error updating cart quantity:", err);
    }
  };

  const handleRemoveItem = async (cart_item_id) => {
    console.log("Attempting to remove item with cart_item_id:", cart_item_id);
    try {
      await axiosInstance.delete(`/customer/cart/${cart_item_id}`);
      removeFromCart(cart_item_id);
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-500">
        {/* Dark Mode Toggle */}
        <div className="container mx-auto px-6 py-4 flex justify-end">
          {/* <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 border rounded-md border-gray-700 dark:border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button> */}
        </div>

        {/* Restaurant Header */}
        {restaurant && (
          <div className="shadow-lg bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <RestaurantHeader restaurant={restaurant} />
          </div>
        )}

        {/* Search Bar */}
        <div className="container mx-auto px-6 py-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <Input
              placeholder="Search for dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 rounded-xl shadow-md focus:shadow-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* Menu Categories */}
        <div className="container mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <MenuCategories
              categories={menuCategories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
        </div>

        {/* Menu Items */}
        <div className="container mx-auto px-6 pb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
              {activeCategory === "Popular" ? "Popular Dishes" : `${activeCategory} Menu`}
            </h2>
            <div className="space-y-6">
              {filteredItems.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                    <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
                    No items found matching your search.
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Try searching with different keywords or browse our categories.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {filteredItems.map((item) => (
                    <div key={item.menu_item_id} className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-600">
                      <FoodItem
                    key={item.menu_item_id}
                    item={item}
                    onAddToCart={handleAddToCart}
                    cartItems={cartItems}
                  />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cart Sidebar */}
        <CartSidebar
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      </div>
    </div>
  );
}

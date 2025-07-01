import { create } from "zustand";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

export const restaurantAuthStore = create((set, get) => ({
  authRestaurant: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingRestaurant: true,
  isLoggedIn: false,
  socket: null,
  initialMenuItems2: [],

  checkAuthRestaurant: async () => {
    try {
      const res = await axiosInstance.get("/restaurant/is-varify");
      set({ authRestaurant: res.data });
    } catch (err) {
      console.log("Error in checkAuth", err);
    } finally {
      set({ isCheckingRestaurant: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/restaurant/login", data);
      set({ authRestaurant: res.data });
      toast.success("Logged in successfully");
      //console.log(authRestaurant);
      //console.log(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/restaurant/register", data);
      set({ authRestaurant: res.data });
      toast.success("Signed up successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axiosInstance.get("/restaurant/logout");
      set({ authRestaurant: null });
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Logout failed");
    } finally {
      set({ isLoggingOut: false });
    }
  },
  add_menu_item: async (data) => {
    try {
      const res = await axiosInstance.post("/restaurant/add_menu", data);
    } catch {
      toast.error(err?.response?.data?.message || "add menu item failed");
    }
  },
  get_menus: async (data) => {
    try {
      const res = await axiosInstance.get("/restaurant/get_menu_items");
      //console.log(res.data);
      set({ initialMenuItems2: res.data });
      return res.data;
    } catch {
      toast.error(err?.response?.data?.message || "failed loading menu");
      return [];
    }
  },
  delete_menu_item: async (id) => {
    try {
      console.log("menu_item_id is in auth restaurant: ", id);
      const res = await axiosInstance.delete(`/restaurant/delete_menu/${id}`);

      if (res.data.status == "success") {
        return await get_menus();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "failed deleting menu");
      return false;
    }
  },
  edit_menu_item: async (data, id) => {
    console.log("in edit menu function", id, data);
    try {
      const res = await axiosInstance.put(`/restaurant/edit_menu/${id}`, data);

      //console.log("brom backend", res);
      if (res.status === 200) {
        return await get().get_menus();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "failed editing menu");
      return false;
    }
  },
}));

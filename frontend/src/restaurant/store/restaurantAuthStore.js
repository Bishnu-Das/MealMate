import { create } from "zustand";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

export const restaurantAuthStore = create((set, get) => ({
  authRestaurant: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingRestaurant: true,
  socket: null,

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
}));

import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { userAuthStore } from "./userAuthStore";

export const useRestaurantStore = create((set, get) => ({
  restaurants: null,
  loading: false,

  getrestaurants: async () => {
    set({ loading: true });
    try {
      const authUser = userAuthStore.getState().authUser;
      let res;

      if (authUser) {
        res = await axiosInstance.get("customer/nearby_restaurant");
      } else {
        res = await axiosInstance.get("customer/getRestaurants");
      }
      console.log("restaurants are: ");
      console.log(res.data);
      set({ restaurants: res.data });
    } catch (err) {
      console.error("Error fetching restaurants", err);
      toast.error(err?.response?.data?.message || "Failed to load restaurants");
      set({ restaurants: [] });
    } finally {
      set({ loading: false });
    }
  },
}));

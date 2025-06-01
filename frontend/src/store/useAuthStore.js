import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

export const userAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/customer/is-varify");
      set({ authUser: res.data });
    } catch (err) {
      console.log("Error in checkAuth", err);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/customer/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
}));

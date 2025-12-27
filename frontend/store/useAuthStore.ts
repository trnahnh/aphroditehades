import { create } from "zustand";
import { axiosInstance } from "../src/lib/axios";
import { AxiosError } from "axios";

export const useAuthStore = create<AuthStore>()((set) => ({
  authUser: null,
  token: null,
  isSigningUp: false,
  isLoggingIn: false,

  signup: async (signupData: {
    username: string;
    email: string;
    password: string;
  }) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/signup", signupData, {});
      set({
        token: res.data.token,
        authUser: {
          username: res.data.username,
          email: res.data.email,
        },
      });
      // TODO: Success message
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log("Axios error:", error.response?.data);
        // TODO: Error message
      } else {
        console.log("Unknown error:", error);
        // TODO: Error message
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (loginData: { email: string; password: string }) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/login", loginData, {});
      set({
        token: res.data.token,
        authUser: {
          username: res.data.username,
          email: res.data.email,
        },
      });
      // TODO: success message
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log("Axios error:", error);
        // TODO: error message
      } else {
        console.log("Unknown error:", error);
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    // TODO: loggout
  },
}));

interface AuthStore {
  authUser: {
    username: string;
    email: string;
  } | null;
  token: string | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  signup: (signupData: {
    username: string;
    email: string;
    password: string;
  }) => void;
  login: (loginData: { email: string; password: string }) => void;
  logout: () => Promise<void>;
}

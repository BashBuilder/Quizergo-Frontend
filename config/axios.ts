import axios from "axios";
import { toast } from "sonner";
import { queryClient } from "./queryClient";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

axios.defaults.baseURL = apiUrl;
axios.defaults.withCredentials = true;

// const protectedRoutes = ["/dashboard", "/settings", "/profile"];
const unprotectedRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/privacy",
  "/terms",
  "/contact",
  "/cookie",
  "/subjects",
];

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      toast.error(
        "Unable to connect to the server. Check your internet connection.",
      );
      return Promise.reject({
        message:
          "Unable to connect to the server. Check your internet connection.",
        code: "NETWORK_ERROR",
      });
    }

    const status = error.response?.status;
    const code = error.response?.data?.code;
    const isUnprotectedRoute = unprotectedRoutes.some((route) =>
      window.location.pathname.startsWith(route),
    );

    if (status === 401 && code === "UNAUTHORIZED") {
      if (isUnprotectedRoute || window.location.pathname === "/") {
        return Promise.reject(error);
      }
      queryClient.removeQueries({ queryKey: ["auth"] });
      toast.error(
        error.response?.data?.message ||
          "Session expired, please log in again.",
      );
      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

export default axios;

import axios from "axios";
import { toast } from "sonner";
import { queryClient } from "./queryClient";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

axios.defaults.baseURL = apiUrl;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    if (status === 401 && code === "UNAUTHORIZED") {
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

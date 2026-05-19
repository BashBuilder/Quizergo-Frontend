// import { useMutation } from "@tanstack/react-query";
import axios from "@/config/axios";

export const getMe = async () => {
  try {
    const user = await axios.get("/auth/me");
    return user.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user data",
      );
    }
    throw "Failed to fetch user data";
  }
};

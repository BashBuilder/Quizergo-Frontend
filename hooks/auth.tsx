import axios from "@/config/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

export function useAuth() {
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    retry: false, // don't retry on 401
    staleTime: 5 * 60 * 1000, // treat as fresh for 5 mins
  });

  const logout = async () => {
    await axios.post("/auth/logout"); // backend clears the cookie
    queryClient.removeQueries({ queryKey: ["auth"] });
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isError,
    logout,
  };
}

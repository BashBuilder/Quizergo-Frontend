import axios from "@/config/axios";
import { getMe } from "@/services/auth.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const returnRes = await getMe();
      return returnRes.user;
    },
    retry: false,
    // staleTime: 5 * 60 * 1000, // treat as fresh for 5 mins
    staleTime: Infinity,
  });

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } finally {
      queryClient.removeQueries({ queryKey: ["auth"] });
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isError,
    error,
    refetch,
    logout,
  };
}

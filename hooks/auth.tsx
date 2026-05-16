import axios from "@/config/axios";
import { getMe } from "@/services/auth.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const user = await getMe();
        return user;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("user not authorized");
        }
        router.push("/");
      }
    },
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

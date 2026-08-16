import { useQuery } from "@tanstack/react-query";
import axios from "@/config/axios";
import { useAuth } from "@/hooks/auth";

/**
 * Summary of a past attempt. Mirrors the backend's `QuizResult` Prisma
 * model (userId/answers/createdAt aren't needed on the client).
 * `submittedAt` is a Prisma `DateTime`, which serialises to an ISO string.
 */
export interface QuizResultSummary {
  id: string;
  sessionId: string;
  score: number;
  total: number;
  timeTaken: number;
  submittedAt: string;
}

export const useGetQuizHistory = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["quiz", "history"],
    queryFn: async () => {
      const { data } = await axios.get<
        QuizResultSummary[] | { results: QuizResultSummary[] }
      >("/user/history");
      return Array.isArray(data) ? data : (data?.results ?? []);
    },
    enabled: isAuthenticated,
    retry: 1,
    staleTime: 0,
  });
};

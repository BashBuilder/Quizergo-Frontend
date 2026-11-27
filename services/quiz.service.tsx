import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/config/axios";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";

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

// Types from __types__/index.d.ts (globally available)
type AnswersMap = Record<string, Record<string, string>>;
type Session = {
  sessionId: string;
  totalQuestions: number;
  duration: number | null;
  expiresAt: number | string | null;
  questions: SubjectGroup[];
};

/**
 * Create a new quiz session.
 * Returns the session data (component handles storage).
 */
export const useCreateQuizSession = () => {
  return useMutation<Session, unknown, { subjects: string[]; questionCount: number; duration: number }>({
    mutationFn: async ({ subjects, questionCount, duration }) => {
      const { data } = await axios.post<Session>("/quiz", {
        subjects,
        questionCount,
        duration,
      });
      return data;
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to start session"
        : "Failed to start session";
      toast.error(message);
    },
  });
};

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

/**
 * Sync answers during an ongoing quiz session.
 * Called every 30s to save progress.
 */
export const useSyncQuizAnswers = () => {
  return useMutation({
    mutationFn: async ({
      sessionId,
      answers,
    }: {
      sessionId: string;
      answers: AnswersMap;
    }) => {
      const { data } = await axios.patch(`/quiz/${sessionId}/sync`, {
        answers,
      });
      return data;
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to sync answers"
        : "Failed to sync answers";
      toast.error(message);
    },
  });
};

/**
 * Submit quiz answers for grading.
 * Returns the graded result.
 */
export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      answers,
    }: {
      sessionId: string;
      answers: AnswersMap;
    }) => {
      const { data } = await axios.post(`/quiz/${sessionId}/submit`, {
        answers,
      });
      return data as QuizResult;
    },
    onSuccess: (result) => {
      // Store result in sessionStorage for the result page
      try {
        sessionStorage.setItem("quizResult", JSON.stringify(result));
      } catch {
        // Session storage might be unavailable
      }
      queryClient.invalidateQueries({ queryKey: ["quiz", "history"] });
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to submit quiz"
        : "Failed to submit quiz";
      toast.error(message);
    },
  });
};

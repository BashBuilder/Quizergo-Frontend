import { useQuery } from "@tanstack/react-query";
import axios from "@/config/axios";
import { useAuth } from "@/hooks/auth";

/**
 * A subject entry returned by the backend for the study page.
 * Mirrors the data structure expected by the UI.
 */
export interface StudySubject {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  questions: number;
  avgScore: number;
  lastScore: number;
  difficulty: "easy" | "medium" | "hard";
  sessions: number;
  trending: boolean;
  locked: boolean;
  topics: string[];
}

/**
 * Hook to fetch study subjects from the backend.
 * Only enabled when user is authenticated.
 */
export const useGetStudySubjects = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["study", "subjects"],
    queryFn: async () => {
      const { data } = await axios.get<StudySubject[]>("/study/subjects");
      return data;
    },
    enabled: isAuthenticated,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
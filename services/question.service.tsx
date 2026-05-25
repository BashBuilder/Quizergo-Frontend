import { useQuery } from "@tanstack/react-query";
import axios from "@/config/axios";

export const useGetSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data } = await axios("/questions/subjects");
      return data as Subject[];
    },
    retry: 2,
    staleTime: Infinity,
  });
};

interface QuestionQueryTypes {
  name: string;
  limit: number;
}

export const useGetQuestions = (query: QuestionQueryTypes) => {
  return useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const { data } = await axios("/questions/questions", {
        params: {
          subject: query.name,
          limit: query.limit,
        },
      });
      return data as {
        questions: {
          subject: string;
          data: QuestionType[];
          status: 200;
        };
      };
    },
    retry: 2,
    staleTime: Infinity,
    enabled: false,
  });
};

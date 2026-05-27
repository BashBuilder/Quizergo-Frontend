import { useQuery } from "@tanstack/react-query";
import axios from "@/config/axios";
import qs from "qs";

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
  name: string[];
  limit: number;
  duration: number;
}

export const useGetQuestions = (query: QuestionQueryTypes) => {
  return useQuery({
    queryKey: ["questions", query],
    queryFn: async () => {
      try {
        const { data } = await axios("/questions/questions", {
          params: {
            subject: [...query.name, "english"],
            limit: query.limit,
            duration: query.duration,
          },
          paramsSerializer: (params) =>
            qs.stringify(params, {
              arrayFormat: "repeat",
            }),
        });
        return data as {
          questions: {
            subject: string;
            data: QuestionType[];
            status: 200;
          };
        };
      } catch (error) {
        if (axios.isAxiosError(error))
          throw new Error(error.response?.data?.message);
        throw new Error("Failed to fetch questions");
      }
    },
    retry: 2,
    staleTime: Infinity,
    enabled: false,
  });
};

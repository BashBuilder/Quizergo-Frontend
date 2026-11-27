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

// import { useMutation } from "@tanstack/react-query";
// import axios from "@/config/axios";

// export const useLogin = () => {
//   return useMutation(async (loginDetails: { email: string; password: string }) => {
//     try {
//       const { data } = await axios.post("/auth/login", loginDetails);
//       return data;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error("Axios error:", error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || "Login failed");
//       }
//       throw error;
//     }
//   });
// };

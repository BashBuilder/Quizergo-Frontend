"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMe,
  login as loginRequest,
  register as registerRequest,
  verifyOtp as verifyOtpRequest,
  resendOtp as resendOtpRequest,
  forgotPassword as forgotPasswordRequest,
  resetPassword as resetPasswordRequest,
  logoutRequest,
  type LoginResponse,
  type RegisterResponse,
} from "@/services/auth.service";
import { tokenStorage } from "@/lib/token-storage";
import { TOKEN_KEY, REFRESH_KEY } from "@/data/auth.constants";

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

interface AuthContextValue {
  user: User | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: unknown;
  refetch: () => void;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (payload: RegisterPayload) => Promise<RegisterResponse>;
  verifyOtp: (email: string, otp: string) => Promise<{ message: string }>;
  resendOtp: (email: string) => Promise<{ message: string }>;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (
    payload: ResetPasswordPayload,
  ) => Promise<{ message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  // null = "haven't checked localStorage yet" (avoids an SSR/client mismatch
  // and avoids firing /auth/me before we know whether a token even exists)
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    setHasToken(!!tokenStorage.getItem(TOKEN_KEY));
  }, []);

  const {
    data: user,
    isLoading: userLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await getMe();
      return res.user as User;
    },
    enabled: hasToken === true,
    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const isLoading = hasToken === null || (hasToken === true && userLoading);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await loginRequest(email, password);
      tokenStorage.setItem(TOKEN_KEY, data.accessToken);
      tokenStorage.setItem(REFRESH_KEY, data.refreshToken);
      setHasToken(true);
      queryClient.setQueryData(["auth", "me"], data.user);
      return data;
    },
    [queryClient],
  );

  const register = useCallback(async (payload: RegisterPayload) => {
    return registerRequest(payload);
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    return verifyOtpRequest(email, otp);
  }, []);

  const resendOtp = useCallback(async (email: string) => {
    return resendOtpRequest(email);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    return forgotPasswordRequest(email);
  }, []);

  const resetPassword = useCallback(async (payload: ResetPasswordPayload) => {
    return resetPasswordRequest(payload);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      tokenStorage.removeItem(TOKEN_KEY);
      tokenStorage.removeItem(REFRESH_KEY);
      setHasToken(false);
      queryClient.removeQueries({ queryKey: ["auth"] });
    }
  }, [queryClient]);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: hasToken === true && !!user && !isError,
    error,
    refetch,
    login,
    register,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

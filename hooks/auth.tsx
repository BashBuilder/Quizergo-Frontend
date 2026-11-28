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
  type PendingVerificationError,
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
  login: (
    email: string,
    password: string,
  ) => Promise<LoginResponse>;
  register: (
    payload: RegisterPayload,
  ) => Promise<RegisterResponse>;
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
  // Track user auth state in memory to avoid refetching /me on every navigation
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Check for token on mount (runs once)
  // eslint-disable-next-line react-hooks/rules-of-hooks -- reading browser state synchronously is required here
  useEffect(() => {
    const token = tokenStorage.getItem(TOKEN_KEY);
    setHasToken(!!token);
    // Mark as hydrated to allow rendering without "Loading..." flash
    setHydrated(true);
  }, []);

  const {
    data: user,
    isLoading: userLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await getMe();
      return res.user as User;
    },
    // Only enable the query once we know we have a token
    enabled: hasToken === true && hydrated,
    retry: false,
    // Cache the user data for the session - no refetch on mount or focus
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    // If cached data exists (e.g., from a previous login), use it immediately
    initialData: queryClient.getQueryData<User>(["auth", "me"]) as User | undefined,
  });

  // Show loading only during initial auth check, not on navigation
  const isLoading = hasToken === null || (hasToken === true && userLoading);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const data = await loginRequest(email, password);
        tokenStorage.setItem(TOKEN_KEY, data.accessToken);
        tokenStorage.setItem(REFRESH_KEY, data.refreshToken);
        setHasToken(true);
        // Cache the user data in React Query for instant access on navigation
        queryClient.setQueryData(["auth", "me"], data.user);
        return data;
      } catch (error) {
        // Re-throw PendingVerificationError so the page can redirect
        if (
          typeof error === "object" &&
          error !== null &&
          (error as PendingVerificationError).type === "PENDING_VERIFICATION"
        ) {
          throw error;
        }
        throw error;
      }
    },
    [queryClient],
  );

  const register = useCallback(async (payload: RegisterPayload) => {
    try {
      return await registerRequest(payload);
    } catch (error) {
      // Re-throw PendingVerificationError so the page can redirect
      if (
        typeof error === "object" &&
        error !== null &&
        (error as PendingVerificationError).type === "PENDING_VERIFICATION"
      ) {
        throw error;
      }
      throw error;
    }
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
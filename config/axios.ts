import axios from "axios";
import { toast } from "sonner";
import { queryClient } from "./queryClient";
import { tokenStorage } from "@/lib/token-storage";
import { TOKEN_KEY, REFRESH_KEY } from "@/data/auth.constants";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

axios.defaults.baseURL = apiUrl;

const unprotectedRoutes = [
  "/login",
  "/register",
  "/confirm",
  "/forgot-password",
  "/privacy",
  "/terms",
  "/contact",
  "/cookies",
  "/subjects",
];

// Requests that must NOT carry a bearer token / must not trigger a refresh
// attempt on 401 -- otherwise a bad login attempt would try to "refresh"
// and loop.
const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/verify",
  "/auth/resend-otp",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
];

axios.interceptors.request.use((config) => {
  const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => config.url?.includes(path));
  if (!isAuthEndpoint) {
    const token = tokenStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Concurrent requests that 401 at the same time should all wait on a single
// in-flight refresh instead of each firing their own.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStorage.getItem(REFRESH_KEY);
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = axios
      .post("/auth/refresh", { refreshToken })
      .then(({ data }) => {
        const newToken = data?.accessToken as string | undefined;
        if (!newToken) return null;
        tokenStorage.setItem(TOKEN_KEY, newToken);
        if (data?.refreshToken) {
          tokenStorage.setItem(REFRESH_KEY, data.refreshToken);
        }
        return newToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

function clearSession() {
  tokenStorage.removeItem(TOKEN_KEY);
  tokenStorage.removeItem(REFRESH_KEY);
  queryClient.removeQueries({ queryKey: ["auth"] });
}

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;
    const originalRequest = error.config;
    const isUnprotectedRoute = unprotectedRoutes.some((route) =>
      window.location.pathname.startsWith(route),
    );
    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) =>
      originalRequest?.url?.includes(path),
    );

    if (status === 401 && !isAuthEndpoint && !originalRequest?._retried) {
      const hadToken = !!tokenStorage.getItem(TOKEN_KEY);
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest._retried = true;
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      }

      clearSession();

      // Only surface a "session expired" toast + redirect when the user
      // actually had a session to lose -- otherwise this fires on every
      // logged-out visitor hitting a protected route (RequireAuth calls
      // refetch() on every navigation) and shows a confusing message.
      if (hadToken && !isUnprotectedRoute && window.location.pathname !== "/") {
        toast.error(
          error.response?.data?.message ||
            "Session expired, please log in again.",
        );
        window.location.href = "/login";
      }
    } else if (status === 401 && code === "UNAUTHORIZED" && isAuthEndpoint) {
      // login/register/etc failing with 401 -- let the calling page's own
      // error handling surface the message, no global redirect
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default axios;

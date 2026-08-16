import axios from "@/config/axios";

function extractMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export const getMe = async () => {
  try {
    const user = await axios.get("/auth/me");
    return user.data;
  } catch (error) {
    throw new Error(extractMessage(error, "Failed to fetch user data"));
  }
};

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const login = async (email: string, password: string) => {
  try {
    const { data } = await axios.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, "Login failed. Please try again."));
  }
};

export interface RegisterResponse {
  message: string;
}

export const register = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const { data } = await axios.post<RegisterResponse>(
      "/auth/register",
      payload,
    );
    return data;
  } catch (error) {
    throw new Error(
      extractMessage(error, "Registration failed. Please try again."),
    );
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const { data } = await axios.post<{ message: string }>("/auth/verify", {
      email,
      otp,
    });
    return data;
  } catch (error) {
    throw new Error(
      extractMessage(error, "Invalid or expired code. Try again."),
    );
  }
};

// NOTE: no resend-OTP route was specified by the backend -- this assumes a
// conventional `/auth/resend-otp` sibling to `/auth/verify`, matching the
// same assumption made in the mobile app. Update this path if the real
// backend route differs.
export const resendOtp = async (email: string) => {
  try {
    const { data } = await axios.post<{ message: string }>(
      "/auth/resend-otp",
      { email },
    );
    return data;
  } catch (error) {
    throw new Error(
      extractMessage(error, "Couldn't resend the code. Try again shortly."),
    );
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const { data } = await axios.post<{ message: string }>(
      "/auth/forgot-password",
      { email },
    );
    return data;
  } catch (error) {
    throw new Error(
      extractMessage(error, "Failed to send password reset email."),
    );
  }
};

export const resetPassword = async (payload: {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  try {
    const { data } = await axios.post<{ message: string }>(
      "/auth/reset-password",
      payload,
    );
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, "Failed to reset password."));
  }
};

export const logoutRequest = async () => {
  try {
    await axios.post("/auth/logout");
  } catch {
    // token is cleared client-side regardless -- a failed logout call on
    // the backend shouldn't block the user from being signed out locally
  }
};

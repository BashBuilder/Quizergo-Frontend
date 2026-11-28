import axios from "@/config/axios";

function extractMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

// Helper to check if error indicates pending verification
function isPendingVerificationError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  const code = error.response?.data?.code;
  const status = error.response?.data?.status;
  const message = error.response?.data?.message?.toLowerCase() || "";
  return (
    code === "PENDING_OTP_VERIFICATION" ||
    code === "PENDING_VERIFICATION" ||
    code === "UNVERIFIED" ||
    status === "pending_otp_verification" ||
    message.includes("verify") ||
    message.includes("verification")
  );
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

export interface PendingVerificationError {
  type: "PENDING_VERIFICATION";
  email: string;
}

// Helper to extract email from error response (for cases where backend provides it)
function getEmailFromError(error: unknown): string | undefined {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    // Check if email is provided in the error response
    if (typeof responseData?.email === "string") {
      return responseData.email;
    }
  }
  return undefined;
}

export const login = async (email: string, password: string) => {
  try {
    const { data } = await axios.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  } catch (error) {
    if (isPendingVerificationError(error)) {
      const errEmail = getEmailFromError(error) || email;
      throw { type: "PENDING_VERIFICATION", email: errEmail } as PendingVerificationError;
    }
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
    if (isPendingVerificationError(error)) {
      const errEmail = getEmailFromError(error) || payload.email;
      throw { type: "PENDING_VERIFICATION", email: errEmail } as PendingVerificationError;
    }
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

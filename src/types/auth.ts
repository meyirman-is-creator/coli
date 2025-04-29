export type AuthProvider = "email" | "google";

export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterCredentials = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  password: string;
  confirmPassword: string;
};

export type VerifyAccountRequest = {
  token: string;
};

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  provider: AuthProvider;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

// src/types/auth.ts
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
  gender: string;
  password: string;
  confirmPassword: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type VerifyAccountRequest = {
  token: string;
};

export type VerifyCodeRequest = {
  email: string;
  code: string;
};

export type VerifyEmailRequest = {
  email: string;
  code: string;
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
  isSurveyCompleted: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};
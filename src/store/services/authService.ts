// src/store/services/authService.ts
import {
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyCodeRequest,
  VerifyEmailRequest,
  VerifyAccountRequest,
  AuthUser
} from "@/types/auth";

// Mock API responses for now, will be replaced with actual API calls later
const mockUserData = {
  id: "1",
  firstName: "Иван",
  lastName: "Иванов",
  email: "test@example.com",
  isVerified: true,
  provider: "email",
  photoUrl: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockToken = "mock-jwt-token";

/**
 * Login user
 */
export const login = async (credentials: LoginCredentials) => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Validate credentials (for demo purposes)
  if (
    credentials.email !== "test@example.com" ||
    credentials.password !== "password"
  ) {
    throw new Error("Неверный email или пароль");
  }
  
  // Store the token in localStorage if rememberMe is true
  if (credentials.rememberMe) {
    localStorage.setItem("accessToken", mockToken);
  } else {
    // Use sessionStorage for session-only storage
    sessionStorage.setItem("accessToken", mockToken);
  }

  return {
    user: mockUserData,
    token: mockToken,
    isSurveyCompleted: false,
  };
};

/**
 * Register new user
 */
export const register = async (credentials: RegisterCredentials) => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // For demo purposes, just return success
  return {
    message: "Регистрация успешна. Проверьте вашу почту для подтверждения аккаунта."
  };
};

/**
 * Verify user account using code
 */
export const verifyEmail = async (verifyData: VerifyEmailRequest) => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // For demo purposes, check if it's a valid code (any 6-digit number)
  if (!/^\d{6}$/.test(verifyData.code)) {
    throw new Error("Неверный код подтверждения");
  }

  return {
    message: "Email успешно подтвержден",
  };
};

/**
 * Logout user
 */
export const logout = async () => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Clear storage
  localStorage.removeItem("accessToken");
  sessionStorage.removeItem("accessToken");
  
  return true;
};

/**
 * Request password reset
 */
export const forgotPassword = async (data: ForgotPasswordRequest) => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    message: "Инструкции по сбросу пароля отправлены на ваш email",
  };
};

/**
 * Verify reset code
 */
export const verifyResetCode = async (data: VerifyCodeRequest) => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // For demo purposes, check if it's a valid code (any 6-digit number)
  if (!/^\d{6}$/.test(data.code)) {
    throw new Error("Неверный код подтверждения");
  }

  return {
    message: "Код подтвержден"
  };
};

/**
 * Reset password with token
 */
export const resetPassword = async (data: ResetPasswordRequest) => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    message: "Пароль успешно изменен",
  };
};

/**
 * Verify user account with token (email verification via link)
 */
export const verifyAccount = async (data: VerifyAccountRequest) => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    message: "Аккаунт успешно подтвержден",
  };
};

/**
 * Resend verification code
 */
export const resendCode = async (email: string) => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    message: "Код подтверждения отправлен повторно",
  };
};

/**
 * Google login/register
 */
export const googleAuth = async (code: string) => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Store the token
  localStorage.setItem("accessToken", mockToken);
  
  return {
    token: mockToken,
    isSurveyCompleted: false,
  };
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  return mockUserData;
};
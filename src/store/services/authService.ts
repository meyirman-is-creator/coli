import {
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyAccountRequest,
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

  return {
    user: mockUserData,
    token: mockToken,
  };
};

/**
 * Register new user
 */
export const register = async (credentials: RegisterCredentials) => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if passwords match
  if (credentials.password !== credentials.confirmPassword) {
    throw new Error("Пароли не совпадают");
  }

  // Simulate user creation
  const newUser = {
    ...mockUserData,
    firstName: credentials.firstName,
    lastName: credentials.lastName,
    email: credentials.email,
  };

  return {
    user: newUser,
    token: mockToken,
  };
};

/**
 * Logout user
 */
export const logout = async () => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 500));
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
 * Reset password with token
 */
export const resetPassword = async (data: ResetPasswordRequest) => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if passwords match
  if (data.password !== data.confirmPassword) {
    throw new Error("Пароли не совпадают");
  }

  return {
    message: "Пароль успешно изменен",
  };
};

/**
 * Verify user account
 */
export const verifyAccount = async (data: VerifyAccountRequest) => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    message: "Аккаунт успешно подтвержден",
  };
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockUserData;
};

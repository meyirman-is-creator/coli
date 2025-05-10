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
import apiClient, { createAuthClient } from "@/utils/api-client";

/**
 * Login user
 */
export const login = async (credentials: LoginCredentials) => {
  const response = await apiClient.post<{
    accessToken: string;
    isSurveyCompleted: boolean;
  }>('/auth/login', credentials);
  
  // Store the token based on rememberMe preference
  if (credentials.rememberMe) {
    localStorage.setItem("accessToken", response.accessToken);
  } else {
    sessionStorage.setItem("accessToken", response.accessToken);
  }

  return {
    token: response.accessToken,
    isSurveyCompleted: response.isSurveyCompleted
  };
};

/**
 * Register new user
 */
export const register = async (credentials: RegisterCredentials) => {
  return await apiClient.post<string>('/auth/signup', {
    firstName: credentials.firstName,
    lastName: credentials.lastName,
    email: credentials.email,
    gender: credentials.gender,
    password: credentials.password
  });
};

/**
 * Verify user account using code
 */
export const verifyEmail = async (verifyData: VerifyEmailRequest) => {
  return await apiClient.post<string>('/auth/verify-email', verifyData);
};

/**
 * Logout user
 */
export const logout = async () => {
  // Call the backend to invalidate the token
  const authClient = createAuthClient();
  try {
    await authClient.post('/auth/logout');
  } catch (error) {
    console.error('Error during logout:', error);
  }
  
  // Clear storage regardless of API response
  localStorage.removeItem("accessToken");
  sessionStorage.removeItem("accessToken");
  
  return true;
};

/**
 * Request password reset
 */
export const forgotPassword = async (data: ForgotPasswordRequest) => {
  return await apiClient.post<string>('/auth/forgot-password', data);
};

/**
 * Verify reset code
 */
export const verifyResetCode = async (data: VerifyCodeRequest) => {
  return await apiClient.post<string>('/auth/verify-code', data);
};

/**
 * Reset password with token
 */
export const resetPassword = async (data: ResetPasswordRequest) => {
  return await apiClient.post<string>('/auth/update-password', {
    email: data.email,
    password: data.password
  });
};

/**
 * Verify user account with token (email verification via link)
 */
export const verifyAccount = async (data: VerifyAccountRequest) => {
  return await apiClient.get<string>(`/auth/verify?token=${data.token}`);
};

/**
 * Resend verification code
 */
export const resendCode = async (email: string) => {
  return await apiClient.post<string>('/auth/resendCode', { email });
};

/**
 * Google login/register
 */
export const googleAuth = async (code: string) => {
  const response = await apiClient.post<{
    accessToken: string;
    isSurveyCompleted: boolean;
  }>('/auth/google', { code });
  
  // Store the token
  localStorage.setItem("accessToken", response.accessToken);
  
  return {
    token: response.accessToken,
    isSurveyCompleted: response.isSurveyCompleted
  };
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<AuthUser> => {
  const authClient = createAuthClient();
  
  // Get the profile which includes user data
  const profile = await authClient.get<any>('/profile');
  
  // Map the response to our AuthUser type
  return {
    id: profile.id || '',
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    email: profile.email || '',
    isVerified: true, // If we can get the profile, user is verified
    provider: profile.provider || 'email',
    photoUrl: profile.profilePhoto || '',
    createdAt: profile.createdAt || new Date().toISOString(),
    updatedAt: profile.updatedAt || new Date().toISOString()
  };
};
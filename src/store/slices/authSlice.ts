// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyCodeRequest,
  VerifyEmailRequest,
  AuthUser,
} from "@/types/auth";
import * as authService from "@/store/services/authService";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isSurveyCompleted: false,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to login");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to register");
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (verifyData: VerifyEmailRequest, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmail(verifyData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to verify email");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data: ForgotPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to request password reset");
    }
  }
);

export const verifyResetCode = createAsyncThunk(
  "auth/verifyResetCode",
  async (data: VerifyCodeRequest, { rejectWithValue }) => {
    try {
      const response = await authService.verifyResetCode(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to verify reset code");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: ResetPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to reset password");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout", 
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to logout");
    }
  }
);

export const googleAuth = createAsyncThunk(
  "auth/googleAuth",
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await authService.googleAuth(code);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to authenticate with Google");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string; isSurveyCompleted: boolean }>
    ) => {
      const { user, token, isSurveyCompleted } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isSurveyCompleted = isSurveyCompleted;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isSurveyCompleted = false;
      state.status = "idle";
      state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user as AuthUser;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isSurveyCompleted = action.payload.isSurveyCompleted;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "succeeded";
        // After registration, the user needs to verify email
        // So we don't set authenticated state here
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Verify Email
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.status = "succeeded";
        // After email verification, user can now login
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Verify Reset Code
    builder
      .addCase(verifyResetCode.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyResetCode.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(verifyResetCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isSurveyCompleted = false;
        state.status = "idle";
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        // Even if logout fails on server, we clear state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isSurveyCompleted = false;
        state.status = "idle";
        state.error = null;
      });

    // Google Auth
    builder
      .addCase(googleAuth.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isSurveyCompleted = action.payload.isSurveyCompleted;
        // User info would be fetched in a separate getCurrentUser call 
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, clearCredentials, setError } = authSlice.actions;

export default authSlice.reducer;
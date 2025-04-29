import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  ProfileData,
  ProfileUpdateRequest,
  ChangePasswordRequest,
  ProfileState,
} from "@/types/profile";
import { QuestionnaireResponse } from "@/types/apartment";
import * as profileService from "@/store/services/profileService";

const initialState: ProfileState = {
  profile: null,
  status: "idle",
  error: null,
};

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfile();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch profile");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData: ProfileUpdateRequest, { rejectWithValue }) => {
    try {
      const response = await profileService.updateProfile(profileData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (passwordData: ChangePasswordRequest, { rejectWithValue }) => {
    try {
      const response = await profileService.changePassword(passwordData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to change password");
    }
  }
);

export const submitQuestionnaire = createAsyncThunk(
  "profile/submitQuestionnaire",
  async (questionnaireData: QuestionnaireResponse, { rejectWithValue }) => {
    try {
      const response = await profileService.submitQuestionnaire(
        questionnaireData
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to submit questionnaire");
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "profile/updateUserStatus",
  async (status: string, { rejectWithValue }) => {
    try {
      const response = await profileService.updateUserStatus(status);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update status");
    }
  }
);

export const uploadProfilePhoto = createAsyncThunk(
  "profile/uploadProfilePhoto",
  async (photoFile: File, { rejectWithValue }) => {
    try {
      const response = await profileService.uploadProfilePhoto(photoFile);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to upload photo");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    resetProfileState: (state) => {
      state.profile = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProfile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // updateProfile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // changePassword
    builder
      .addCase(changePassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // submitQuestionnaire
    builder
      .addCase(submitQuestionnaire.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitQuestionnaire.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.profile) {
          state.profile.hasQuestionnaire = true;
        }
      })
      .addCase(submitQuestionnaire.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // updateUserStatus
    builder
      .addCase(updateUserStatus.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.profile) {
          state.profile.userStatus = action.payload.userStatus;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // uploadProfilePhoto
    builder
      .addCase(uploadProfilePhoto.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.profile) {
          state.profile.photoUrl = action.payload.photoUrl;
        }
      })
      .addCase(uploadProfilePhoto.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearProfileError, resetProfileState } = profileSlice.actions;

export default profileSlice.reducer;

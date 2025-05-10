import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Card } from "@/types/common";
import * as addressService from "@/store/services/addressService";
import { Status } from "@/types";

interface AnnouncementState {
  announcements: Card[];
  page: number;
  totalPages: number;
  status: Status;
  error: string | null;
}

const initialState: AnnouncementState = {
  announcements: [],
  page: 1,
  totalPages: 1,
  status: "idle",
  error: null,
};

// Async thunk для поиска объявлений с параметрами фильтра
export const searchAnnouncements = createAsyncThunk(
  "announcement/searchAnnouncements",
  async (params: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await addressService.searchAnnouncements(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to search announcements");
    }
  }
);

const announcementSlice = createSlice({
  name: "announcement",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    resetAnnouncementState: (state) => {
      state.announcements = [];
      state.page = 1;
      state.totalPages = 1;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // searchAnnouncements reducers
    builder
      .addCase(searchAnnouncements.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchAnnouncements.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.announcements = action.payload.data.announcements || [];
        state.page = action.payload.data.page || 1;
        // Предполагаем, что в ответе API есть totalPages, иначе устанавливаем 1
        state.totalPages = action.payload.data.totalPages || 1;
      })
      .addCase(searchAnnouncements.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setPage, resetAnnouncementState } = announcementSlice.actions;

export default announcementSlice.reducer;

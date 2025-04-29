import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  FilterState,
  SaveFilterRequest,
  DeleteFilterRequest,
  ApplyFilterRequest,
} from "@/types/filter";
import { ApartmentFilter } from "@/types/apartment";
import * as filterService from "@/store/services/filterService";

const initialState: FilterState = {
  currentFilter: {},
  savedFilters: [],
  status: "idle",
  error: null,
};

export const saveFilter = createAsyncThunk(
  "filter/saveFilter",
  async (request: SaveFilterRequest, { rejectWithValue }) => {
    try {
      const response = await filterService.saveFilter(request);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to save filter");
    }
  }
);

export const fetchSavedFilters = createAsyncThunk(
  "filter/fetchSavedFilters",
  async (_, { rejectWithValue }) => {
    try {
      const response = await filterService.getSavedFilters();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch saved filters");
    }
  }
);

export const deleteFilter = createAsyncThunk(
  "filter/deleteFilter",
  async (request: DeleteFilterRequest, { rejectWithValue }) => {
    try {
      await filterService.deleteFilter(request.id);
      return request.id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete filter");
    }
  }
);

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setCurrentFilter: (state, action: PayloadAction<ApartmentFilter>) => {
      state.currentFilter = action.payload;
    },
    clearCurrentFilter: (state) => {
      state.currentFilter = {};
    },
    clearFilterError: (state) => {
      state.error = null;
    },
    updateFilterValue: (
      state,
      action: PayloadAction<{ key: keyof ApartmentFilter; value: any }>
    ) => {
      const { key, value } = action.payload;
      state.currentFilter = {
        ...state.currentFilter,
        [key]: value,
      };
    },
  },
  extraReducers: (builder) => {
    // saveFilter
    builder
      .addCase(saveFilter.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveFilter.fulfilled, (state, action) => {
        state.status = "succeeded";

        // Check if the filter already exists to update it
        const existingIndex = state.savedFilters.findIndex(
          (filter) => filter.id === action.payload.id
        );

        if (existingIndex >= 0) {
          state.savedFilters[existingIndex] = action.payload;
        } else {
          state.savedFilters.push(action.payload);
        }
      })
      .addCase(saveFilter.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // fetchSavedFilters
    builder
      .addCase(fetchSavedFilters.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSavedFilters.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.savedFilters = action.payload;
      })
      .addCase(fetchSavedFilters.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // deleteFilter
    builder
      .addCase(deleteFilter.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteFilter.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.savedFilters = state.savedFilters.filter(
          (filter) => filter.id !== action.payload
        );
      })
      .addCase(deleteFilter.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentFilter,
  clearCurrentFilter,
  clearFilterError,
  updateFilterValue,
} = filterSlice.actions;

export default filterSlice.reducer;

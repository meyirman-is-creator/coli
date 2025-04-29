import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Apartment,
  ApartmentFilter,
  ApartmentGroup,
  ApartmentResponse,
} from "@/types/apartment";
import * as apartmentService from "@/store/services/apartmentService";
import { Status } from "@/types";

interface ApartmentState {
  apartments: Apartment[];
  selectedApartment: Apartment | null;
  myApartments: Apartment[];
  apartmentGroups: ApartmentGroup[];
  myResponses: ApartmentResponse[];
  status: Status;
  error: string | null;
  totalCount: number;
  page: number;
  limit: number;
}

const initialState: ApartmentState = {
  apartments: [],
  selectedApartment: null,
  myApartments: [],
  apartmentGroups: [],
  myResponses: [],
  status: "idle",
  error: null,
  totalCount: 0,
  page: 1,
  limit: 10,
};

export const fetchApartments = createAsyncThunk(
  "apartment/fetchApartments",
  async (
    params: { filter?: ApartmentFilter; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await apartmentService.getApartments(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch apartments");
    }
  }
);

export const fetchApartmentById = createAsyncThunk(
  "apartment/fetchApartmentById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apartmentService.getApartmentById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch apartment details"
      );
    }
  }
);

export const fetchMyApartments = createAsyncThunk(
  "apartment/fetchMyApartments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apartmentService.getMyApartments();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch your apartments"
      );
    }
  }
);

export const createApartment = createAsyncThunk(
  "apartment/createApartment",
  async (apartmentData: Partial<Apartment>, { rejectWithValue }) => {
    try {
      const response = await apartmentService.createApartment(apartmentData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create apartment");
    }
  }
);

export const updateApartment = createAsyncThunk(
  "apartment/updateApartment",
  async (
    { id, apartmentData }: { id: string; apartmentData: Partial<Apartment> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apartmentService.updateApartment(
        id,
        apartmentData
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update apartment");
    }
  }
);

export const deleteApartment = createAsyncThunk(
  "apartment/deleteApartment",
  async (id: string, { rejectWithValue }) => {
    try {
      await apartmentService.deleteApartment(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete apartment");
    }
  }
);

export const createApartmentResponse = createAsyncThunk(
  "apartment/createApartmentResponse",
  async (
    {
      apartmentId,
      groupId,
      message,
    }: { apartmentId: string; groupId?: string; message?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apartmentService.createApartmentResponse(
        apartmentId,
        groupId,
        message
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create response");
    }
  }
);

export const fetchMyResponses = createAsyncThunk(
  "apartment/fetchMyResponses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apartmentService.getMyResponses();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch your responses");
    }
  }
);

const apartmentSlice = createSlice({
  name: "apartment",
  initialState,
  reducers: {
    resetSelectedApartment: (state) => {
      state.selectedApartment = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchApartments
    builder
      .addCase(fetchApartments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchApartments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.apartments = action.payload.items;
        state.totalCount = action.payload.pagination.total;
        state.page = action.payload.pagination.page;
        state.limit = action.payload.pagination.limit;
      })
      .addCase(fetchApartments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // fetchApartmentById
    builder
      .addCase(fetchApartmentById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchApartmentById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedApartment = action.payload;
      })
      .addCase(fetchApartmentById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // fetchMyApartments
    builder
      .addCase(fetchMyApartments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyApartments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myApartments = action.payload;
      })
      .addCase(fetchMyApartments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // createApartment
    builder
      .addCase(createApartment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createApartment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myApartments.push(action.payload);
      })
      .addCase(createApartment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // updateApartment
    builder
      .addCase(updateApartment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateApartment.fulfilled, (state, action) => {
        state.status = "succeeded";

        // Update in myApartments
        const index = state.myApartments.findIndex(
          (apartment) => apartment.id === action.payload.id
        );
        if (index !== -1) {
          state.myApartments[index] = action.payload;
        }

        // Update in apartments if exists
        const apartmentIndex = state.apartments.findIndex(
          (apartment) => apartment.id === action.payload.id
        );
        if (apartmentIndex !== -1) {
          state.apartments[apartmentIndex] = action.payload;
        }

        // Update selectedApartment if it's the same
        if (
          state.selectedApartment &&
          state.selectedApartment.id === action.payload.id
        ) {
          state.selectedApartment = action.payload;
        }
      })
      .addCase(updateApartment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // deleteApartment
    builder
      .addCase(deleteApartment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteApartment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myApartments = state.myApartments.filter(
          (apartment) => apartment.id !== action.payload
        );
        state.apartments = state.apartments.filter(
          (apartment) => apartment.id !== action.payload
        );
        if (
          state.selectedApartment &&
          state.selectedApartment.id === action.payload
        ) {
          state.selectedApartment = null;
        }
      })
      .addCase(deleteApartment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // createApartmentResponse
    builder
      .addCase(createApartmentResponse.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createApartmentResponse.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myResponses.push(action.payload);
      })
      .addCase(createApartmentResponse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // fetchMyResponses
    builder
      .addCase(fetchMyResponses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyResponses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myResponses = action.payload;
      })
      .addCase(fetchMyResponses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetSelectedApartment, setPage, setLimit, clearError } =
  apartmentSlice.actions;

export default apartmentSlice.reducer;

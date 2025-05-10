// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { AddressType } from "@/types/common";
// import * as addressService from "@/store/services/addressService";
// import { Status } from "@/types";

// interface AddressState {
//   cities: AddressType[];
//   districts: AddressType[];
//   microDistricts: AddressType[];
//   selectedRegion: AddressType | null;
//   selectedDistrict: AddressType | null;
//   selectedMicroDistrict: AddressType | null;
//   status: Status;
//   error: string | null;
// }

// const initialState: AddressState = {
//   cities: [],
//   districts: [],
//   microDistricts: [],
//   selectedRegion: null,
//   selectedDistrict: null,
//   selectedMicroDistrict: null,
//   status: "idle",
//   error: null,
// };

// // Async thunk for fetching cities (using parent ID 1 for country)
// export const fetchCities = createAsyncThunk(
//   "address/fetchCities",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await addressService.getAddresses(1); // ID 1 represents the country
//       return response;
//     } catch (error: any) {
//       return rejectWithValue(error.message || "Failed to fetch cities");
//     }
//   }
// );

// // Async thunk for fetching districts based on city ID
// export const fetchDistricts = createAsyncThunk(
//   "address/fetchDistricts",
//   async (cityId: number, { rejectWithValue }) => {
//     try {
//       const response = await addressService.getAddresses(cityId);
//       return { cityId, data: response };
//     } catch (error: any) {
//       return rejectWithValue(error.message || "Failed to fetch districts");
//     }
//   }
// );

// // Async thunk for fetching microdistricts based on district ID
// export const fetchMicroDistricts = createAsyncThunk(
//   "address/fetchMicroDistricts",
//   async (districtId: number, { rejectWithValue }) => {
//     try {
//       const response = await addressService.getAddresses(districtId);
//       return { districtId, data: response };
//     } catch (error: any) {
//       return rejectWithValue(error.message || "Failed to fetch microdistricts");
//     }
//   }
// );

// const addressSlice = createSlice({
//   name: "address",
//   initialState,
//   reducers: {
//     setSelectedRegion: (state, action: PayloadAction<AddressType | null>) => {
//       state.selectedRegion = action.payload;
//       // Reset related fields when region changes
//       if (action.payload === null) {
//         state.districts = [];
//         state.microDistricts = [];
//         state.selectedDistrict = null;
//         state.selectedMicroDistrict = null;
//       }
//     },
//     setSelectedDistrict: (state, action: PayloadAction<AddressType | null>) => {
//       state.selectedDistrict = action.payload;
//       // Reset microdistricts when district changes
//       if (action.payload === null) {
//         state.microDistricts = [];
//         state.selectedMicroDistrict = null;
//       }
//     },
//     setSelectedMicroDistrict: (
//       state,
//       action: PayloadAction<AddressType | null>
//     ) => {
//       state.selectedMicroDistrict = action.payload;
//     },
//     resetAddressState: (state) => {
//       state.cities = [];
//       state.districts = [];
//       state.microDistricts = [];
//       state.selectedRegion = null;
//       state.selectedDistrict = null;
//       state.selectedMicroDistrict = null;
//       state.status = "idle";
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // fetchCities reducers
//     builder
//       .addCase(fetchCities.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(fetchCities.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.cities = action.payload.data || [];
//       })
//       .addCase(fetchCities.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload as string;
//       });

//     // fetchDistricts reducers
//     builder
//       .addCase(fetchDistricts.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(fetchDistricts.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.districts = action.payload.data.data || [];
//       })
//       .addCase(fetchDistricts.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload as string;
//       });

//     // fetchMicroDistricts reducers
//     builder
//       .addCase(fetchMicroDistricts.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(fetchMicroDistricts.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.microDistricts = action.payload.data.data || [];
//       })
//       .addCase(fetchMicroDistricts.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload as string;
//       });
//   },
// });

// export const {
//   setSelectedRegion,
//   setSelectedDistrict,
//   setSelectedMicroDistrict,
//   resetAddressState,
// } = addressSlice.actions;

// export default addressSlice.reducer;

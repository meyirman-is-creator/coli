import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GenderOption, RoommateOption } from "@/types/common";

interface AddressState {
  regionId: number | null;
  regionName: string;
  districtId: number | null;
  districtName: string;
  microDistrictId: number | null;
  microDistrictName: string;
}

interface SearchBarState {
  address: AddressState;
  priceRange: [number, number];
  gender: GenderOption | null;
  roommates: RoommateOption | null;
}

export const initialState: SearchBarState = {
  address: {
    regionId: null,
    regionName: "Весь Казахстан",
    districtId: null,
    districtName: "",
    microDistrictId: null,
    microDistrictName: "",
  },
  priceRange: [0, 500000],
  gender: null,
  roommates: null,
};

const searchBarSlice = createSlice({
  name: "searchBar",
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<AddressState>) => {
      state.address = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    setGender: (state, action: PayloadAction<GenderOption | null>) => {
      state.gender = action.payload;
    },
    setRoommates: (state, action: PayloadAction<RoommateOption | null>) => {
      state.roommates = action.payload;
    },
    resetSearchBar: (state) => {
      state.address = initialState.address;
      state.priceRange = initialState.priceRange;
      state.gender = initialState.gender;
      state.roommates = initialState.roommates;
    },
  },
});

export const {
  setAddress,
  setPriceRange,
  setGender,
  setRoommates,
  resetSearchBar,
} = searchBarSlice.actions;

export default searchBarSlice.reducer;

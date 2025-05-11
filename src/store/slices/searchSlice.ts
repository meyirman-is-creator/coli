// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { searchApi } from "@/store/services/searchService";

// interface SearchState {
//   results: any[];
//   totalCount: number;
//   page: number;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: SearchState = {
//   results: [],
//   totalCount: 0,
//   page: 1,
//   loading: false,
//   error: null,
// };

// const searchSlice = createSlice({
//   name: "search",
//   initialState,
//   reducers: {
//     setPage: (state, action: PayloadAction<number>) => {
//       state.page = action.payload;
//     },
//     clearResults: (state) => {
//       state.results = [];
//       state.totalCount = 0;
//       state.page = 1;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addMatcher(
//         searchApi.endpoints.searchAnnouncements.matchPending,
//         (state) => {
//           state.loading = true;
//           state.error = null;
//         }
//       )
//       .addMatcher(
//         searchApi.endpoints.searchAnnouncements.matchFulfilled,
//         (state, action) => {
//           state.loading = false;
//           state.results = action.payload.data.announcements;
//           state.totalCount = action.payload.data.announcements.length;
//           state.page = action.payload.data.page;
//         }
//       )
//       .addMatcher(
//         searchApi.endpoints.searchAnnouncements.matchRejected,
//         (state, action) => {
//           state.loading = false;
//           state.error =
//             action.error.message || "Failed to search announcements";
//         }
//       );
//   },
// });

// export const { setPage, clearResults } = searchSlice.actions;
// export default searchSlice.reducer;

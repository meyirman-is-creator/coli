// import { api } from "@/store/api";
// import type { Response } from "@/types/response/response";
// import { AddressType } from "@/types/common";

// export interface AnnouncementResponse {
//   data: {
//     page: number;
//     announcements: any[];
//   };
//   message: string | null;
//   error: string | null;
//   code: number;
// }

// export interface SearchParams {
//   region?: string;
//   district?: string;
//   microDistrict?: string;
//   minPrice?: string;
//   maxPrice?: string;
//   selectedGender?: string;
//   numberOfPeopleAreYouAccommodating?: string;
//   page?: number;
//   limit?: number;
// }

// export const searchApi = api.injectEndpoints({
//   endpoints: (build) => ({
//     getAddresses: build.query<Response<AddressType[]>, number>({
//       query: (parentId) => ({
//         url: `/address/get-children/${parentId}`,
//         method: "GET",
//       }),
//     }),

//     searchAnnouncements: build.query<AnnouncementResponse, SearchParams>({
//       query: (params) => ({
//         url: `/announcement/all`,
//         method: "GET",
//         params,
//       }),
//     }),
//   }),
// });

// export const {
//   useGetAddressesQuery,
//   useLazyGetAddressesQuery,
//   useSearchAnnouncementsQuery,
//   useLazySearchAnnouncementsQuery,
// } = searchApi;

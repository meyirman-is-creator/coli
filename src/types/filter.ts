import { ApartmentFilter } from "./apartment";

export type FilterState = {
  currentFilter: ApartmentFilter;
  savedFilters: ApartmentFilter[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

export type SaveFilterRequest = {
  name: string;
  filter: ApartmentFilter;
};

export type DeleteFilterRequest = {
  id: string;
};

export type ApplyFilterRequest = {
  filter: ApartmentFilter;
};

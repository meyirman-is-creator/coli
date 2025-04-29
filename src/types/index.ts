// Common types that are shared across the application

export type Status = "idle" | "loading" | "succeeded" | "failed";

export type AppError = {
  message: string;
  code?: string;
  status?: number;
};

export type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
  success: boolean;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: Pagination;
};

export type SortDirection = "asc" | "desc";

export type SortOption = {
  field: string;
  direction: SortDirection;
};

export type ResponseStatus = "pending" | "accepted" | "rejected";

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export type City = {
  id: string;
  name: string;
  region: string;
  country: string;
};

export * from "./apartment";
export * from "./auth";
export * from "./profile";
export * from "./group";
export * from "./filter";

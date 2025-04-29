import { ApartmentFilter } from "@/types/apartment";
import { SaveFilterRequest } from "@/types/filter";

// Mock data for saved filters
const mockSavedFilters: ApartmentFilter[] = [
  {
    id: "filter1",
    userId: "user1",
    name: "Поиск в центре",
    cityId: "city1",
    type: ["apartment", "studio"],
    priceMin: 30000,
    priceMax: 70000,
    roomsMin: 1,
    features: ["wifi", "washing_machine"],
    savedFilter: true,
  },
  {
    id: "filter2",
    userId: "user1",
    name: "Бюджетный вариант",
    cityId: "city1",
    type: ["room"],
    priceMax: 25000,
    features: ["wifi"],
    savedFilter: true,
  },
];

/**
 * Get all saved filters for a user
 */
export const getSavedFilters = async (): Promise<ApartmentFilter[]> => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 600));

  return [...mockSavedFilters];
};

/**
 * Save a filter
 */
export const saveFilter = async (
  request: SaveFilterRequest
): Promise<ApartmentFilter> => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 800));

  const existingFilter = mockSavedFilters.find(
    (filter) => filter.name === request.name
  );

  if (existingFilter) {
    // Update existing filter
    const updatedFilter = {
      ...existingFilter,
      ...request.filter,
      name: request.name,
      savedFilter: true,
    };

    return updatedFilter;
  } else {
    // Create a new filter
    const newFilter: ApartmentFilter = {
      id: `filter-${Date.now()}`,
      userId: "user1", // Mock current user
      name: request.name,
      ...request.filter,
      savedFilter: true,
    };

    return newFilter;
  }
};

/**
 * Delete a saved filter
 */
export const deleteFilter = async (filterId: string): Promise<boolean> => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 500));

  const filterIndex = mockSavedFilters.findIndex(
    (filter) => filter.id === filterId
  );

  if (filterIndex === -1) {
    throw new Error("Фильтр не найден");
  }

  // In a real app, this would delete from the database
  return true;
};

/**
 * Apply a filter (just returns the filter for the reducer to use)
 */
export const applyFilter = async (
  filter: ApartmentFilter
): Promise<ApartmentFilter> => {
  // No need for API call here, just passing through
  return filter;
};

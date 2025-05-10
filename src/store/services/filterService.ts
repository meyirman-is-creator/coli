import { SaveFilterRequest } from "@/types/filter";
import { createAuthClient } from "@/utils/api-client";

/**
 * Get all saved filters for a user
 */
export const getSavedFilters = async () => {
  const authClient = createAuthClient();
  
  // The filters are included in the profile response
  const profileResponse = await authClient.get('/profile');
  
  return (profileResponse as any).savedFilters || [];
};

/**
 * Save a filter
 */
export const saveFilter = async (request: SaveFilterRequest) => {
  const authClient = createAuthClient();
  
  // Format the filter data for the API
  const filterData = {
    selectedGender: request.filter.gender || 'OTHER',
    region: request.filter.address?.regionId || 0,
    district: request.filter.address?.districtId || 0,
    microDistrict: request.filter.address?.microDistrictId || 0,
    minPrice: request.filter.priceMin || 0,
    maxPrice: request.filter.priceMax || 500000,
    numberOfPeopleAreYouAccommodating: request.filter.maxOccupants || 0,
    quantityOfRooms: request.filter.roomsMin?.toString() || '1',
    minAge: request.filter.minAge || 18,
    maxAge: request.filter.maxAge || 60,
    arriveDate: request.filter.availableFrom || new Date().toISOString(),
    minArea: request.filter.areaMin || 0,
    maxArea: request.filter.areaMax || 0,
    notTheFirstFloor: request.filter.isNotFirstFloor || false,
    notTheTopFloor: request.filter.isNotLastFloor || false,
    arePetsAllowed: request.filter.features?.includes('pets_allowed') || false,
    isCommunalServiceIncluded: request.filter.utilitiesIncluded || false,
    intendedForStudents: request.filter.forStudents || false,
    typeOfHousing: request.filter.type?.[0] || 'Квартира',
    forALongTime: request.filter.termType === 'long' || true,
    minFloor: request.filter.minFloor || 0,
    maxFloor: request.filter.maxFloor || 0,
    onlyApartmentsWithoutResidents: false,
    areBadHabitsAllowed: request.filter.badHabitsAllowed || false,
    role: 'OWNER'
  };
  
  const response = await authClient.post('/filters/save', filterData);
  
  // Return the saved filter with the name
  return {
    ...request.filter,
    id: Date.now().toString(), // The API might return an ID, use it if available
    name: request.name,
    savedFilter: true
  };
};

/**
 * Delete a saved filter
 */
export const deleteFilter = async (filterId: string) => {
  const authClient = createAuthClient();
  
  await authClient.delete(`/filters/delete/${filterId}`);
  
  return true;
};

/**
 * Apply a filter (client-side only, no API call needed)
 */
export const applyFilter = async (filter: any) => {
  // This is a client-side operation, no API call needed
  return filter;
};
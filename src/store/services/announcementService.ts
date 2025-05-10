import { Card, Response } from "@/types/common";
import { createAuthClient } from "@/utils/api-client";

/**
 * Get all announcements with filter parameters
 */
export const getAllAnnouncements = async (params: Record<string, any> = {}) => {
  const authClient = createAuthClient();
  
  // Convert parameters to API format
  const apiParams: Record<string, any> = {};
  
  // Map the filter parameters to API parameters
  if (params.region) apiParams.region = params.region;
  if (params.district) apiParams.district = params.district;
  if (params.microDistrict) apiParams.microDistrict = params.microDistrict;
  if (params.minPrice) apiParams.minPrice = params.minPrice;
  if (params.maxPrice) apiParams.maxPrice = params.maxPrice;
  if (params.numberOfPeopleAreYouAccommodating) {
    apiParams.numberOfPeopleAreYouAccommodating = params.numberOfPeopleAreYouAccommodating;
  }
  if (params.quantityOfRooms) apiParams.quantityOfRooms = params.quantityOfRooms;
  if (params.minAge) apiParams.minAge = params.minAge;
  if (params.maxAge) apiParams.maxAge = params.maxAge;
  if (params.forALongTime !== undefined) apiParams.forALongTime = params.forALongTime;
  if (params.arriveDate) apiParams.arriveDate = params.arriveDate;
  if (params.minArea) apiParams.minArea = params.minArea;
  if (params.maxArea) apiParams.maxArea = params.maxArea;
  if (params.notTheFirstFloor !== undefined) apiParams.notTheFirstFloor = params.notTheFirstFloor;
  if (params.notTheTopFloor !== undefined) apiParams.notTheTopFloor = params.notTheTopFloor;
  if (params.arePetsAllowed !== undefined) apiParams.arePetsAllowed = params.arePetsAllowed;
  if (params.isCommunalServiceIncluded !== undefined) {
    apiParams.isCommunalServiceIncluded = params.isCommunalServiceIncluded;
  }
  if (params.intendedForStudents !== undefined) apiParams.intendedForStudents = params.intendedForStudents;
  if (params.typeOfHousing) apiParams.typeOfHousing = params.typeOfHousing;
  if (params.minFloor) apiParams.minFloor = params.minFloor;
  if (params.maxFloor) apiParams.maxFloor = params.maxFloor;
  if (params.onlyApartmentsWithoutResidents !== undefined) {
    apiParams.onlyApartmentsWithoutResidents = params.onlyApartmentsWithoutResidents;
  }
  if (params.areBadHabitsAllowed !== undefined) apiParams.areBadHabitsAllowed = params.areBadHabitsAllowed;
  if (params.role) apiParams.role = params.role;
  if (params.page) apiParams.page = params.page;
  if (params.limit) apiParams.limit = params.limit;
  if (params.sort) apiParams.sort = params.sort;
  
  // Get the announcements with filters
  return await authClient.post<Response<{
    page: number;
    announcements: Card[];
  }>>('/announcement/all', params.coordinates || [], { params: apiParams });
};

/**
 * Get announcement details by ID
 */
export const getAnnouncementById = async (id: number) => {
  const authClient = createAuthClient();
  return await authClient.get(`/announcement/detail/${id}`);
};

/**
 * Get great deals (featured announcements)
 */
export const getGreatDeals = async () => {
  const authClient = createAuthClient();
  return await authClient.get<Card[]>('/announcement/great-deals');
};

/**
 * Get my active announcements
 */
export const getMyActiveAnnouncements = async () => {
  const authClient = createAuthClient();
  return await authClient.get<Card[]>('/announcement/my-active-announcements');
};

/**
 * Get my archived announcements
 */
export const getMyArchivedAnnouncements = async () => {
  const authClient = createAuthClient();
  return await authClient.get<Card[]>('/announcement/my-archive-announcements');
};

/**
 * Archive announcement
 */
export const archiveAnnouncement = async (id: number) => {
  const authClient = createAuthClient();
  return await authClient.post<Card[]>(`/announcement/archive-announcement/${id}`);
};

/**
 * Restore announcement
 */
export const restoreAnnouncement = async (id: number) => {
  const authClient = createAuthClient();
  return await authClient.post<Card[]>(`/announcement/restore-announcement/${id}`);
};

/**
 * Delete announcement
 */
export const deleteAnnouncement = async (id: number) => {
  const authClient = createAuthClient();
  return await authClient.delete(`/announcement/delete-announcement/${id}`);
};

/**
 * Create announcement - Step 1
 */
export const createAnnouncementStep1 = async (data: any) => {
  const authClient = createAuthClient();
  return await authClient.post<number>('/announcement/create/step1', data);
};

/**
 * Create announcement - Step 2
 */
export const createAnnouncementStep2 = async (announcementId: number, data: any) => {
  const authClient = createAuthClient();
  return await authClient.post<number>(`/announcement/create/step2/${announcementId}`, data);
};

/**
 * Create announcement - Step 3
 */
export const createAnnouncementStep3 = async (announcementId: number, data: any) => {
  const authClient = createAuthClient();
  return await authClient.post<number>(`/announcement/create/step3/${announcementId}`, data);
};

/**
 * Create announcement - Step 4
 */
export const createAnnouncementStep4 = async (announcementId: number, data: any) => {
  const authClient = createAuthClient();
  return await authClient.post<number>(`/announcement/create/step4/${announcementId}`, data);
};

/**
 * Create announcement - Step 5
 */
export const createAnnouncementStep5 = async (announcementId: number, data: any) => {
  const authClient = createAuthClient();
  return await authClient.post<number>(`/announcement/create/step5/${announcementId}`, data);
};

/**
 * Create announcement - Step 6 (final)
 */
export const createAnnouncementStep6 = async (announcementId: number, data: any) => {
  const authClient = createAuthClient();
  return await authClient.post<{token: string, message: string}>(`/announcement/create/step6/${announcementId}`, data);
};

/**
 * Update announcement
 */
export const updateAnnouncement = async (id: number, data: any) => {
  const authClient = createAuthClient();
  return await authClient.put(`/announcement/update/${id}`, data);
};

/**
 * Upload announcement images
 */
export const uploadAnnouncementImages = async (files: File[]) => {
  const authClient = createAuthClient();
  
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  
  // Need to remove the content-type header for file uploads
  return await authClient.post<string[]>('/file/upload', formData, {
    headers: {}
  });
};
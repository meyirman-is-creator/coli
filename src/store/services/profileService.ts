import {
  ProfileData,
  ProfileUpdateRequest,
  ChangePasswordRequest,
} from "@/types/profile";
import { QuestionnaireResponse } from "@/types/apartment";
import { createAuthClient } from "@/utils/api-client";

/**
 * Get user profile
 */
export const getProfile = async (): Promise<ProfileData> => {
  const authClient = createAuthClient();
  const profileData = await authClient.get<ProfileWithFiltersResponse>('/profile');
  
  // Map API response to our ProfileData type
  return mapApiProfileToProfileData(profileData);
};

// Helper type for the API response
interface ProfileWithFiltersResponse {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string | null;
  phoneNumber: string | null;
  gender: string;
  profilePhoto: string | null;
  isPasswordHas: boolean;
  status: string;
  savedFilters?: any[];
}

// Helper function to map API profile to our ProfileData type
function mapApiProfileToProfileData(apiProfile: ProfileWithFiltersResponse): ProfileData {
  return {
    id: '', // Will be provided by backend if needed
    userId: '', // Will be provided by backend if needed
    firstName: apiProfile.firstName || '',
    lastName: apiProfile.lastName || '',
    displayName: `${apiProfile.firstName} ${apiProfile.lastName}`,
    bio: '',
    gender: mapGender(apiProfile.gender),
    birthDate: apiProfile.birthDate || undefined,
    occupation: '',
    photoUrl: apiProfile.profilePhoto || undefined,
    contacts: {
      email: apiProfile.email,
      phone: apiProfile.phoneNumber || undefined,
    },
    socialMedia: {},
    userStatus: mapUserStatus(apiProfile.status),
    savedFilters: apiProfile.savedFilters || [],
    hasQuestionnaire: false, // Will be determined elsewhere
    createdAt: '',
    updatedAt: '',
  };
}

// Helper function to map gender from API to our type
function mapGender(apiGender: string): 'male' | 'female' | 'other' | 'prefer_not_to_say' {
  switch (apiGender) {
    case 'MALE':
      return 'male';
    case 'FEMALE':
      return 'female';
    case 'OTHER':
      return 'other';
    default:
      return 'prefer_not_to_say';
  }
}

// Helper function to map user status from API to our type
function mapUserStatus(apiStatus: string): 'actively_searching' | 'passively_searching' | 'found_housing' | 'looking_for_roommates' | 'not_looking' | 'landlord' {
  switch (apiStatus) {
    case 'looking_for_apartment':
      return 'actively_searching';
    case 'looking_for_roommate':
      return 'looking_for_roommates';
    default:
      return 'actively_searching';
  }
}

/**
 * Update user profile
 */
export const updateProfile = async (profileData: ProfileUpdateRequest): Promise<ProfileData> => {
  const authClient = createAuthClient();
  
  // Map our profile data to the API format
  const apiProfileData = {
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    birthDate: profileData.birthDate,
    phoneNumber: profileData.contacts?.phone,
    gender: mapGenderToApi(profileData.gender),
  };
  
  const updatedProfile = await authClient.put<ProfileWithFiltersResponse>('/profile/edit', apiProfileData);
  
  return mapApiProfileToProfileData(updatedProfile);
};

// Helper function to map our gender type to API format
function mapGenderToApi(gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'): string {
  switch (gender) {
    case 'male':
      return 'MALE';
    case 'female':
      return 'FEMALE';
    case 'other':
      return 'OTHER';
    default:
      return 'OTHER';
  }
}

/**
 * Change user password
 */
export const changePassword = async (passwordData: ChangePasswordRequest): Promise<{ success: boolean; message: string }> => {
  const authClient = createAuthClient();
  
  await authClient.post('/profile/update-password', {
    oldPassword: passwordData.currentPassword,
    newPassword: passwordData.newPassword
  });
  
  return {
    success: true,
    message: "Пароль успешно изменен",
  };
};

/**
 * Submit user questionnaire
 */
export const submitQuestionnaire = async (questionnaireData: QuestionnaireResponse): Promise<{ success: boolean; questionnaire: QuestionnaireResponse }> => {
  const authClient = createAuthClient();
  
  // Map the questionnaire data to the API format
  const apiQuestionnaireData = {
    // Transform the data if needed
    answers: Object.entries(questionnaireData).map(([key, value]) => ({
      questionId: key,
      answer: typeof value === 'object' ? JSON.stringify(value) : String(value)
    }))
  };
  
  await authClient.post('/survey/submit', apiQuestionnaireData);
  
  return {
    success: true,
    questionnaire: questionnaireData,
  };
};

/**
 * Upload profile photo
 */
export const uploadProfilePhoto = async (photoFile: File): Promise<{ photoUrl: string }> => {
  const authClient = createAuthClient();
  
  const formData = new FormData();
  formData.append('file', photoFile);
  
  await authClient.post('/profile/upload-photo', formData, {
    headers: {}
  });
  
  // The backend might return the URL, but if not, we'll need to refetch the profile
  const updatedProfile = await getProfile();
  
  return {
    photoUrl: updatedProfile.photoUrl || '',
  };
};

/**
 * Delete profile photo
 */
export const deleteProfilePhoto = async (): Promise<boolean> => {
  const authClient = createAuthClient();
  
  await authClient.patch('/profile/delete-profile-photo');
  
  return true;
};
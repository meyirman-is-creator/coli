import {
  ProfileData,
  ProfileUpdateRequest,
  ChangePasswordRequest,
} from "@/types/profile";
import { QuestionnaireResponse } from "@/types/apartment";

// Mock profile data for development
const mockProfile: ProfileData = {
  id: "profile1",
  userId: "user1",
  firstName: "Александр",
  lastName: "Иванов",
  displayName: "Alex",
  bio: "Работаю в IT-компании, люблю спорт и путешествия.",
  gender: "male",
  birthDate: "1995-05-15",
  occupation: "Программист",
  photoUrl: "/api/placeholder/200/200",
  contacts: {
    email: "alex@example.com",
    phone: "+7 (925) 123-45-67",
    telegram: "@alex_example",
  },
  socialMedia: {
    instagram: "alex_example",
    facebook: "alexander.example",
  },
  userStatus: "actively_searching",
  savedFilters: [
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
  ],
  hasQuestionnaire: true,
  createdAt: "2025-01-15T10:30:00Z",
  updatedAt: "2025-04-20T14:45:00Z",
};

/**
 * Get user profile
 */
export const getProfile = async (): Promise<ProfileData> => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 600));

  return { ...mockProfile };
};

/**
 * Update user profile
 */
export const updateProfile = async (
  profileData: ProfileUpdateRequest
): Promise<ProfileData> => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 800));

  // In a real app, this would make a PATCH request to update the profile
  const updatedProfile = {
    ...mockProfile,
    ...profileData,
    updatedAt: new Date().toISOString(),
  };

  return updatedProfile;
};

/**
 * Change user password
 */
export const changePassword = async (
  passwordData: ChangePasswordRequest
): Promise<{ success: boolean; message: string }> => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 700));

  // Check if the current password is correct (for mock purposes)
  if (passwordData.currentPassword !== "password") {
    throw new Error("Текущий пароль указан неверно");
  }

  // Check if the new password and confirmation match
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    throw new Error("Новый пароль и подтверждение не совпадают");
  }

  return {
    success: true,
    message: "Пароль успешно изменен",
  };
};

/**
 * Submit user questionnaire
 */
export const submitQuestionnaire = async (
  questionnaireData: QuestionnaireResponse
): Promise<{ success: boolean; questionnaire: QuestionnaireResponse }> => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 900));
  return {
    success: true,
    questionnaire: {
      id: questionnaireData.id || `questionnaire-${Date.now()}`,
      userId: "user1",
      ...questionnaireData,
    },
  };
};

/**
 * Update user status
 */
export const updateUserStatus = async (
  status: string
): Promise<{ userStatus: string }> => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Validate the status (basic validation)
  const validStatuses = [
    "actively_searching",
    "passively_searching",
    "found_housing",
    "looking_for_roommates",
    "not_looking",
    "landlord",
  ];

  if (!validStatuses.includes(status)) {
    throw new Error("Недопустимый статус пользователя");
  }

  return { userStatus: status };
};

/**
 * Upload profile photo
 */
export const uploadProfilePhoto = async (
  photoFile: File
): Promise<{ photoUrl: string }> => {
  // Simulate API request
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // In a real app, this would upload the file to a storage service
  // For mock purposes, we'll just return a placeholder URL
  return {
    photoUrl: "/api/placeholder/200/200?v=" + Date.now(),
  };
};

/**
 * Get user questionnaire
 */
export const getQuestionnaire =
  async (): Promise<QuestionnaireResponse | null> => {
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Mock questionnaire data
    const mockQuestionnaire: QuestionnaireResponse = {
      id: "questionnaire1",
      userId: "user1",
      lifestyle: {
        smoker: false,
        hasPets: false,
        drinkingHabits: "occasionally",
        diet: "no restrictions",
      },
      preferences: {
        cleanliness: "clean",
        noise: "moderate",
        guestFrequency: "occasionally",
        wakeUpTime: "7:00",
        bedTime: "23:00",
        sharedItems: ["kitchen appliances", "cleaning supplies"],
      },
      habits: {
        workSchedule: "9:00 - 18:00, пн-пт",
        weekendActivity: "active",
        hobbies: ["спорт", "чтение", "путешествия"],
      },
      aboutMe:
        "Ответственный и дружелюбный сосед, уважающий личное пространство других.",
    };

    return mockQuestionnaire;
  };

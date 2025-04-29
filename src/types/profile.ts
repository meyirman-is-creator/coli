import { Gender } from "./index";
import { ApartmentFilter } from "./apartment";

export type ContactInfo = {
  email: string;
  phone?: string;
  telegram?: string;
  whatsapp?: string;
  viber?: string;
};

export type SocialMedia = {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  vk?: string;
};

export type UserStatus =
  | "actively_searching"
  | "passively_searching"
  | "found_housing"
  | "looking_for_roommates"
  | "not_looking"
  | "landlord";

export type ProfileData = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  bio?: string;
  gender?: Gender;
  birthDate?: string;
  occupation?: string;
  photoUrl?: string;
  contacts: ContactInfo;
  socialMedia?: SocialMedia;
  userStatus: UserStatus;
  savedFilters: ApartmentFilter[];
  hasQuestionnaire: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProfileUpdateRequest = Partial<
  Omit<
    ProfileData,
    | "id"
    | "userId"
    | "createdAt"
    | "updatedAt"
    | "savedFilters"
    | "hasQuestionnaire"
  >
>;

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ProfileState = {
  profile: ProfileData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

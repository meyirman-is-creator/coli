import { Gender, ResponseStatus } from "./index";

export type ApartmentFeature =
  | "parking"
  | "pets_allowed"
  | "smoking_allowed"
  | "furnished"
  | "wifi"
  | "air_conditioning"
  | "balcony"
  | "elevator"
  | "washing_machine"
  | "dishwasher";

export type ApartmentType = "apartment" | "house" | "room" | "studio";

export type RentalPeriod = "daily" | "weekly" | "monthly" | "annually";

export type ApartmentLocation = {
  id: string;
  cityId: string;
  cityName: string;
  address: string;
  longitude?: number;
  latitude?: number;
  region: string;
  country: string;
};

export type ApartmentPhoto = {
  id: string;
  url: string;
  isMain: boolean;
  description?: string;
};

export type ApartmentRoommate = {
  id: string;
  userId: string;
  name: string;
  age?: number;
  gender?: Gender;
  occupation?: string;
  questionnaire?: QuestionnaireResponse;
  photoUrl?: string;
};

export type ApartmentOwner = {
  id: string;
  userId: string;
  name: string;
  photoUrl?: string;
  phone?: string;
  email?: string;
  livesInProperty: boolean;
};

export type ApartmentGroup = {
  id: string;
  apartmentId: string;
  creatorId: string;
  maxMembers: number;
  members: ApartmentRoommate[];
  isActive: boolean;
  createdAt: string;
};

export type ApartmentResponse = {
  id: string;
  userId: string;
  apartmentId: string;
  groupId?: string;
  status: ResponseStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
};

export type QuestionnaireResponse = {
  id: string;
  userId: string;
  lifestyle: {
    smoker: boolean;
    hasPets: boolean;
    drinkingHabits: "never" | "occasionally" | "regularly";
    diet?: string;
  };
  preferences: {
    cleanliness: "very_clean" | "clean" | "average" | "relaxed";
    noise: "quiet" | "moderate" | "loud";
    guestFrequency: "never" | "occasionally" | "often";
    wakeUpTime?: string;
    bedTime?: string;
    sharedItems?: string[];
  };
  habits: {
    workSchedule?: string;
    weekendActivity?: string;
    hobbies?: string[];
  };
  aboutMe?: string;
};

export type Apartment = {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  owner: ApartmentOwner;
  type: ApartmentType;
  price: number;
  currency: string;
  deposit?: number;
  rentalPeriod: RentalPeriod;
  location: ApartmentLocation;
  rooms: number;
  bathrooms: number;
  area: number;
  areaMeasurement: "sqm" | "sqft";
  maxOccupants: number;
  availableFrom: string;
  availableUntil?: string;
  features: ApartmentFeature[];
  photos: ApartmentPhoto[];
  currentOccupants: ApartmentRoommate[];
  groups: ApartmentGroup[];
  responses: ApartmentResponse[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
// Update the ApartmentFilter interface to include the additional fields
export type ApartmentFilter = {
  id?: string;
  userId?: string;
  name?: string;
  cityId?: string;
  type?: ApartmentType[];
  priceMin?: number;
  priceMax?: number;
  roomsMin?: number;
  roomsMax?: number;
  areaMin?: number;
  areaMax?: number;
  features?: ApartmentFeature[];
  gender?: Gender;
  availableFrom?: string;
  availableUntil?: string;
  maxOccupants?: number;
  minAge?: number;
  maxAge?: number;
  roommates?: {
    id: number;
    name: string;
  };
  address?: {
    regionId: number | null;
    regionName: string;
    districtId: number | null;
    districtName: string;
    microDistrictId: number | null;
    microDistrictName: string;
  };
  utilitiesIncluded?: boolean;
  forStudents?: boolean;
  badHabitsAllowed?: boolean;
  isNotFirstFloor?: boolean;
  isNotLastFloor?: boolean;
  minFloor?: number;
  maxFloor?: number;
  termType?: string | null;
  savedFilter?: boolean;
};

// Types for the address hierarchy
export interface AddressType {
  id: number;
  parentid?: number;
  namerus: string;
  namekaz?: string;
  haschild: boolean;
}

// Types for gender options
export interface GenderOption {
  id: number;
  namerus: string;
  namekaz?: string;
  code: string;
}

// Types for roommate options
export interface RoommateOption {
  id: number;
  name: string;
}

// Sample data to match what we see in the code
export const genderOptions: GenderOption[] = [
  { id: 1, namerus: "Мужской", namekaz: "Ер", code: "MALE" },
  { id: 2, namerus: "Женский", namekaz: "Әйел", code: "FEMALE" },
  { id: 3, namerus: "Любой", namekaz: "Кез-келген", code: "OTHER" },
];

export const roommateOptions: RoommateOption[] = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5" },
];

// Card type for announcements
export interface Card {
  announcementId: number;
  image: string;
  title: string;
  address: string;
  arriveDate: string;
  roomCount: string;
  selectedGender: string;
  roommates: number;
  cost: number;
  coordsX: string;
  coordsY: string;
  isArchived: boolean;
  consideringOnlyNPeople: boolean;
}

// Response type for API responses
export interface Response<T> {
  data: T;
  message: string | null;
  error: string | null;
  code: number;
}

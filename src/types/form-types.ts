// src/types/form-types.ts

export interface AddressType {
    id: number;
    namerus: string;
    namekaz?: string;
    haschild: boolean;
  }
  
  export interface Resident {
    name: string;
    phones: string[];
  }
  
  export interface FormData {
    // Step 1 - Role
    role: string;
    
    // Step 2 - Basic Info
    title: string;
    gender: string;
    livingInHome: boolean;
    peopleInApartment: string;
    roommates: number;
    ageRange: [number, number];
    
    // Step 3 - Apartment Details
    region: number | null;
    district: number | null;
    microDistrict: number | null;
    address: string;
    moveInDate: string;
    monthlyPayment: string;
    rooms: string;
    deposit: boolean;
    depositAmount: number;
    
    // Step 4 - Additional Details
    apartmentDetails: {
      petsAllowed: boolean;
      utilitiesIncluded: boolean;
      utilitiesAmount: [number, number];
      forStudents: boolean;
      badHabitsAllowed: boolean;
      description: string;
      photos: any[];
      
      // Step 5 - Full Details
      propertyType: string;
      floorsFrom: number;
      floorsTo: number;
      roomSize: number;
      longTerm: boolean;
      ownerName: string;
      ownerPhones: string[];
      residents: Resident[];
    };
    
    // Step 6 - Success
    selectedAdjectives: string[];
  }
  
  export const roleOptions = [
    {
      code: "OWNER",
      name: "Владелец",
      description: "Я владелец квартиры и ищу жильцов"
    },
    {
      code: "RESIDENT",
      name: "Жилец",
      description: "Я уже проживаю в квартире и ищу соседей"
    }
  ];
  
  export const genderOptions = [
    { code: "MALE", namerus: "Мужской" },
    { code: "FEMALE", namerus: "Женский" },
    { code: "OTHER", namerus: "Любой" }
  ];
  
  export const roommateOptions = [
    { id: "1", name: "1" },
    { id: "2", name: "2" },
    { id: "3", name: "3" },
    { id: "4", name: "4" },
    { id: "5+", name: "5+" }
  ];
  
  export const propertyTypeOptions = [
    { id: "apartment", code: "APARTMENT", namerus: "Квартира" },
    { id: "house", code: "HOUSE", namerus: "Дом" },
    { id: "room", code: "ROOM", namerus: "Комната" },
    { id: "studio", code: "STUDIO", namerus: "Студия" }
  ];

  export interface AddressType {
    id: number;
    name: string;
    parentId?: number;
  } 
// import {
//   Apartment,
//   ApartmentFilter,
//   ApartmentGroup,
//   ApartmentResponse,
// } from "@/types/apartment";

// // Mock data for development
// const mockApartments: Apartment[] = [
//   {
//     id: "1",
//     title: "Уютная 2-комнатная квартира в центре",
//     description:
//       "Светлая квартира с современным ремонтом в историческом центре города.",
//     ownerId: "owner1",
//     owner: {
//       id: "owner1",
//       userId: "user1",
//       name: "Алексей Петров",
//       phone: "+7 (123) 456-78-90",
//       email: "owner@example.com",
//       livesInProperty: false,
//     },
//     type: "apartment",
//     price: 65000,
//     currency: "RUB",
//     deposit: 65000,
//     rentalPeriod: "monthly",
//     location: {
//       id: "loc1",
//       cityId: "city1",
//       cityName: "Москва",
//       address: "ул. Арбат, 24",
//       region: "Центральный АО",
//       country: "Россия",
//     },
//     rooms: 2,
//     bathrooms: 1,
//     area: 60,
//     areaMeasurement: "sqm",
//     maxOccupants: 3,
//     availableFrom: "2025-05-01T00:00:00Z",
//     features: ["wifi", "washing_machine", "air_conditioning"],
//     photos: [
//       {
//         id: "photo1",
//         url: "/api/placeholder/800/600",
//         isMain: true,
//         description: "Гостиная",
//       },
//       {
//         id: "photo2",
//         url: "/api/placeholder/800/600",
//         isMain: false,
//         description: "Кухня",
//       },
//     ],
//     currentOccupants: [],
//     groups: [],
//     responses: [],
//     isActive: true,
//     createdAt: "2025-04-01T12:00:00Z",
//     updatedAt: "2025-04-01T12:00:00Z",
//   },
//   {
//     id: "2",
//     title: "Просторная комната в 3-комнатной квартире",
//     description:
//       "Ищем соседа в трехкомнатную квартиру. Комната светлая, с балконом.",
//     ownerId: "owner2",
//     owner: {
//       id: "owner2",
//       userId: "user2",
//       name: "Ирина Смирнова",
//       phone: "+7 (987) 654-32-10",
//       email: "irina@example.com",
//       livesInProperty: true,
//     },
//     type: "room",
//     price: 25000,
//     currency: "RUB",
//     deposit: 25000,
//     rentalPeriod: "monthly",
//     location: {
//       id: "loc2",
//       cityId: "city1",
//       cityName: "Москва",
//       address: "ул. Ленина, 43",
//       region: "Северный АО",
//       country: "Россия",
//     },
//     rooms: 1,
//     bathrooms: 1,
//     area: 18,
//     areaMeasurement: "sqm",
//     maxOccupants: 1,
//     availableFrom: "2025-05-15T00:00:00Z",
//     features: ["wifi", "washing_machine"],
//     photos: [
//       {
//         id: "photo3",
//         url: "/api/placeholder/800/600",
//         isMain: true,
//         description: "Комната",
//       },
//     ],
//     currentOccupants: [
//       {
//         id: "roommate1",
//         userId: "user2",
//         name: "Ирина Смирнова",
//         age: 28,
//         gender: "female",
//         occupation: "Дизайнер",
//       },
//       {
//         id: "roommate2",
//         userId: "user3",
//         name: "Дмитрий Козлов",
//         age: 30,
//         gender: "male",
//         occupation: "Программист",
//       },
//     ],
//     groups: [],
//     responses: [],
//     isActive: true,
//     createdAt: "2025-04-05T15:30:00Z",
//     updatedAt: "2025-04-05T15:30:00Z",
//   },
//   {
//     id: "3",
//     title: "Студия в новом ЖК",
//     description: "Современная студия с панорамными окнами и видом на парк.",
//     ownerId: "owner1",
//     owner: {
//       id: "owner1",
//       userId: "user1",
//       name: "Алексей Петров",
//       phone: "+7 (123) 456-78-90",
//       email: "owner@example.com",
//       livesInProperty: false,
//     },
//     type: "studio",
//     price: 45000,
//     currency: "RUB",
//     deposit: 45000,
//     rentalPeriod: "monthly",
//     location: {
//       id: "loc3",
//       cityId: "city1",
//       cityName: "Москва",
//       address: "Проспект Мира, 120",
//       region: "Восточный АО",
//       country: "Россия",
//     },
//     rooms: 1,
//     bathrooms: 1,
//     area: 30,
//     areaMeasurement: "sqm",
//     maxOccupants: 2,
//     availableFrom: "2025-05-10T00:00:00Z",
//     features: ["parking", "wifi", "air_conditioning", "elevator"],
//     photos: [
//       {
//         id: "photo4",
//         url: "/api/placeholder/800/600",
//         isMain: true,
//         description: "Общий вид",
//       },
//       {
//         id: "photo5",
//         url: "/api/placeholder/800/600",
//         isMain: false,
//         description: "Кухонная зона",
//       },
//     ],
//     currentOccupants: [],
//     groups: [],
//     responses: [],
//     isActive: true,
//     createdAt: "2025-04-10T09:15:00Z",
//     updatedAt: "2025-04-10T09:15:00Z",
//   },
// ];

// /**
//  * Get apartments with optional filtering
//  */
// export const getApartments = async (params?: {
//   filter?: ApartmentFilter;
//   page?: number;
//   limit?: number;
// }) => {
//   // Simulate API request
//   await new Promise((resolve) => setTimeout(resolve, 800));

//   const page = params?.page || 1;
//   const limit = params?.limit || 10;
//   const filter = params?.filter || {};

//   // Apply filters (basic implementation for mockup)
//   let filteredApartments = [...mockApartments];

//   if (filter.cityId) {
//     filteredApartments = filteredApartments.filter(
//       (apt) => apt.location.cityId === filter.cityId
//     );
//   }

//   if (filter.type && filter.type.length > 0) {
//     filteredApartments = filteredApartments.filter((apt) =>
//       filter.type?.includes(apt.type)
//     );
//   }

//   if (filter.priceMin !== undefined) {
//     filteredApartments = filteredApartments.filter(
//       (apt) => apt.price >= (filter.priceMin || 0)
//     );
//   }

//   if (filter.priceMax !== undefined) {
//     filteredApartments = filteredApartments.filter(
//       (apt) => apt.price <= (filter.priceMax || Infinity)
//     );
//   }

//   if (filter.roomsMin !== undefined) {
//     filteredApartments = filteredApartments.filter(
//       (apt) => apt.rooms >= (filter.roomsMin || 0)
//     );
//   }

//   if (filter.roomsMax !== undefined) {
//     filteredApartments = filteredApartments.filter(
//       (apt) => apt.rooms <= (filter.roomsMax || Infinity)
//     );
//   }

//   if (filter.features && filter.features.length > 0) {
//     filteredApartments = filteredApartments.filter((apt) =>
//       filter.features?.every((feature) => apt.features.includes(feature))
//     );
//   }

//   // Pagination
//   const start = (page - 1) * limit;
//   const end = start + limit;
//   const paginatedApartments = filteredApartments.slice(start, end);

//   return {
//     items: paginatedApartments,
//     pagination: {
//       page,
//       limit,
//       total: filteredApartments.length,
//       totalPages: Math.ceil(filteredApartments.length / limit),
//     },
//   };
// };

// /**
//  * Get apartment by ID
//  */
// export const getApartmentById = async (id: string) => {
//   // Simulate API request
//   await new Promise((resolve) => setTimeout(resolve, 500));

//   const apartment = mockApartments.find((apt) => apt.id === id);

//   if (!apartment) {
//     throw new Error("Apartment not found");
//   }

//   return apartment;
// };

// /**
//  * Get user's apartments
//  */
// export const getMyApartments = async () => {
//   // Simulate API request
//   await new Promise((resolve) => setTimeout(resolve, 600));

//   // For mockup, assuming user1 is the current user
//   return mockApartments.filter((apt) => apt.owner.userId === "user1");
// };

// /**
//  * Create new apartment
//  */
// export const createApartment = async (apartmentData: Partial<Apartment>) => {
//   // Simulate API request
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   // Creating a new apartment with mock data + provided data
//   const newApartment: Apartment = {
//     id: `new-${Date.now()}`,
//     title: apartmentData.title || "Новое объявление",
//     description: apartmentData.description || "",
//     ownerId: "owner1", // Mocked owner ID
//     owner: {
//       id: "owner1",
//       userId: "user1",
//       name: "Алексей Петров",
//       phone: "+7 (123) 456-78-90",
//       email: "owner@example.com",
//       livesInProperty: false,
//     },
//     type: apartmentData.type || "apartment",
//     price: apartmentData.price || 0,
//     currency: apartmentData.currency || "RUB",
//     deposit: apartmentData.deposit,
//     rentalPeriod: apartmentData.rentalPeriod || "monthly",
//     location: apartmentData.location || {
//       id: `loc-${Date.now()}`,
//       cityId: "city1",
//       cityName: "Москва",
//       address: "",
//       region: "",
//       country: "Россия",
//     },
//     rooms: apartmentData.rooms || 0,
//     bathrooms: apartmentData.bathrooms || 0,
//     area: apartmentData.area || 0,
//     areaMeasurement: apartmentData.areaMeasurement || "sqm",
//     maxOccupants: apartmentData.maxOccupants || 1,
//     availableFrom: apartmentData.availableFrom || new Date().toISOString(),
//     availableUntil: apartmentData.availableUntil,
//     features: apartmentData.features || [],
//     photos: apartmentData.photos || [],
//     currentOccupants: apartmentData.currentOccupants || [],
//     groups: [],
//     responses: [],
//     isActive: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   };

//   return newApartment;
// };

// /**
//  * Update existing apartment
//  */
// export const updateApartment = async (
//   id: string,
//   apartmentData: Partial<Apartment>
// ) => {
//   // Simulate API request
//   await new Promise((resolve) => setTimeout(resolve, 800));

//   const apartmentIndex = mockApartments.findIndex((apt) => apt.id === id);

//   if (apartmentIndex === -1) {
//     throw new Error("Apartment not found");
//   }

//   // For the mock, we'll just return the updated data
//   const updatedApartment = {
//     ...mockApartments[apartmentIndex],
//     ...apartmentData,
//     updatedAt: new Date().toISOString(),
//   };

//   return updatedApartment;
// };

// /**
//  * Delete apartment
//  */
// export const deleteApartment = async (id: string) => {
//   // Simulate API request
//   await new Promise((resolve) => setTimeout(resolve, 600));

//   const apartmentIndex = mockApartments.findIndex((apt) => apt.id === id);

//   if (apartmentIndex === -1) {
//     throw new Error("Apartment not found");
//   }

//   // In a real app, we would delete from the database
//   // Here we'll just return success
//   return true;
// };

// /**
//  * Create apartment response (application to join or create a group)
//  */
// export const createApartmentResponse = async (
//   apartmentId: string,
//   groupId?: string,
//   message?: string
// ) => {
//   // Simulate API request
//   await new Promise((resolve) => setTimeout(resolve, 700));

//   // Checking if apartment exists
//   const apartment = mockApartments.find((apt) => apt.id === apartmentId);

//   if (!apartment) {
//     throw new Error("Apartment not found");
//   }

//   // Create a mock response
//   const newResponse: ApartmentResponse = {
//     id: `resp-${Date.now()}`,
//     userId: "user1", // Assuming current user
//     apartmentId,
//     groupId,
//     status: "pending",
//     message,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   };

//   return newResponse;
// };

// /**
//  * Get user's responses (applications)
//  */
// export const getMyResponses = async () => {
//   // Simulate API request
//   await new Promise((resolve) => setTimeout(resolve, 500));

//   // Mock data for responses
//   const mockResponses: ApartmentResponse[] = [
//     {
//       id: "resp1",
//       userId: "user1",
//       apartmentId: "2",
//       status: "pending",
//       createdAt: "2025-04-15T10:30:00Z",
//       updatedAt: "2025-04-15T10:30:00Z",
//     },
//     {
//       id: "resp2",
//       userId: "user1",
//       apartmentId: "3",
//       status: "accepted",
//       createdAt: "2025-04-10T14:45:00Z",
//       updatedAt: "2025-04-11T09:15:00Z",
//     },
//   ];

//   return mockResponses;
// };

// /**
//  * Get apartment groups
//  */
// export const getApartmentGroups = async (apartmentId: string) => {
//   // Simulate API request
//   await new Promise((resolve) => setTimeout(resolve, 600));

//   // Mock data for groups
//   const mockGroups: ApartmentGroup[] = [
//     {
//       id: "group1",
//       apartmentId: "2",
//       creatorId: "user3",
//       maxMembers: 3,
//       members: [
//         {
//           id: "roommate2",
//           userId: "user3",
//           name: "Дмитрий Козлов",
//           age: 30,
//           gender: "male",
//           occupation: "Программист",
//         },
//       ],
//       isActive: true,
//       createdAt: "2025-04-08T16:20:00Z",
//     },
//   ];

//   return mockGroups.filter((group) => group.apartmentId === apartmentId);
// };

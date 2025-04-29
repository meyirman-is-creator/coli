import { AddressType } from "@/types/common";

// Function to fetch addresses based on parent ID
export const getAddresses = async (parentId: number) => {
  try {
    // Simulate API request for now
    const response = await fetch(`/api/address/get-children/${parentId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch addresses");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while fetching addresses"
    );
  }
};

// Function to search announcements with filter parameters
export const searchAnnouncements = async (params: Record<string, string>) => {
  try {
    // Construct query string from params
    const queryString = new URLSearchParams(params).toString();

    // Simulate API request
    const response = await fetch(`/api/announcement/all?${queryString}`);

    if (!response.ok) {
      throw new Error("Failed to search announcements");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while searching announcements"
    );
  }
};

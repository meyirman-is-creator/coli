import { Card, Response } from "@/types/common";

// Function to search announcements with filter parameters
export const searchAnnouncements = async (
  params: Record<string, string>
): Promise<Response<{ page: number; announcements: Card[] }>> => {
  try {
    // Construct query string from params
    const queryString = new URLSearchParams(params).toString();

    // Make API request
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

// Function to get great deals
export const getGreatDeals = async (): Promise<Response<Card[]>> => {
  try {
    // Make API request
    const response = await fetch("/api/announcement/great-deals");

    if (!response.ok) {
      throw new Error("Failed to fetch great deals");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while fetching great deals"
    );
  }
};

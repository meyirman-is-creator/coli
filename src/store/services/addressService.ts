import { AddressType } from "@/types/common";
import { createAuthClient } from "@/utils/api-client";

// Function to fetch addresses based on parent ID
export const getAddresses = async (parentId: number): Promise<AddressType[]> => {
  const authClient = createAuthClient();
  
  try {
    const response = await authClient.get<AddressType[]>(`/address/get-children/${parentId}`);
    return response;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while fetching addresses"
    );
  }
};
import apiClient from "../api/client";
const baseUrl = "/profiles";

/**
 * Fetches the current user's profile from backend
 */
export const getProfile = async () => {
    try {
        const response = await apiClient.get(baseUrl);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch profile:", error);
        throw error; // Let components handle errors
    }
};

export const createProfile = async (associationName: string) => {
    try {
        const response = await apiClient.post(baseUrl, {
            name: associationName, // Send name instead of ID
        });
        console.log("createProfile", response);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Request failed",
        };
    }
};

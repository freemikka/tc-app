import apiClient from "../api/client";
const baseUrl = "/positions";

export const getAllPositions = async () => {
    try {
        const response = await apiClient.get(baseUrl);
        return response.data;
    } catch (error) {
        console.error("Error fetching positions:", error);
        throw error;
    }
};

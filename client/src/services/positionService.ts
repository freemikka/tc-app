import apiClient from "../api/client";
const baseUrl = "/positions";

export const getAllPositions = async () => {
    try {
        const response = await apiClient.get(baseUrl);
        console.log("getAllPositions ", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching positions:", error);
        throw error;
    }
};

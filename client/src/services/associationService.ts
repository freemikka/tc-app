import apiClient from "../api/client";
const baseUrl = "/associations";

export const getAllAssociations = async () => {
    try {
        const { data } = await apiClient.get(baseUrl);
        return data;
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, message: error.message };
        }
        return { success: false, message: "Unknown error occurred" };
    }
};

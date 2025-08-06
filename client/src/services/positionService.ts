import apiClient from "../api/client";
import { Position } from "../types/types";

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

export const createPosition = async (newPosition: Position) => {
    try {
        const response = await apiClient.post<Position>(baseUrl, newPosition);
        return response.data;
    } catch (error) {
        console.error("Error posting positions:", error);
        throw error;
    }
};

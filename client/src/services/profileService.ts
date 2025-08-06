import apiClient from "../api/client";
import axios from "axios";
import { Association } from "../types/types";
const baseUrl = "/profiles";

/**
 * Fetches the current user's profile from backend
 */
export const getProfile = async () => {
    try {
        const response = await apiClient.get(baseUrl);
        return response.data;
    } catch (error) {
        throw error; // Let components handle errors
    }
};

export const createProfile = async (userId: string) => {
    try {
        const response = await apiClient.post(baseUrl, { userId: userId });
        return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // This will trigger useMutation's onError!
            throw new Error(error.response?.data?.message || "Request failed");
        } else {
            throw new Error("Unknown error occurred");
        }
    }
};

export const updateProfile = async (association: Association) => {
    try {
        const response = await apiClient.put(baseUrl, association);
        return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // This will trigger useMutation's onError!
            throw new Error(error.response?.data?.message || "Request failed");
        } else {
            throw new Error("Unknown error occurred");
        }
    }
};

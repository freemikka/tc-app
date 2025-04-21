import apiClient from "../api/client";
import { Association } from "../types/types";
import axios from "axios";
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

export const getAllAssociationJoinRequests = async () => {
    try {
        const { data } = await apiClient.get(`${baseUrl}/join-requests`);
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.error || "Request failed");
        } else {
            throw new Error("Unknown error");
        }
    }
};

export const createAssociation = async (newAssociation: Association) => {
    try {
        const { data } = await apiClient.post(baseUrl, newAssociation);
        return data;
    } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
            console.log("here: ", error);
            // This will trigger useMutation's onError!
            throw new Error(error.response?.data?.message || "Request failed");
        } else {
            throw new Error("Unknown error occurred");
        }
    }
};

export const createAssociationJoinRequest = async (
    newAssociation: Association
) => {
    try {
        const { data } = await apiClient.post(
            `${baseUrl}/request`,
            newAssociation
        );
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.error || "Request failed");
        } else {
            throw new Error("Unknown error occurred");
        }
    }
};

import apiClient from "../api/client";
import { TrainingGroupWithPlayers, trainingGroup } from "../types/types";
import { mapTrainingGroupWithPlayers } from "../utils/mapper";
const baseUrl = "/training-groups";

export const getAllTrainingGroups = async () => {
    try {
        const response = await apiClient.get(baseUrl);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch profile:", error);
        throw error; // Let components handle errors
    }
};

export const getTrainingGroupsWithPlayers = async (
    gender: string
): Promise<TrainingGroupWithPlayers[]> => {
    const response = await apiClient.get(`${baseUrl}/with-players/${gender}`);
    return response.data.map(mapTrainingGroupWithPlayers);
};

export const createTrainingGroup = async (newTrainingGroup: trainingGroup) => {
    const response = await apiClient.post<trainingGroup>(
        baseUrl,
        newTrainingGroup
    );
    return response.data;
};

// const update = (id, newObject) => {
//   const request = axios.put(`${baseUrl}/${id}`, newObject);
//   return request.then((response) => response.data);
// };

export const deleteTrainingGroup = async (id: string) => {
    const response = await apiClient.delete(`${baseUrl}/${id}`);
    return response.data;
};

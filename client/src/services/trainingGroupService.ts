import apiClient from "../api/client";
import trainingGroup from "../types/types";
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

export const getTrainingGroupsWithPlayers = async (gender: string) => {
    const response = await apiClient.get(`${baseUrl}/with-players/${gender}`);
    return response.data;
};

export const createTrainingGroup = async (newTrainingGroup: trainingGroup) => {
    console.log("createTrainingGroup");
    const response = await apiClient.post<trainingGroup>(
        baseUrl,
        newTrainingGroup
    );
    return response.data;
};

// export const getTeamsWithPlayers = async (gender: string) => {
//     const response = await apiClient.get(`${baseUrl}/with-players/${gender}`);
//     return response.data;
// };

// const update = (id, newObject) => {
//   const request = axios.put(`${baseUrl}/${id}`, newObject);
//   return request.then((response) => response.data);
// };

// export const deleteTeam = async (id: string) => {
//     const response = await apiClient.delete(`${baseUrl}/${id}`);
//     return response.data;
// };

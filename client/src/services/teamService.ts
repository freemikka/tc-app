import Team from "../types/types";
import apiClient from "../api/client";
const baseUrl = "/teams";

export const getAllTeams = async () => {
    try {
        const response = await apiClient.get(baseUrl);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch profile:", error);
        throw error; // Let components handle errors
    }
};

export const createTeam = async (newTeam: Team) => {
    const response = await apiClient.post<Team>(baseUrl, newTeam);
    return response.data;
};

export const getTeamsWithPlayers = async () => {
    const response = await apiClient.get(`${baseUrl}/with-players`);
    return response.data;
};

// const update = (id, newObject) => {
//   const request = axios.put(`${baseUrl}/${id}`, newObject);
//   return request.then((response) => response.data);
// };

// const deletePerson = (id) => {
//   const request = axios.delete(`${baseUrl}/${id}`);
//   return request.then((response) => response.data);
// };

import { Team } from "../types/types";
import { TeamWithPlayers } from "../types/types";
import { mapTeamWithPlayers } from "../utils/mapper";
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

export const getTeamsWithPlayers = async (
    gender: string
): Promise<TeamWithPlayers[]> => {
    const response = await apiClient.get(`${baseUrl}/with-players/${gender}`);
    return response.data.map(mapTeamWithPlayers);
};

// const update = (id, newObject) => {
//   const request = axios.put(`${baseUrl}/${id}`, newObject);
//   return request.then((response) => response.data);
// };

export const deleteTeam = async (id: string) => {
    const response = await apiClient.delete(`${baseUrl}/${id}`);
    return response.data;
};

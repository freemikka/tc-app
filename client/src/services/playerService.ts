import Player from "../types/types";
import apiClient from "../api/client";
const baseUrl = "/players";

export const getAllPlayers = async () => {
    try {
        const response = await apiClient.get(baseUrl);
        console.log("getAllPlayers ", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching players:", error);
        throw error;
    }
};

export const createPlayer = async (newPlayer: Player) => {
    console.log("createPlayer", newPlayer);
    const response = await apiClient.post<Player>(baseUrl, newPlayer);
    return response.data;
};

export const updatePlayerTeam = async (playerId: string, teamId: number) => {
    const response = await apiClient.put(baseUrl, {
        playerId: playerId,
        teamId: teamId,
    });
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

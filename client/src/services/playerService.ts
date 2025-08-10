import { Player } from "../types/types";
import apiClient from "../api/client";
const baseUrl = "/players";

export const getAllPlayers = async () => {
    try {
        const response = await apiClient.get(baseUrl);
        return response.data;
    } catch (error) {
        console.error("Error fetching players:", error);
        throw error;
    }
};

export const createPlayer = async (newPlayer: Player) => {
    const response = await apiClient.post<Player>(baseUrl, newPlayer);
    return response.data;
};

export const updatePlayerTeam = async (playerId: string, teamId: number) => {
    const response = await apiClient.put(`${baseUrl}/team`, {
        playerId: playerId,
        teamId: teamId,
    });
    return response.data;
};

export const updatePlayerTrainingGroup = async (
    playerId: string,
    trainingGroupId: number
) => {
    const response = await apiClient.put(`${baseUrl}/training-group`, {
        playerId: playerId,
        trainingGroupId: trainingGroupId,
    });
    return response.data;
};

export const updatePlayerPosition = async ({
    playerId,
    newPositionId,
}: {
    playerId: string;
    newPositionId: number;
}) => {
    const response = await apiClient.put(`${baseUrl}/${playerId}/position`, {
        newPositionId: newPositionId,
    });
    return response.data;
};

export const deletePlayer = async (id: string) => {
    const response = await apiClient.delete(`${baseUrl}/${id}`);
    return response.data;
};

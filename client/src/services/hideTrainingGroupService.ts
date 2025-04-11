import apiClient from "../api/client";
const baseUrl = "/hidden-training-groups";

export const getAllHiddenTrainingGroups = async (gender: string) => {
    try {
        const response = await apiClient.get(`${baseUrl}/${gender}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch hidden teams:", error);
        throw error; // Let components handle errors
    }
};

export const createHiddenTrainingGroup = async (trainingGroupId: number) => {
    const response = await apiClient.post(baseUrl, {
        trainingGroupId: trainingGroupId,
    });
    return response.data;
};

// export const getTeamsWithPlayers = async () => {
//     const response = await apiClient.get(`${baseUrl}/with-players`);
//     return response.data;
// };

// const update = (id, newObject) => {
//   const request = axios.put(`${baseUrl}/${id}`, newObject);
//   return request.then((response) => response.data);
// };

export const deleteHiddenTrainingGroup = async (id: string) => {
    const response = await apiClient.delete(`${baseUrl}/${id}`);
    return response.data;
};

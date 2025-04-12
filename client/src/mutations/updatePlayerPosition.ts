import { updatePlayerPosition } from "../services/playerService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdatePlayerPosition = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePlayerPosition,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["trainingGroupsWithPlayers"],
            });

            queryClient.invalidateQueries({
                queryKey: ["teamsWithPlayers"],
            });
        },
        onError: (err) => {
            console.error("Failed to update player position:", err.message);
        },
    });
};

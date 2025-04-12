import { deletePlayer } from "../services/playerService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeletePlayer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deletePlayer(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["trainingGroupsWithPlayers"],
            });

            queryClient.invalidateQueries({
                queryKey: ["teamsWithPlayers"],
            });
        },
        onError: (err) => {
            console.error(
                "Failed to delete hidden training group:",
                err.message
            );
        },
    });
};

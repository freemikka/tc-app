import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeam } from "../services/teamService";

export const useCreateTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTeam,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["teamsWithPlayers", ["teams"]],
            });
        },
        onError: (err) => {
            console.error("Failed creating team:", err.message);
        },
    });
};

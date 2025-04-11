import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHiddenTeam } from "../services/hideTeamService";

export const useCreateHiddenTeam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (teamId: number) => createHiddenTeam(teamId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teamsHidden"] });
        },
        onError: (err) => {
            console.error("Failed creating player:", err.message);
        },
    });
};

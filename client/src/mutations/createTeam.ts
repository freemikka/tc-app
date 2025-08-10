import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeam } from "../services/teamService";
import { toast } from "sonner";

export const useCreateTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTeam,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["teamsWithPlayers", "trainingGroupWithPlayers"],
            });
            toast.success("Created a new team");
        },
        onError: (err: any) => {
            toast.error(
                `Failed creating team: ${
                    err.response?.data?.error ?? "Unknown error"
                }`
            );
        },
    });
};

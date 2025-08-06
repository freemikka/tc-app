import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlayer } from "../services/playerService";
import { toast } from "sonner";
export const useCreatePlayer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPlayer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teamsWithPlayers"] });
            toast.success("Created new player!");
        },
        onError: (error) => {
            console.error("Failed creating player:", error.message);
            toast.error(
                `Error: ${error.message} Call your local webcie member..`
            );
        },
    });
};

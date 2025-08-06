import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlayer } from "../services/playerService";

export const useCreatePlayer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPlayer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["players"] });
        },
        onError: (error) => {
            console.error("Failed creating player:", error.message);
        },
    });
};

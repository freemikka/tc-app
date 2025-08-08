import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrainingGroup } from "../services/trainingGroupService";

export const useCreateTrainingGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTrainingGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["trainingGroupsWithPlayers", "trainingGroups"],
            });
        },
        onError: (err) => {
            console.error("Failed creating team:", err.message);
        },
    });
};

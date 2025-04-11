import { deleteTrainingGroup } from "../services/trainingGroupService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteTrainingGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (trainingGroupId: string) =>
            deleteTrainingGroup(trainingGroupId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["trainingGroupsWithPlayers"],
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

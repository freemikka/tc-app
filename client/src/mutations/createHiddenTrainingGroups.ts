import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHiddenTrainingGroup } from "../services/hideTrainingGroupService";

export const useCreateHiddenTrainingGroups = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (trainingGroupId: number) =>
            createHiddenTrainingGroup(trainingGroupId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["trainingGroupsHidden"],
            });
        },
        onError: (err) => {
            console.error("Failed hiding training group:", err.message);
        },
    });
};

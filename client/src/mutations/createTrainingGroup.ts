import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrainingGroup } from "../services/trainingGroupService";
import { toast } from "sonner";

export const useCreateTrainingGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTrainingGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["trainingGroupsWithPlayers"],
            });
            toast.success("Created training group");
        },
        onError: (err) => {
            console.error("Failed creating team:", err.message);
        },
    });
};

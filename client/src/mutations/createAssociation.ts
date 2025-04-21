import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAssociation } from "../services/associationService";
import { toast } from "sonner";

export const useCreateAssociation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAssociation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["associations"] });
            toast.success("Association created!");
        },
        onError: (err) => {
            toast.error(`Error: ${err.message}`);
        },
    });
};

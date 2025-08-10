import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteJoinAssociationRequest } from "@/services/associationService";

export const useDeleteJoinAssociationRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteJoinAssociationRequest,
        onSuccess: () => {},
        onError: (err) => {},
    });
};

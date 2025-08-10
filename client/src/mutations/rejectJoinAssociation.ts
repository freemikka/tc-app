import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectAssociationJoinRequest } from "../services/associationService";
import { toast } from "sonner";

export const useRejectAssociation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rejectAssociationJoinRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["associationJoinRequests"],
            });
            toast.success("Rejected!");
        },
        onError: (err: any) => {
            toast.error(`Error: ${err.message}`);
        },
    });
};

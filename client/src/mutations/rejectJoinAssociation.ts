import { useMutation } from "@tanstack/react-query";
import { rejectAssociationJoinRequest } from "../services/associationService";
import { toast } from "sonner";

export const useRejectAssociation = () => {
    return useMutation({
        mutationFn: rejectAssociationJoinRequest,
        onSuccess: () => {
            toast.success("Rejected!");
        },
        onError: (err: any) => {
            toast.error(`Error: ${err.message}`);
        },
    });
};

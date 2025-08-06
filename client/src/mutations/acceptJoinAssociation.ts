import { useMutation } from "@tanstack/react-query";
import { acceptAssociationJoinRequest } from "../services/associationService";
import { AcceptRequestData } from "@/types/types";
import { toast } from "sonner";

export const useAcceptAssociation = () => {
    return useMutation({
        mutationFn: (accept: AcceptRequestData) =>
            acceptAssociationJoinRequest(accept),
        onSuccess: () => {
            toast.success("Accepted!");
        },
        onError: (err: any) => {
            toast.error(`Error: ${err.message}`);
        },
    });
};

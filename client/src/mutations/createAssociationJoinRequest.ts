import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAssociationJoinRequest } from "../services/associationService";
import toast from "react-hot-toast";

export const useJoinAssociationRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAssociationJoinRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast.success("Sending a join request!");
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });
};

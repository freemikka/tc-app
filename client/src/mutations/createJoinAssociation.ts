import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../services/profileService";
import toast from "react-hot-toast";

export const useJoinAssociation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast.success("Trying to join association!");
        },
        onError: () => {
            toast.error("Failed to join association!");
        },
    });
};

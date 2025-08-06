import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPosition } from "../services/positionService";
import { toast } from "sonner";

export const useCreatePosition = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPosition,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["positions"],
            });
            toast.success("Position created!");
        },
        onError: (err) => {
            console.log(err);
            toast.error(`Error: ${err.message}`);
        },
    });
};

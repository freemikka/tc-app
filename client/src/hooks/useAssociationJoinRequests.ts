import { useQuery } from "@tanstack/react-query";
import { getAssociationJoinRequests } from "@/services/associationService";

export const useAssociationJoinRequests = (userId: string, options: any) => {
    return useQuery({
        queryKey: ["associationJoinRequests"],
        queryFn: () => getAssociationJoinRequests(userId),
        enabled: !!userId && (options.enabled ?? true), // support external enabled
        ...options,
    });
};

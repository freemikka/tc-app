import { useQuery } from "@tanstack/react-query";
import { getAllPositions } from "../services/positionService";

export const usePositions = () => {
    return useQuery({
        queryKey: ["positions"],
        queryFn: getAllPositions,
    });
};

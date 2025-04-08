import { useQuery } from "@tanstack/react-query";
import { getAllTrainingGroups } from "../services/trainingGroupService";

export const useTrainingGroups = () => {
    return useQuery({
        queryKey: ["trainingGroups"],
        queryFn: getAllTrainingGroups,
    });
};

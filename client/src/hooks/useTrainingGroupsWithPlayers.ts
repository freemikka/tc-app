import { useQuery } from "@tanstack/react-query";
import { getTrainingGroupsWithPlayers } from "../services/trainingGroupService";

export const useTrainingGroupsWithPlayers = (gender: string) => {
    return useQuery({
        queryKey: ["trainingGroupsWithPlayers"],
        queryFn: () => getTrainingGroupsWithPlayers(gender),
    });
};

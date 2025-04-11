import { useQuery } from "@tanstack/react-query";
import { getAllHiddenTrainingGroups } from "../services/hideTrainingGroupService";

export const useTrainingGroupsHidden = (gender: string) => {
    return useQuery({
        queryKey: ["trainingGroupsHidden"],
        queryFn: () => getAllHiddenTrainingGroups(gender),
    });
};

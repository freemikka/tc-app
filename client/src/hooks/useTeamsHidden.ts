import { useQuery } from "@tanstack/react-query";
import { getAllHiddenTeams } from "../services/hideTeamService";

export const useTeamsHidden = (gender: string) => {
    return useQuery({
        queryKey: ["teamsHidden"],
        queryFn: () => getAllHiddenTeams(gender),
    });
};

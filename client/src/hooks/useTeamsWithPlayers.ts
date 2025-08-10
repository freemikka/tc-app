import { useQuery } from "@tanstack/react-query";
import { getTeamsWithPlayers } from "../services/teamService";

export const useTeamsWithPlayers = (gender: string) => {
    return useQuery({
        queryKey: ["teamsWithPlayers", gender],
        queryFn: () => getTeamsWithPlayers(gender),
    });
};

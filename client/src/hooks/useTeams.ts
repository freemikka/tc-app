import { useQuery } from "@tanstack/react-query";
import { getAllTeams } from "../services/teamService";

export const useTeams = () => {
    return useQuery({
        queryKey: ["teams"],
        queryFn: getAllTeams,
    });
};

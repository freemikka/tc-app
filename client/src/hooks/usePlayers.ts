import { useQuery } from "@tanstack/react-query";
import { getAllPlayers } from "../services/playerService";

export const usePlayers = () => {
    return useQuery({
        queryKey: ["players"],
        queryFn: getAllPlayers,
    });
};

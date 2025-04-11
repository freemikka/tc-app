import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../services/profileService";

export const useProfile = () => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
    });
};

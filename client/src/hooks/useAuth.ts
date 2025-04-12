import { useQuery } from "@tanstack/react-query";
import supabase from "../utils/supabase";

// Fetch user session from Supabase
const fetchUserSession = async () => {
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        console.log(data);
        return data.session; // Return the entire session object
    } catch (err) {
        console.error("Error fetching session:", err);
        return null;
    }
};

export const useAuth = () => {
    return useQuery({
        queryKey: ["authSession"],
        queryFn: fetchUserSession,
        retry: false,
        refetchOnWindowFocus: false,
        // staleTime: Infinity,
        // gcTime: 1000 * 60 * 60, // Consider caching the result for 5 minutes
    });
};

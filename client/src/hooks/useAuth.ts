import { useQuery } from "@tanstack/react-query";
import supabase from "../utils/supabase"; // Import your supabase client

// Fetch user session from Supabase
const fetchUserSession = async () => {
    try {
        const { data, error } = await supabase.auth.getSession();
        console.log("data: ", data);
        return data.session?.user || null; // Return the user object or null
    } catch (err) {
        console.log("Error logging in", err);
        return null;
    }
};

export const useAuth = () => {
    return useQuery({
        queryKey: ["authSession"],
        queryFn: fetchUserSession,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

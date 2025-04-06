import { useQuery } from "@tanstack/react-query";
import supabase from "../utils/supabase"; // Import your supabase client

// Fetch user session from Supabase
const fetchUserSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    console.log("data: ", data);
    return data.session?.user || null; // Return the user object or null
};

export const useAuth = () => {
    return useQuery({
        queryKey: ["authSession"],
        queryFn: fetchUserSession,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

// useQuery({
//     queryKey: ["players"],
//     queryFn: getAllPlayers,
// });

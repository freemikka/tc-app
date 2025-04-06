import supabase from "../utils/supabase"; // Import your supabase client
import apiClient, { setAuthToken } from "../api/client";

export const loginUser = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        const token = data.session?.access_token;

        return {
            success: true,
            session: data.session, // Contains user info and tokens
            token: token, // The JWT access token
        };

        return { success: true }; // Indicate success
    } catch (error) {
        if (error instanceof Error)
            return { success: false, message: error.message }; // Return error message
    }
};

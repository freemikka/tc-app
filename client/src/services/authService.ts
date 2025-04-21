import supabase from "../utils/supabase"; // Import your supabase client

export const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    return error;
};

import supabase from "../utils/supabase"; // Import your supabase client

export const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    console.log("signout: ", error);
    return error;
};

import supabase from "../utils/supabase"; // Import your supabase client

export const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    return error;
};

export const changePassword = async ({
    newPassword,
}: {
    currentPassword: string;
    newPassword: string;
}) => {
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) {
        throw error;
    }

    return data;
};

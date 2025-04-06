import supabase from "../supabase/supabase.js";
export const associationMiddleware = async (req, res, next) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) {
            return res
                .status(401)
                .json({ error: "Unauthorized: User ID missing" });
        }
        // Query Supabase's `profiles` table
        const { data: profile, error } = await supabase
            .from("Profiles")
            .select("*")
            .eq("user_id", user_id)
            .single(); // Ensure we get a single record
        if (error) {
            console.error("Supabase error:", error);
            return res.status(500).json({ error: "Database error" });
        }
        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }
        // Attach association_id to the request
        req.association_id = profile.association_id;
        next();
    }
    catch (error) {
        console.error("Error in associationMiddleware:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

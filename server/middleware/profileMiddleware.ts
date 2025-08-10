import { Request, Response, NextFunction } from "express";
import supabase from "../supabase/supabase.js";

declare global {
    namespace Express {
        interface Request {
            user?: import("@supabase/supabase-js").User;
            association_id: number;
        }
    }
}

export const profileMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) {
            return res
                .status(401)
                .json({ error: "Unauthorized: User ID missing" });
        }

        // Query Supabase's `associations` table
        const { data: profile, error } = await supabase
            .from("Profiles")
            .select("*")
            .eq("user_id", user_id)
            .single(); // Ensure we get a single record

        if (error) {
            console.error("Supabase error:", error);
            return res.status(500).json({ error: "Database error" });
        }

        console.log(profile);

        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        // Attach association_id to the request
        req.association_id = profile.association_id;
        console.log("PROFILE");
        next();
    } catch (error) {
        console.error("Error in profileMiddleware:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

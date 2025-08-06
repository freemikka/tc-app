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

export const associationMiddleware = async (
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

        if (!req.body) {
            return res
                .status(401)
                .json({ error: "No association name in request" });
        }

        // Query Supabase's `associations` table
        const { data: association, error } = await supabase
            .from("Associations")
            .select("*")
            .ilike("name", req.body.name)
            .single(); // Ensure we get a single record

        if (error) {
            console.error("Supabase error:", error);
            return res.status(500).json({ error: "Database error" });
        }

        if (!association) {
            return res.status(404).json({ error: "Association not found" });
        }

        // Attach association_id to the request
        req.association_id = association.id;
        next();
    } catch (error) {
        console.error("Error in associationMiddleware:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

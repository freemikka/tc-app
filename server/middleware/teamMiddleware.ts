import { Request, Response, NextFunction } from "express";
import supabase from "../supabase/supabase.js";

declare global {
    namespace Express {
        interface Request {
            user?: import("@supabase/supabase-js").User;
            association_id: number;
            team_id: number;
        }
    }
}

export const teamMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const association_id = req.association_id;
        const team_name = req.body.team;

        // Query Supabase's `profiles` table
        const { data: team, error } = await supabase
            .from("Teams")
            .select("*")
            .eq("association_id", association_id)
            .eq("name", team_name)
            .single(); // Ensure we get a single record

        if (error) {
            console.error("Supabase error:", error);
            return res.status(500).json({ error: "Database error" });
        }

        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }

        // Attach association_id to the request
        req.team_id = team.id;
        console.log("TEAM");
        next();
    } catch (error) {
        console.error("Error in associationMiddleware:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

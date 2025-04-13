import { Request, Response, NextFunction } from "express";
import supabase from "../supabase/supabase.js";

declare global {
    namespace Express {
        interface Request {
            user?: import("@supabase/supabase-js").User;
            association_id: number;
            team_id: number;
            traininggroup_id: number;
        }
    }
}

export const trainingGroupMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const association_id = req.association_id;
        const trainingGroupName = req.body.trainingGroup;

        // Query Supabase's `profiles` table
        const { data: trainingGroup, error } = await supabase
            .from("TrainingGroups")
            .select("*")
            .eq("association_id", association_id)
            .eq("name", trainingGroupName)
            .single(); // Ensure we get a single record

        if (error) {
            console.error("Supabase error:", error);
            return res.status(500).json({ error: "Database error" });
        }

        if (!trainingGroup) {
            return res.status(404).json({ error: "Training roup not found" });
        }

        // Attach association_id to the request
        req.traininggroup_id = trainingGroup.id;
        next();
    } catch (error) {
        console.error("Error in trainingGroupMiddleware:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

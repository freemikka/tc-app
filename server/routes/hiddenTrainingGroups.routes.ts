import express, { Router, Request } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { associationMiddleware } from "../middleware/associationMiddleware.js";
import { TeamWithPlayers } from "../types/types.js";
import supabase from "../supabase/supabase.js";
const baseUrl = "/hidden-training-groups";

const router: Router = express.Router();

router.get(
    `${baseUrl}/:gender`,
    authMiddleware, // Ensures req.user.id exists
    associationMiddleware, // Ensures req.association_id exists
    async (req: Request, res) => {
        const gender = req.params.gender;
        const association_id = req.association_id;
        const user_id = req.user?.id;
        try {
            const { data: trainingGroups, error } = await supabase
                .from("HiddenTrainingGroups")
                .select(
                    `*,
                    TrainingGroups!inner(*)
                    `
                )
                .eq("association_id", association_id)
                .eq("user_id", user_id)
                .eq("TrainingGroups.gender", gender);

            if (error) {
                console.error("Supabase error:", error);
                return res.status(500).json({ error: "Database error" });
            }

            res.json(trainingGroups);
        } catch (error) {
            console.error("Error fetching hidden training groups:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

router.post(
    baseUrl,
    authMiddleware, // Ensures req.user.id exists
    associationMiddleware, // Ensures req.association_id exists
    async (req: Request, res) => {
        const association_id = req.association_id;
        const user_id = req.user?.id;
        const { trainingGroupId } = req.body;
        try {
            const association_id = req.association_id;
            const { data: teams, error } = await supabase
                .from("HiddenTrainingGroups")
                .insert({
                    association_id: association_id,
                    user_id: user_id,
                    traininggroup_id: trainingGroupId,
                })
                .select();
            if (error) {
                console.error("Supabase error:", error);
                return res.status(500).json({ error: "Database error" });
            }

            res.json(teams);
        } catch (error) {
            console.error("Error fetching training groups:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

router.delete(
    `${baseUrl}/:id`, // Base URL with `:id` parameter
    authMiddleware,
    associationMiddleware,
    async (req, res) => {
        const trainingGroupId = req.params.id;
        try {
            const { error } = await supabase.rpc(
                "deletehiddentraininggroupbyid",
                {
                    traininggroupid: trainingGroupId,
                }
            );

            if (error) throw error;

            res.status(200).json({
                message: "Hidden Training Groups deleted successfully",
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to delete team" });
        }
    }
);

export default router;

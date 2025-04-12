import express from "express";
import dotenv from "dotenv";
import supabase from "../supabase/supabase.js";
import { authMiddleware } from "../middleware/auth.js";
import { teamMiddleware } from "../middleware/teamMiddleware.js";
import { associationMiddleware } from "../middleware/associationMiddleware.js";
import { positionMiddleware } from "../middleware/positionMiddleware.js";

dotenv.config();

const router = express.Router();
const baseUrl = "/players";

router.get(baseUrl, authMiddleware, async (_req, res) => {
    const { data, error } = await supabase.from("Players").select();

    if (error) {
        console.error("Error fetching players:", error);
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

router.post(
    baseUrl,
    authMiddleware,
    associationMiddleware,
    teamMiddleware,
    positionMiddleware,
    async (req, res) => {
        try {
            const team_id = req.team_id;
            const association_id = req.association_id;
            const position_id = req.position_id;

            const { firstName, lastName, email } = req.body;
            const { data, error } = await supabase
                .from("Players")
                .insert({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    team_id: team_id,
                    association_id: association_id,
                    position_id: position_id,
                })
                .select()
                .single();

            if (error) throw error;

            return res.status(200).json(data);
        } catch (error) {
            if (error instanceof Error)
                return res.status(500).json({ error: error.message });
        }
    }
);

router.put(
    `${baseUrl}/team`,
    authMiddleware,
    associationMiddleware,
    async (req, res) => {
        try {
            const { playerId, teamId } = req.body;
            const { data, error } = await supabase
                .from("Players")
                .update({ team_id: teamId })
                .eq("id", playerId)
                .select();

            if (error) throw error;

            return res.status(200).json(data);
        } catch (error) {
            if (error instanceof Error)
                return res.status(500).json({ error: error.message });
        }
    }
);

router.put(
    `${baseUrl}/training-group`,
    authMiddleware,
    associationMiddleware,
    async (req, res) => {
        try {
            const { playerId, trainingGroupId } = req.body;
            const { data, error } = await supabase
                .from("Players")
                .update({ traininggroup_id: trainingGroupId })
                .eq("id", playerId)
                .select();

            if (error) throw error;

            return res.status(200).json(data);
        } catch (error) {
            if (error instanceof Error)
                return res.status(500).json({ error: error.message });
        }
    }
);

router.put(
    `${baseUrl}/:id/position`,
    authMiddleware,
    associationMiddleware,
    async (req, res) => {
        try {
            const { newPositionId } = req.body;
            const playerId = req.params.id;
            const { data, error } = await supabase
                .from("Players")
                .update({ position_id: newPositionId })
                .eq("id", playerId)
                .select();

            if (error) throw error;

            return res.status(200).json(data);
        } catch (error) {
            if (error instanceof Error)
                return res.status(500).json({ error: error.message });
        }
    }
);

router.delete(
    `${baseUrl}/:id`, // Base URL with `:id` parameter
    authMiddleware,
    associationMiddleware,
    async (req, res) => {
        const playerId = req.params.id;

        try {
            const { error } = await supabase.rpc("delete_player", {
                player_id: playerId,
            });

            if (error) throw error;

            res.status(200).json({
                message: "Player deleted successfully",
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to delete player" });
        }
    }
);

export default router;

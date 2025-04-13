import express, { Router, Request } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { associationMiddleware } from "../middleware/associationMiddleware.js";
import { TeamWithPlayers } from "../types/types.js";
import supabase from "../supabase/supabase.js";
const baseUrl = "/training-groups";

const router: Router = express.Router();

router.get(
    baseUrl,
    authMiddleware, // Ensures req.user.id exists
    associationMiddleware, // Ensures req.association_id exists
    async (req: Request, res) => {
        try {
            const { data: teams, error } = await supabase
                .from("TrainingGroups")
                .select("*")
                .eq("association_id", req.association_id!);

            if (error) {
                console.error("Supabase error:", error);
                return res.status(500).json({ error: "Database error" });
            }

            res.json(teams);
        } catch (error) {
            console.error("Error fetching teams:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

router.get(
    `${baseUrl}/with-players/:gender`,
    authMiddleware,
    associationMiddleware,
    async (req: Request, res) => {
        try {
            const associationId = req.association_id;
            const gender = req.params.gender;

            if (!associationId) {
                return res
                    .status(400)
                    .json({ error: "Association ID missing" });
            }

            if (!gender) {
                return res.status(400).json({
                    error: "Must send a gender when requesting training group with players",
                });
            }

            const teamsWithPlayers = await getTeamsWithPlayers(
                associationId,
                gender
            );
            res.json(teamsWithPlayers);
        } catch (error) {
            console.error("Error fetching teams with players:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

async function getTeamsWithPlayers(
    associationId: number,
    gender: string
): Promise<TeamWithPlayers[]> {
    // Fetch teams first
    const { data: teams, error: teamsError } = await supabase
        .from("TrainingGroups")
        .select("*")
        .eq("association_id", associationId)
        .eq("gender", gender);

    if (teamsError) throw teamsError;
    if (!teams) return [];

    // Then fetch all players for these teams in one query
    const { data: players, error: playersError } = await supabase
        .from("Players")
        .select(
            `
        id,
        first_name,
        last_name,
        traininggroup_id,
        position:position_id (
            id,
            position_name,
            position_color
        )
        `
        )
        .eq("association_id", associationId);

    if (playersError) throw playersError;
    if (!players) return [];

    // Combine the data
    return teams.map((team) => ({
        ...team,
        players: players
            .filter((player) => player.traininggroup_id === team.id)
            .map((player) => ({
                id: player.id,
                first_name: player.first_name,
                last_name: player.last_name,
                position: player.position,
            })),
    }));
}

router.post(
    baseUrl,
    authMiddleware, // Ensures req.user.id exists
    associationMiddleware, // Ensures req.association_id exists
    async (req: Request, res) => {
        try {
            const association_id = req.association_id;
            const { name, gender } = req.body;

            const { data: currentTrainingGroups } = await supabase
                .from("TrainingGroups")
                .select("*")
                .eq("gender", gender)
                .eq("name", name);

            if (currentTrainingGroups && currentTrainingGroups.length > 0) {
                throw new Error(
                    "A training group with this name and gender already exists."
                );
            }
            const { data: teams, error } = await supabase
                .from("TrainingGroups")
                .insert({
                    association_id: association_id,
                    name: name,
                    gender: gender,
                })
                .select();
            if (error) {
                console.error("Supabase error:", error);
                return res.status(500).json({ error: "Database error" });
            }

            res.json(teams);
        } catch (error) {
            console.error("Error fetching teams:", error);
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
        console.log(trainingGroupId);

        try {
            const { error } = await supabase.rpc(
                "delete_training_group_by_id",
                {
                    training_group_id: trainingGroupId,
                }
            );

            if (error) throw error;

            res.status(200).json({
                message: "Training group deleted successfully",
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to delete training group" });
        }
    }
);

export default router;

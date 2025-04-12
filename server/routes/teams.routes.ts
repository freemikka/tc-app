import express, { Router, Request } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { associationMiddleware } from "../middleware/associationMiddleware.js";
import { TeamWithPlayers } from "../types/types.js";
import supabase from "../supabase/supabase.js";
const baseUrl = "/teams";

const router: Router = express.Router();

router.get(
    baseUrl,
    authMiddleware, // Ensures req.user.id exists
    associationMiddleware, // Ensures req.association_id exists
    async (req: Request, res) => {
        try {
            const { data: teams, error } = await supabase
                .from("Teams")
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
                    error: "Must send a gender when requesting teams with players",
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
        .from("Teams")
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
        team_id,
        position_id,
        Positions (position_name)
      `
        )
        .eq("association_id", associationId);

    if (playersError) throw playersError;
    if (!players) return [];

    // Combine the data
    return teams.map((team) => ({
        ...team,
        players: players
            .filter((player) => player.team_id === team.id)
            .map((player) => ({
                id: player.id,
                first_name: player.first_name,
                last_name: player.last_name,
                position_id: player.position_id || 1,
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
            const { data: currentTeams } = await supabase
                .from("Teams")
                .select("*")
                .eq("gender", gender)
                .eq("name", name);

            if (currentTeams && currentTeams.length > 0) {
                throw new Error(
                    "A team with this name and gender already exists."
                );
            }

            const { data: teams, error } = await supabase
                .from("Teams")
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
        const teamId = req.params.id;
        console.log(teamId);

        try {
            const { error } = await supabase.rpc("delete_team_and_players", {
                team_id_to_delete: teamId,
            });

            if (error) throw error;

            res.status(200).json({
                message: "Team and players deleted successfully",
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to delete team" });
        }
    }
);

export default router;

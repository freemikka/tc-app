import express, { Router, Request } from "express";
import { authMiddleware } from "../middleware/auth.ts";
import { associationMiddleware } from "../middleware/associationMiddleware.ts";
import { TeamWithPlayers } from "../types/types";
import supabase from "../supabase/supabase.ts";
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
    `${baseUrl}/with-players`,
    authMiddleware,
    associationMiddleware,
    async (req: Request, res) => {
        try {
            const associationId = req.association_id;

            if (!associationId) {
                return res
                    .status(400)
                    .json({ error: "Association ID missing" });
            }

            const teamsWithPlayers = await getTeamsWithPlayers(associationId);
            res.json(teamsWithPlayers);
        } catch (error) {
            console.error("Error fetching teams with players:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

async function getTeamsWithPlayers(
    associationId: number
): Promise<TeamWithPlayers[]> {
    // Fetch teams first
    const { data: teams, error: teamsError } = await supabase
        .from("Teams")
        .select("*")
        .eq("association_id", associationId);

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
            const { name } = req.body;
            const { data: teams, error } = await supabase
                .from("Teams")
                .insert({ association_id: association_id, name: name })
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

export default router;

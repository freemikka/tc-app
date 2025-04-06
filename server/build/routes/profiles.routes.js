import express from "express";
import supabase from "../supabase/supabase.js";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();
const baseUrl = "/profiles";
// POST /api/profiles
router.post(baseUrl, authMiddleware, async (req, res) => {
    try {
        const { name } = req.body; // Get association name from frontend
        const user_id = req.user?.id; // From auth middleware
        if (!name) {
            return res
                .status(400)
                .json({ error: "Association name is required" });
        }
        if (!user_id) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        // 1. Find association ID by name
        const { data: association, error: lookupError } = await supabase
            .from("Associations")
            .select("id")
            .ilike("name", name) // Case-insensitive search
            .single(); // Expect only one match
        if (lookupError || !association) {
            return res.status(404).json({ error: "Association not found" });
        }
        // 2. Create profile
        const { data: profile, error: createError } = await supabase
            .from("Profiles")
            .insert({
            user_id,
            association_id: association.id,
        })
            .select()
            .single();
        if (createError)
            throw createError;
        return res.status(201).json(profile);
    }
    catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            error: "Failed to create profile",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
/**
 * GET /api/profiles/me - Get current user's profile
 */
router.get(baseUrl, authMiddleware, async (req, res) => {
    try {
        const user_id = req.user?.id;
        // Fetch profile
        const { data: profile, error: dbError } = await supabase
            .from("Profiles")
            .select("*")
            .eq("user_id", user_id)
            .maybeSingle();
        if (dbError)
            throw dbError;
        return res.json(profile || null);
    }
    catch (error) {
        console.error("Profile fetch error:", error);
        return res.status(500).json({
            error: "Failed to fetch profile",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
export default router;

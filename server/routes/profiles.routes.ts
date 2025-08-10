import express from "express";
import supabase from "../supabase/supabase.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const baseUrl = "/profiles";

// POST /api/profiles
router.post(baseUrl, async (req, res) => {
    try {
        const { userId } = req.body; // Get association name from frontend

        if (!userId) {
            return res.status(401).json({ error: "User not applied" });
        }

        // 2. Create profile
        const { data: profile, error: createError } = await supabase
            .from("Profiles")
            .insert({
                user_id: userId,
                association_id: null,
            })
            .select()
            .single();

        if (createError) throw createError;

        return res.status(201).json(profile);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            error: "Failed to create profile",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

router.put(baseUrl, authMiddleware, async (req, res) => {
    try {
        console.log(req);
        const { name: associationName } = req.body; // Get association name from frontend
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "User not applied" });
        }
        console.log(associationName);
        const { data: association } = await supabase
            .from("Associations")
            .select("*")
            .eq("name", associationName)
            .single();

        console.log(association);

        // 2. Create profile
        const { data: profile, error: createError } = await supabase
            .from("Profiles")
            .update({
                association_id: association.id,
            })
            .eq("user_id", userId)
            .select()
            .single();

        if (createError) throw createError;

        return res.status(201).json(profile);
    } catch (error) {
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
            .select("*, Associations(*)")
            .eq("user_id", user_id)
            .single();

        if (dbError) throw dbError;

        console.log(profile);

        return res.json(profile || null);
    } catch (error) {
        console.error("Profile fetch error:", error);
        return res.status(500).json({
            error: "Failed to fetch profile",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

export default router;

import express from "express";
import dotenv from "dotenv";
import supabase from "../supabase/supabase.js";
import { authMiddleware } from "../middleware/auth.js";
import { profileMiddleware } from "../middleware/profileMiddleware.js";
import { associationMiddleware } from "../middleware/associationMiddleware.js";

dotenv.config();

const router = express.Router();
const baseUrl = "/positions";

router.get(baseUrl, authMiddleware, profileMiddleware, async (req, res) => {
    const association_id = req.association_id;
    const { data, error } = await supabase
        .from("Positions")
        .select()
        .eq("association_id", association_id);

    if (error) {
        console.error("Error fetching positions:", error);
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

router.post(baseUrl, authMiddleware, profileMiddleware, async (req, res) => {
    try {
        const newPosition = req.body;
        const association_id = req.association_id;
        // 2. Create profile
        const { data: position, error: createError } = await supabase
            .from("Positions")
            .insert({
                position_name: newPosition.positionName,
                position_color: newPosition.positionColor,
                association_id: association_id,
            })
            .select()
            .single();

        if (createError) throw createError;

        return res.status(201).json(position);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Failed to create position",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

export default router;

import express from "express";
import dotenv from "dotenv";
import supabase from "../supabase/supabase.js";
import { authMiddleware } from "../middleware/auth.js";
import { associationMiddleware } from "../middleware/associationMiddleware.js";
import { profileMiddleware } from "../middleware/profileMiddleware.js";

dotenv.config();

const router = express.Router();
const baseUrl = "/associations";

router.get(baseUrl, authMiddleware, async (_req, res) => {
    const { data, error } = await supabase.from("Associations").select();

    if (error) {
        console.error("Error fetching associations:", error);
        return res.status(500).json({ error: error.message });
    }

    return res.json(data);
});

router.get(
    `${baseUrl}/join-requests`,
    authMiddleware,
    profileMiddleware,
    async (req, res) => {
        const association_id = req.association_id;
        const { data, error } = await supabase
            .from("AssociationJoinRequests")
            .select("*")
            .eq("association_id", association_id);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(data);
    }
);

router.post(baseUrl, authMiddleware, async (req, res) => {
    const { data, error } = await supabase
        .from("Associations")
        .insert({ name: req.body.name })
        .select();

    if (error) {
        console.error("Error creating association:", error);
        return res.status(500).json({ error: error.message });
    }
    return res.status(201).json(data);
});

router.post(
    `${baseUrl}/request`,
    authMiddleware,
    associationMiddleware,
    async (req, res) => {
        const association_id = req.association_id;
        const { data, error } = await supabase
            .from("AssociationJoinRequests")
            .insert({ user_id: req.user?.id, association_id: association_id })
            .select()
            .single();

        if (error && error.code === "23505") {
            return res
                .status(500)
                .json({ error: "Already trying to join an association" });
        }
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(201).json(data);
    }
);
export default router;

import express from "express";
import dotenv from "dotenv";
import supabase from "../supabase/supabase.js";
import { authMiddleware } from "../middleware/auth.js";
dotenv.config();
const router = express.Router();
const baseUrl = "/associations";
router.get(baseUrl, authMiddleware, async (_req, res) => {
    const { data, error } = await supabase.from("Associations").select();
    if (error) {
        console.error("Error fetching associations:", error);
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});
export default router;

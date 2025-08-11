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
        const user_id = req.user?.id;
        console.log(association_id);
        const { data, error } = await supabase
            .from("AssociationJoinRequests")
            .select()
            .eq("association_id", association_id);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const userIds = data.map((request) => request.user_id);

        // Use auth admin to get user details
        const {
            data: { users },
            error: usersError,
        } = await supabase.auth.admin.listUsers();

        if (usersError) {
            console.error("Error fetching users:", usersError);
            return;
        }

        // Filter and combine the data
        const relevantUsers = users.filter((user) => userIds.includes(user.id));
        const requestsWithUsers = data.map((request) => ({
            ...request,
            user: relevantUsers.find((user) => user.id === request.user_id),
        }));

        return res.status(200).json(requestsWithUsers);
    }
);

router.get(
    `${baseUrl}/join-requests/:userId`,
    authMiddleware,
    async (req, res) => {
        try {
            const userId = req.params.userId;
            const { data, error } = await supabase
                .from("AssociationJoinRequests")
                .select()
                .eq("user_id", userId);

            if (error) throw error;
            return res.status(200).json(data);
        } catch (err) {
            if (err instanceof Error)
                return res.status(500).json({ error: err.message });
        }
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
        try {
            const association_id = req.association_id;
            const { data, error } = await supabase
                .from("AssociationJoinRequests")
                .insert({
                    user_id: req.user?.id,
                    association_id: association_id,
                })
                .select()
                .single();

            if (error) {
                // Check for unique violation on user_id
                if (error.code === "23505") {
                    return res.status(400).json({
                        error: "Already trying to join an association",
                    });
                }
                throw error;
            }

            return res.status(201).json(data);
        } catch (error) {
            console.log(error);
            if (error instanceof Error)
                return res.status(500).json({ error: error.message });
        }
    }
);

router.post(`${baseUrl}/accept-request`, authMiddleware, async (req, res) => {
    const { userId, associationId } = req.body;
    /* First update the profile */
    const { data, error } = await supabase
        .from("Profiles")
        .update({ association_id: associationId })
        .eq("user_id", userId);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    /* Then delete the request */
    const responseDelete = await supabase
        .from("AssociationJoinRequests")
        .delete()
        .eq("user_id", userId);

    if (responseDelete.error) {
        return res.status(500).json({ error: responseDelete.error.message });
    }

    return res.status(201).json(data);
});

router.delete(
    `${baseUrl}/reject-request/:userId`,
    authMiddleware,
    async (req, res) => {
        const userId = req.params.userId;
        const { data, error } = await supabase
            .from("AssociationJoinRequests")
            .delete()
            .eq("user_id", userId)
            .select();

        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(201).json(data);
    }
);

router.delete(
    `${baseUrl}/join-requests/:userId`,
    authMiddleware,
    async (req, res) => {
        const userId = req.params.userId;
        const { data, error } = await supabase
            .from("AssociationJoinRequests")
            .delete()
            .eq("user_id", userId)
            .select();

        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(201).json(data);
    }
);

export default router;

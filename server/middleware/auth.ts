import { User } from "@supabase/supabase-js";
import supabase from "../supabase/supabase.js";
import { Request, Response, NextFunction } from "express";
import NodeCache from "node-cache";
// Rest of your middleware code...
// At the top of your middleware file
// declare global {
//     namespace Express {
//         interface Request {
//             user?: import("@supabase/supabase-js").User;
//         }
//     }
// }

// Configure cache (TTL: 15 minutes, max 1000 users)
const nodeCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ error: "Missing or invalid authorization header" });
    }
    const token = authHeader.split(" ")[1];

    try {
        let user: User | null = null; // Explicit typing helps

        // Check cache first
        const cachedUser = nodeCache.get(token);
        if (cachedUser != null) {
            user = cachedUser as User;
        } else {
            // Verify the JWT with Supabase
            const { data, error } = await supabase.auth.getUser(token); // Don't destructure 'user' here

            if (error) throw error;
            if (!data?.user) throw new Error("No user found");

            user = data.user; // Assign to outer scope variable
            nodeCache.set(token, user);
        }

        console.log("AUTH MIDDLEWARE");

        req.user = user; // Now properly assigned
        next();
        // Attach user to request for downstream handlers
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({
            error: "Invalid or expired token",
            details: error instanceof Error ? error.message : String(error),
        });
    }
};

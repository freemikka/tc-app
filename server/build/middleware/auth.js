import supabase from "../supabase/supabase.js";
export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ error: "Missing or invalid authorization header" });
    }
    const token = authHeader.split(" ")[1];
    try {
        // Verify the JWT with Supabase
        const { data: { user }, error, } = await supabase.auth.getUser(token);
        if (error)
            throw error;
        if (!user)
            throw new Error("No user found");
        // Attach user to request for downstream handlers
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({
            error: "Invalid or expired token",
            details: error instanceof Error ? error.message : String(error),
        });
    }
};

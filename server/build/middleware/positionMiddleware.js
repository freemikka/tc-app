import supabase from "../supabase/supabase.js";
export const positionMiddleware = async (req, res, next) => {
    try {
        const position_name = req.body.position;
        // Query Supabase's `profiles` table
        const { data: position, error } = await supabase
            .from("Positions")
            .select("*")
            .eq("position_name", position_name)
            .single(); // Ensure we get a single record
        if (error) {
            console.error("Supabase error:", error);
            return res.status(500).json({ error: "Database error" });
        }
        if (!position) {
            return res.status(404).json({ error: "Position not found" });
        }
        // Attach association_id to the request
        req.position_id = position.id;
        next();
    }
    catch (error) {
        console.error("Error in associationMiddleware:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

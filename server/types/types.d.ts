import { User } from "@supabase/supabase-js";

declare global {
    namespace Express {
        interface Request {
            user?: User;
            association_id: number;
        }
    }
}

// This export is needed to make it a module
export {};

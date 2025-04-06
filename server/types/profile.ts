export interface Profile {
    id: number; // int4 in Supabase (auto-increment)
    created_at: string; // timestamptz (ISO string, e.g., "2023-01-01T00:00:00Z")
    association_id: number; // int4
    user_id: string; // uuid
}

import axios from "axios";
import supabase from "../utils/supabase";

const apiClient = axios.create({
    baseURL:
        process.env.NODE_ENV === "development"
            ? "/api"
            : "https://tc-app-server.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor to inject token
apiClient.interceptors.request.use(async (config) => {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
});

export default apiClient;

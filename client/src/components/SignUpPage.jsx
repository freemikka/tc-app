import React, { useState } from "react";
import supabase from "../utils/supabase"; // Import your supabase client
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSignUp = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { user, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;
            // You can redirect to a login page or home page here
            navigate("/");
        } catch (error) {
            console.log("Error signing up: ", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Sign Up
                </h2>

                <form onSubmit={handleSignUp} className="space-y-4">
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-all ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-sky-500 hover:bg-sky-600 hover:cursor-pointer"
                        }`}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                {error && (
                    <p className="mt-4 text-center text-red-500">{error}</p>
                )}

                <p className="mt-4 text-center text-gray-600">
                    Already have an account?{" "}
                    <button
                        className="text-sky-500 hover:underline"
                        onClick={() => navigate("/login")}
                    >
                        Log in instead
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;

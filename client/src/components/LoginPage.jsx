import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/userService";
import { useEffect } from "react";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate(); // For redirection

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/", { replace: true });
        }
    }, [isLoggedIn, navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        const result = await loginUser(email, password);

        if (result.success) {
            console.log("Login successful");
            navigate("/", { replace: true });
            setIsLoggedIn(true);
        } else {
            setError(result.message); // Show error message
        }

        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Login
                </h2>

                <form onSubmit={handleLogin} className="space-y-4">
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
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {error && (
                    <p className="mt-4 text-center text-red-500">{error}</p>
                )}

                {/* Redirect to Sign Up Page */}
                <p className="mt-4 text-center text-gray-600">
                    Don't have an account?{" "}
                    <button
                        className="text-sky-500 hover:underline"
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

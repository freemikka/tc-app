import { useEffect, useState } from "react";
import "./App.css";
import {
    Route,
    BrowserRouter as Router,
    Routes,
    Navigate,
} from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./hooks/useAuth";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";

function App() {
    // const [users, setUsers] = useState([]);
    // const [teams, setTeams] = useState([]);

    const { data: user, isUserLoading, isUserError } = useAuth();

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={user ? <Navigate to="/" /> : <LoginPage />}
                />

                <Route
                    path="/signup"
                    element={user ? <Navigate to="/" /> : <SignUpPage />}
                />
                <Route path="/" element={user ? <HomePage /> : <LoginPage />} />

                {/* <ProtectedRoute path="/dashboard" component={Dashboard} user={user} /> */}
            </Routes>
        </Router>
    );
}

{
    /*  */
}

export default App;

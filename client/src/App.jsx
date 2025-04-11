import "./App.css";
import {
    Route,
    BrowserRouter as Router,
    Routes,
    Navigate,
} from "react-router-dom";

import { useAuth } from "./hooks/useAuth";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import DragAndDropHome from "./components/DragAndDropHome";
import AssociationView from "./components/AssociationView";
import Navbar from "./components/Navbar";

function App() {
    const { data: user, isUserLoading, isUserError } = useAuth();

    const genderRoutes = [
        {
            path: "/dames",
            gender: "Female",
            type: "standard",
        },
        {
            path: "/traininggroep-dames",
            gender: "Female",
            type: "training",
        },
        {
            path: "/heren",
            gender: "Male",
            type: "standard",
        },
        {
            path: "/traininggroep-heren",
            gender: "Male",
            type: "training",
        },
    ];

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
                {genderRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <DragAndDropHome
                                gender={route.gender}
                                isTraining={route.type === "training"}
                            />
                        }
                    />
                ))}
            </Routes>
        </Router>
    );
}

{
    /*  */
}

export default App;

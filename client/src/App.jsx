import "./App.css";
import {
    Route,
    BrowserRouter as Router,
    Routes,
    Navigate,
} from "react-router-dom";

import { Toaster } from "sonner";
import Layout from "./Layout/Layout";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import DragAndDropHome from "./components/DragAndDropHome";
import RequireAuth from "./guards/RequireAuth";
import RequireAssociation from "./guards/RequireAssociation";
import Navbar from "./Layout/Navbar";

import PickAssocation from "./components/PickAssociation";
function App() {
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
            <Toaster position="top-right" />
            <Navbar />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                {/* Protected routes */}
                <Route element={<RequireAuth />}>
                    <Route
                        path="join-association"
                        element={<PickAssocation />}
                    />
                    {/* Association routes */}
                    <Route element={<RequireAssociation />}>
                        <Route path="/" element={<HomePage />} />

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
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;

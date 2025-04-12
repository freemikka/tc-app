import "./App.css";
import {
    Route,
    BrowserRouter as Router,
    Routes,
    Navigate,
} from "react-router-dom";

import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import DragAndDropHome from "./components/DragAndDropHome";
import RequireAuth from "./components/RequireAuth";
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
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                {/* Protected routes */}
                <Route element={<RequireAuth />}>
                    {" "}
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
            </Routes>
        </Router>
    );
}

{
    /*  */
}

export default App;

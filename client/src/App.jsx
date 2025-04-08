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
                <Route
                    path="/dames"
                    element={<DragAndDropHome gender="Female" />}
                />
                <Route
                    path="/traininggroep-dames"
                    element={<DragAndDropHome gender="Female" />}
                />
                <Route
                    path="/heren"
                    element={<DragAndDropHome gender="Male" />}
                />

                <Route
                    path="/traininggroep-heren"
                    element={<DragAndDropHome gender="Male" />}
                />

                {/* <ProtectedRoute path="/dashboard" component={Dashboard} user={user} /> */}
            </Routes>
        </Router>
    );
}

{
    /*  */
}

export default App;

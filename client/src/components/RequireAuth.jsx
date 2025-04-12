import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
    const { data: user, isLoading, isUserError } = useAuth();
    if (isLoading) {
        return <div>Loading</div>;
    }

    if (user === null || user.session === null) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default RequireAuth;

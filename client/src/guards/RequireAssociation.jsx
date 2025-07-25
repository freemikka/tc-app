import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";

const RequireAssociation = () => {
    const { data: profile, isLoading, isError } = useProfile();
    const location = useLocation();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !profile.association_id) {
        // Save the location they were trying to go to
        return (
            <Navigate
                to="/join-association"
                state={{ from: location }}
                replace
            />
        );
    }

    return <Outlet />;
};

export default RequireAssociation;

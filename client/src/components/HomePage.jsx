import React, { useState, useEffect } from "react";
import { getProfile } from "../services/profileService";
import PickAssociation from "../components/PickAssociation";
import { Navigate, useNavigate } from "react-router-dom";

import AssociationView from "./AssociationView";

const HomePage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                if (!response.association_id) {
                    navigate("/join-association");
                }
            } catch (err) {
                navigate("/join-association");
            } finally {
                // setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <div>
            {/* <button onClick={handleClick}>click me</button> */}
            <div>{<AssociationView />}</div>
        </div>
    );
};

export default HomePage;

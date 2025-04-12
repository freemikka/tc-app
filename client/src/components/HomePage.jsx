import React, { useState, useEffect } from "react";
import { getProfile } from "../services/profileService";
import PickAssociation from "../components/PickAssociation";
import { Navigate } from "react-router-dom";

import AssociationView from "./AssociationView";

const HomePage = () => {
    const [association, setAssociation] = useState(null);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setAssociation(data);
            } catch (err) {
                console.log("here!!!");
                console.log(err);
                return <Navigate to="/login" replace />;
            } finally {
                // setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <div>
            {/* <button onClick={handleClick}>click me</button> */}
            <div>{association ? <AssociationView /> : <PickAssociation />}</div>
        </div>
    );
};

export default HomePage;

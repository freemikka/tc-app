import React, { useState, useEffect } from "react";
// import { signOutUser } from "../services/userService";
import { getAllPlayers } from "../services/playerService";
import { getAllTeams } from "../services/teamService";
import { getProfile } from "../services/profileService";
import PickAssociation from "../components/PickAssociation";
import Navbar from "./Navbar";

import AssociationView from "./AssociationView";
import AddPlayerForm from "./AddPlayerForm";
import AddTeamForm from "./AddTeamForm";

const HomePage = () => {
    //
    const [association, setAssociation] = useState(null);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setAssociation(data);
            } catch (err) {
                // setError(err.message || "Failed to load profile");
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

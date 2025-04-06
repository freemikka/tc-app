import React, { useState, useEffect } from "react";
// import { signOutUser } from "../services/userService";
import { getAllPlayers } from "../services/playerService";
import { getAllTeams } from "../services/teamService";
import { getProfile } from "../services/profileService";
import PickAssociation from "../components/PickAssociation";

import AssociationView from "./AssociationView";
import AddPlayerForm from "./AddPlayerForm";
import AddTeamForm from "./AddTeamForm";

const HomePage = () => {
    //
    const [association, setAssociation] = useState(null);

    // const {
    //     data: players = [],
    //     isPlayersLoading,
    //     playersError,
    // } = useQuery({
    //     queryKey: ["players"],
    //     queryFn: getAllPlayers,
    // });

    // const {
    //     data: teams = [],
    //     isTeamsLoading,
    //     teamsError,
    // } = useQuery({
    //     queryKey: ["teams"],
    //     queryFn: getAllTeams,
    // });

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

    // return (
    //     <div className="container mx-auto px-4 py-8">
    //         <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

    //         <div className="mb-8">
    //             <h2 className="text-xl font-semibold mb-4">Players</h2>
    //             {players.length > 0 ? (
    //                 <ul className="space-y-2 list-disc pl-5">
    //                     {players.map((player) => (
    //                         <li key={player.id}>{player.first_name}</li>
    //                     ))}
    //                 </ul>
    //             ) : (
    //                 <p>No players found</p>
    //             )}
    //             <AddPlayerForm />
    //         </div>

    //         <div className="mb-8">
    //             <h2 className="text-xl font-semibold mb-4">Teams</h2>
    //             {teams.length > 0 ? (
    //                 <ul className="space-y-2 list-disc pl-5">
    //                     {teams.map((team) => (
    //                         <li key={team.id}>{team.name}</li>
    //                     ))}
    //                 </ul>
    //             ) : (
    //                 <p>No teams found</p>
    //             )}
    //             <AddTeamForm />
    //         </div>

    //
    //     </div>
    // );
};

export default HomePage;

import React from "react";
import DragAndDropTeams from "./DragAndDropTeams";
import Navbar from "./Navbar";
import { getTeamsWithPlayers } from "../services/teamService";
import { getTrainingGroupsWithPlayers } from "../services/trainingGroupService";
import { useQuery } from "@tanstack/react-query";
import { useTrainingGroupsWithPlayers } from "../hooks/useTrainingGroupsWithPlayers";
import { useTeamsWithPlayers } from "../hooks/useTeamsWithPlayers";

const DragAndDropHome = ({ gender, isTraining }) => {
    const {
        data: teams,
        isLoading: isTeamsLoading,
        isError: isTeamsError,
    } = useTeamsWithPlayers(gender);

    const {
        data: trainingGroups,
        isLoading: isTrainingGroupsLoading,
        isError: isTrainingGroupsError,
    } = useTrainingGroupsWithPlayers(gender);

    if (isTeamsLoading || isTrainingGroupsLoading) {
        return <div>Loading</div>;
    }

    console.log("here dndhome");

    return (
        <div>
            <Navbar gender={gender} isTraining={isTraining} />
            {/* Padding to account for fixed navbar */}
            <DragAndDropTeams
                gender={gender}
                data={isTraining ? trainingGroups : teams}
                queryKey={
                    isTraining
                        ? "trainingGroupsWithPlayers"
                        : "teamsWithPlayers"
                }
            />
        </div>
    );
};

export default DragAndDropHome;

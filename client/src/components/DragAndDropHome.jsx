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

    //     <div className="min-h-screen w-full relative">
    //   {/* Radial Gradient Background from Bottom */}
    //   <div
    //     className="absolute inset-0 z-0"
    //     style={{
    //       background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #475569 100%)",
    //     }}
    //   />
    //   {/* Your Content/Components */}
    // </div>

    return (
        <div className="min-h-screen w-full relative">
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

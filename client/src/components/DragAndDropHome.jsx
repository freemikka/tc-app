import React from "react";
import DragAndDropTeams from "./DragAndDropTeams";
import Navbar from "./Navbar";
import { getTeamsWithPlayers } from "../services/teamService";
import { getTrainingGroupsWithPlayers } from "../services/trainingGroupService";
import { useQuery } from "@tanstack/react-query";

const DragAndDropHome = ({ gender, isTraining }) => {
    const { data: teams = [] } = useQuery({
        queryKey: ["teams"],
        queryFn: () => getTeamsWithPlayers(gender),
    });

    const { data: trainingGroups = [] } = useQuery({
        queryKey: ["trainingGroups"],
        queryFn: () => getTrainingGroupsWithPlayers(gender),
    });

    return (
        <div>
            <Navbar />
            {/* Padding to account for fixed navbar */}
            <DragAndDropTeams
                gender={gender}
                data={isTraining ? trainingGroups : teams}
                queryKey={isTraining ? "trainingGroups" : "teams"}
            />
        </div>
    );
};

export default DragAndDropHome;

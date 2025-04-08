import React, { useState } from "react";
import { createTeam } from "../services/teamService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddTeamForm = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createTeam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
        onError: (err) => {
            console.error("Failed creating player:", err.message);
        },
    });

    // HANDLE OPTIMISTIC ADDING FRONTEND ELSE PROBLEMS SEE TRAININGROUPS

    const handleAddMaleTeam = async (event) => {
        const teams = queryClient.getQueryData(["teams"]);
        const maleTeams = teams.filter((team) => team.gender === "Male");
        event.preventDefault();
        const newTeam = {
            name: `HS ${maleTeams.length + 1}`,
            gender: "Male",
        };

        mutation.mutate(newTeam);
    };

    const handleAddFemaleTeam = async (event) => {
        const teams = queryClient.getQueryData(["teams"]);
        const femaleTeams = teams.filter((team) => team.gender === "Female");
        event.preventDefault();
        const newTeam = {
            name: `DS ${femaleTeams.length + 1}`,
            gender: "Female",
        };
        mutation.mutate(newTeam);
    };

    return (
        <div>
            <div className="mt-4 p-4 border rounded">
                <h2 className="text-lg font-semibold mb-2 ">Add Team</h2>

                <button
                    className="mx-5 bg-sky-500 hover:bg-sky-700 hover:cursor-pointer text-white font-medium py-2 px-4 rounded transition-colors"
                    type="submit"
                    value="Submit"
                    onClick={handleAddMaleTeam}
                >
                    Add Male Team
                </button>

                <button
                    className="mx-5 bg-sky-500 hover:bg-sky-700 hover:cursor-pointer text-white font-medium py-2 px-4 rounded transition-colors"
                    type="submit"
                    value="Submit"
                    onClick={handleAddFemaleTeam}
                >
                    Add Female Team
                </button>
            </div>
        </div>
    );
};

export default AddTeamForm;

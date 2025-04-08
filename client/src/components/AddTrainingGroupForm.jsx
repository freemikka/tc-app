import React from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
// import useTrainingGroups from "../hooks/useTrainingGroups";
import { createTrainingGroup } from "../services/trainingGroupService";

const AddTrainingGroupForm = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createTrainingGroup,
        onMutate: async (newTeam) => {
            await queryClient.cancelQueries(["trainingGroups"]);
            const prev = queryClient.getQueryData(["trainingGroups"]);
            queryClient.setQueryData(["trainingGroups"], (old) => [
                ...(old || []),
                newTeam,
            ]);
            return { prev };
        },
        onError: (err, newTeam, context) => {
            queryClient.setQueryData(["trainingGroups"], context.prev);
        },
    });

    const handleAddMaleTrainingGroup = async (event) => {
        event.preventDefault();

        const trainingGroups =
            queryClient.getQueryData(["trainingGroups"]) || [];
        const maleCount = trainingGroups.filter(
            (team) => team.gender === "Male"
        ).length;

        mutation.mutate({
            name: `Traininggroup HS ${maleCount + 1}`,
            gender: "Male",
        });
    };

    const handleAddFemaleTrainingGroup = async (event) => {
        event.preventDefault();

        const trainingGroups =
            queryClient.getQueryData(["trainingGroups"]) || [];
        const femaleCount = trainingGroups.filter(
            (team) => team.gender === "Female"
        ).length;

        mutation.mutate({
            name: `Traininggroup DS ${femaleCount + 1}`,
            gender: "Female",
        });
    };

    return (
        <div>
            <div className="mt-4 p-4 border rounded">
                <h2 className="text-lg font-semibold mb-2 ">Add Team</h2>

                <button
                    className="mx-5 bg-sky-500 hover:bg-sky-700 hover:cursor-pointer text-white font-medium py-2 px-4 rounded transition-colors"
                    type="submit"
                    value="Submit"
                    onClick={handleAddMaleTrainingGroup}
                >
                    Add Male Training Group
                </button>

                <button
                    className="mx-5 bg-sky-500 hover:bg-sky-700 hover:cursor-pointer text-white font-medium py-2 px-4 rounded transition-colors"
                    type="submit"
                    value="Submit"
                    onClick={handleAddFemaleTrainingGroup}
                >
                    Add Female Training Group
                </button>
            </div>
        </div>
    );
};

export default AddTrainingGroupForm;

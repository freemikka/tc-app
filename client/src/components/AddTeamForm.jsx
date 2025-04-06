import React, { useState } from "react";
import { createTeam } from "../services/teamService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddTeamForm = () => {
    const [name, setName] = useState("");
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

    const handleAddTeam = async (event) => {
        event.preventDefault();
        const newTeam = {
            name: name,
        };

        mutation.mutate(newTeam);

        setName("");
    };

    return (
        <div>
            <div className="mt-4 p-4 border rounded">
                <h2 className="text-lg font-semibold mb-2">Add Team</h2>
                <form>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>

                    <button
                        className="bg-sky-500 hover:bg-sky-700 hover:cursor-pointer text-white font-medium py-2 px-4 rounded transition-colors"
                        type="submit"
                        value="Submit"
                        onClick={handleAddTeam}
                    >
                        Add Team
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTeamForm;

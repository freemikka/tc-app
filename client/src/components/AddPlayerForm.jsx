import React, { useState, useEffect } from "react";
import { createPlayer } from "../services/playerService";
import { getAllPositions } from "../services/positionService";
import { getAllTeams } from "../services/teamService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllTrainingGroups } from "../services/trainingGroupService";

const AddPlayerForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        position: "",
        team: "",
        trainingGroup: "",
    });

    const [teams, setTeams] = useState([]);
    const [trainingGroups, setTrainingGroups] = useState([]);
    const [positions, setPositions] = useState([]);

    // Fetch teams and positions when component mounts
    useEffect(() => {
        const fetchData = async () => {
            const positionsResponse = await getAllPositions();
            setPositions(positionsResponse);

            const teamsResponse = await getAllTeams();
            setTeams(teamsResponse);

            const trainingGroupsResponse = await getAllTrainingGroups();
            setTrainingGroups(trainingGroupsResponse);
        };

        fetchData();
    }, []);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createPlayer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["players"] });
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                position: "",
                team: "",
                trainingGroup: "",
            });
        },
        onError: (error) => {
            console.error("Failed creating player:", error.message);
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <div className="mt-4 p-4 border rounded">
            <h2 className="text-lg font-semibold mb-2">Add Player</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 items-center gap-4">
                    <label className="flex flex-col">
                        First Name:
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="border rounded p-2"
                            required
                        />
                    </label>
                    <label className="flex flex-col">
                        Last Name:
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="border rounded p-2"
                            required
                        />
                    </label>
                </div>

                <div className="grid grid-cols-2 items-center gap-4">
                    <label className="flex flex-col">
                        E-mail (optional):
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border rounded p-2"
                        />
                    </label>
                </div>

                <div className="grid grid-cols-2 items-center gap-4">
                    <label className="flex flex-col">
                        Position:
                        <select
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            className="border rounded p-2"
                            required
                        >
                            <option value="">Select Position</option>
                            {positions.map((pos) => (
                                <option key={pos.id} value={pos.position_name}>
                                    {pos.position_name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col">
                        Team:
                        <select
                            name="team"
                            value={formData.team}
                            onChange={handleChange}
                            className="border rounded p-2"
                            required
                        >
                            <option value="">Select Team</option>
                            {teams.map((team) => (
                                <option key={team.id} value={team.name}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-col">
                        Training group:
                        <select
                            name="trainingGroup"
                            value={formData.trainingGroup}
                            onChange={handleChange}
                            className="border rounded p-2"
                        >
                            <option value="">Select Traininggroup</option>
                            {trainingGroups.map((trainingGroup) => (
                                <option
                                    key={trainingGroup.id}
                                    value={trainingGroup.name}
                                >
                                    {trainingGroup.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <button
                    className="bg-sky-500 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
                    type="submit"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Adding..." : "Add Player"}
                </button>
            </form>
        </div>
    );
};

export default AddPlayerForm;

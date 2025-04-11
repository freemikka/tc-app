import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import PlayerItem from "./PlayerItem";
import { deleteTeam } from "../services/teamService";
import { createHiddenTeam } from "../services/hideTeamService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DotMenu from "./DotMenu";
import { useCreateHiddenTeam } from "../mutations/createHiddenTeams";

const TeamBox = ({ team, onDrop, queryKey }) => {
    const queryClient = useQueryClient();
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "PLAYER",
        drop: (item) => onDrop(item, team.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const sortedPlayers = [...team.players].sort(
        (a, b) => a.position_id - b.position_id
    );

    const teamBoxLength = Math.max(sortedPlayers.length * 9.5, 100);

    const { mutate: createHidden } = useCreateHiddenTeam();

    const handleHideTeam = (teamId) => {
        createHidden(teamId);
    };

    const handleMenuClick = async (option) => {
        // handleClose();
        if (option === 0) {
            try {
                const response = await deleteTeam(team.id); // Pass teamId to your service
                queryClient.invalidateQueries({
                    queryKey: [queryKey],
                });
                // Handle successful deletion (maybe update parent component state)
            } catch (error) {
                console.error("Error deleting team:", error);
            }
        }

        if (option === 1) {
            // Collapse the team so it no longer shows up
            handleHideTeam(team.id);
        }
    };

    return (
        <div
            ref={drop}
            style={{
                padding: "16px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: isOver ? "#f0f9ff" : "white",
                height: `${teamBoxLength}vh`,
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "8px",
                    justifyContent: "space-between",
                }}
            >
                <h3
                    style={{
                        fontWeight: "bold",
                        fontSize: "18px",
                        marginBottom: "8px",
                    }}
                >
                    {team.name}
                </h3>
                {/* Menu button on the right */}
                <DotMenu handleMenuClick={handleMenuClick} />
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                }}
            >
                {sortedPlayers.map((player) => (
                    <PlayerItem
                        key={player.id}
                        player={player}
                        onDrop={onDrop}
                    />
                ))}
            </div>
        </div>
    );
};

export default TeamBox;

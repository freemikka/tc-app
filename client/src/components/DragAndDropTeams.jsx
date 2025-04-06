import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getTeamsWithPlayers } from "../services/teamService";
import { updatePlayerTeam } from "../services/playerService";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import supabase from "../utils/supabase";
import TeamBox from "./TeamBox";

const DragAndDropTeams = () => {
    const queryClient = useQueryClient();

    const { data: teams = [] } = useQuery({
        queryKey: ["teams"],
        queryFn: getTeamsWithPlayers,
    });

    React.useEffect(() => {
        const channel = supabase
            .channel("players-changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "Players",
                },
                () => {
                    queryClient.invalidateQueries({ queryKey: ["teams"] });
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [queryClient]);

    const handlePlayerDrop = async (player, newTeamId) => {
        if (!newTeamId) return;

        const previousTeams = queryClient.getQueryData(["teams"]) || [];

        // Optimistic update
        queryClient.setQueryData(["teams"], (oldTeams) => {
            return oldTeams.map((team) => {
                // Remove player from old team
                if (team.players.some((p) => p.id === player.id)) {
                    return {
                        ...team,
                        players: team.players.filter((p) => p.id !== player.id),
                    };
                }
                // Add player to new team
                if (team.id === newTeamId) {
                    return {
                        ...team,
                        players: [...team.players, player],
                    };
                }
                return team;
            });
        });

        try {
            await updatePlayerTeam(player.id, newTeamId);
            // Optionally invalidate to ensure sync with server
            // queryClient.invalidateQueries({ queryKey: ["teams"] });
        } catch (error) {
            console.error("Failed to update player team:", error);
            // Revert on error
            queryClient.setQueryData(["teams"], previousTeams);
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "16px",
                    padding: "16px",
                }}
            >
                {teams.map((team) => (
                    <TeamBox
                        key={team.id}
                        team={team}
                        onDrop={handlePlayerDrop}
                    />
                ))}
            </div>
        </DndProvider>
    );
};

export default DragAndDropTeams;

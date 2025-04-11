import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getTeamsWithPlayers } from "../services/teamService";
import { updatePlayerTeam } from "../services/playerService";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import {
    deleteHiddenTeam,
    getAllHiddenTeams,
} from "../services/hideTeamService";
import supabase from "../utils/supabase";
import TeamBox from "./TeamBox";
import { useProfile } from "../hooks/useProfile";

const DragAndDropTeams = ({ gender, data, queryKey }) => {
    const queryClient = useQueryClient();
    const {
        data: profile,
        isLoading: isUserLoading,
        isError: isUserError,
    } = useProfile();

    const { data: hiddenTeams = [] } = useQuery({
        queryKey: ["hiddenTeams"],
        queryFn: () => getAllHiddenTeams(gender),
    });

    //  dont show hidden teams
    const visibleTeams = data.filter(
        (team) =>
            !hiddenTeams.some((hiddenTeam) => hiddenTeam.team_id === team.id)
    );

    React.useEffect(() => {
        if (isUserLoading) return;
        queryClient.invalidateQueries({ queryKey: ["trainingGroups"] });
        const channel = supabase
            .channel(`players-changes-${profile.association_id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "Players",
                    filter: `association_id=eq.${profile.association_id}`,
                },
                (payload) => {
                    console.log("payload", payload);
                    queryClient.invalidateQueries({ queryKey: ["teams"] });
                }
            )
            .subscribe((status) => {
                console.log(status);
            });

        return () => {
            channel.unsubscribe();
        };
    }, [profile]);

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

    const handleSetTeamVisibile = async (teamId) => {
        try {
            const response = await deleteHiddenTeam(teamId);
            queryClient.invalidateQueries({ queryKey: ["hiddenTeams"] });
        } catch (error) {
            console.log("Error deleting team", error);
        }
    };

    if (isUserLoading) {
        return <div>Wait</div>;
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div
                style={{
                    display: "grid",

                    gridTemplateColumns:
                        "100px repeat(auto-fit, minmax(300px, 300px))",
                    gap: "16px",
                    gridAutoColumns: "minmax(300px, 300px)",
                    padding: "16px",
                    overflowX: "auto", // Enable horizontal scrolling
                    // overflowY: "hidden", // Disable vertical scrolling
                    gridAutoFlow: "column", // Force single row
                    height: "100vh", // Prevent container from expanding
                    // Scrollbar styling (cross-browser)
                    paddingBottom: "100px", // Space for scrollbar
                    marginBottom: "-6px", // Pulls scrollbar into padding area
                    scrollbarGutter: "stable", // Prevents layout shift (modern browsers)
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridAutoRows: "50px",
                        gridAutoColumns: "minmax(30px, 75px)",
                    }}
                >
                    {hiddenTeams.length !== 0 ? (
                        <div className="space-y-4">
                            {" "}
                            {/* Added wrapper div with spacing */}
                            <h3 className="text-lg font-semibold">
                                Hidden Teams
                            </h3>{" "}
                            {/* Heading */}
                            <div className="flex flex-wrap gap-2">
                                {" "}
                                {/* Button container */}
                                {hiddenTeams.map((hiddenTeam) => (
                                    <button
                                        className="
                                        rounded-lg
                                        bg-white
                                        border-t border-r border-b border-black
                                        px-4 py-2
                                        cursor-pointer
                                        hover:bg-gray-100
                                        transition-colors
                                    "
                                        key={hiddenTeam.id}
                                        onClick={() =>
                                            handleSetTeamVisibile(hiddenTeam.id)
                                        }
                                    >
                                        {hiddenTeam.Teams.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>No teams hidden</div>
                    )}
                </div>
                {visibleTeams.map((team) => (
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

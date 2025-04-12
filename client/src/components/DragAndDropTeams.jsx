import React, { useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getTeamsWithPlayers } from "../services/teamService";
import {
    updatePlayerTeam,
    updatePlayerTrainingGroup,
} from "../services/playerService";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import {
    deleteHiddenTeam,
    getAllHiddenTeams,
} from "../services/hideTeamService";
import supabase from "../utils/supabase";
import TeamBox from "./TeamBox";
import { useProfile } from "../hooks/useProfile";
import { useTeamsHidden } from "../hooks/useTeamsHidden";
import { useTrainingGroupsHidden } from "../hooks/useTrainingGroupsHidden";
import { deleteHiddenTrainingGroup } from "../services/hideTrainingGroupService"; // USE MUTATION

const DragAndDropTeams = ({ gender, data, queryKey }) => {
    const queryClient = useQueryClient();
    const {
        data: profile,
        isLoading: isUserLoading,
        isError: isUserError,
    } = useProfile();

    const { data: teamsHidden = [] } = useTeamsHidden(gender);
    const { data: trainingGroupsHidden = [] } = useTrainingGroupsHidden(gender);

    const hideTheseTeams = useMemo(() => {
        return queryKey === "teamsWithPlayers"
            ? teamsHidden
            : trainingGroupsHidden;
    }, [queryKey, teamsHidden, trainingGroupsHidden]);

    //  dont show hidden teams
    const visibleTeams = data.filter((team) =>
        queryKey === "teamsWithPlayers"
            ? !teamsHidden.some((hiddenTeam) => hiddenTeam.team_id === team.id)
            : !trainingGroupsHidden.some(
                  (hiddenTrainingGroup) =>
                      hiddenTrainingGroup.traininggroup_id === team.id
              )
    );

    const sortedvisibleTeams = visibleTeams.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    console.log(visibleTeams);

    React.useEffect(() => {
        if (isUserLoading) return;
        // queryClient.invalidateQueries({ queryKey: ["trainingGroups"] });
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
                    queryClient.invalidateQueries({ queryKey: [queryKey] });
                }
            )
            .subscribe((status) => {
                // console.log(status);
            });

        return () => {
            channel.unsubscribe();
        };
    }, [profile]);

    const handlePlayerDrop = async (player, newTeamId) => {
        if (!newTeamId) return;

        const previousTeams = queryClient.getQueryData([queryKey]) || [];
        // console.log("previousTeams", previousTeams);

        // Optimistic update
        queryClient.setQueryData([queryKey], (oldTeams) => {
            // console.log(oldTeams);
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
            if (queryKey == "teamsWithPlayers") {
                await updatePlayerTeam(player.id, newTeamId);
            } else {
                await updatePlayerTrainingGroup(player.id, newTeamId);
            }

            // Optionally invalidate to ensure sync with server
            // queryClient.invalidateQueries({ queryKey: [queryKey] });
        } catch (error) {
            console.error("Failed to update player team:", error);
            // Revert on error
            queryClient.setQueryData([queryKey], previousTeams);
        }
    };

    const handleSetTeamVisibile = async (teamId) => {
        try {
            if (queryKey === "teamsWithPlayers") {
                await deleteHiddenTeam(teamId);
                queryClient.invalidateQueries({ queryKey: ["teamsHidden"] });
            } else {
                await deleteHiddenTrainingGroup(teamId);
                queryClient.invalidateQueries({
                    queryKey: ["trainingGroupsHidden"],
                });
            }
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
                    {hideTheseTeams.length !== 0 ? (
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
                                {hideTheseTeams.map((hiddenTeam) => (
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
                                        {hiddenTeam.Teams?.name}{" "}
                                        {hiddenTeam.TrainingGroups?.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>No teams hidden</div>
                    )}
                </div>
                {sortedvisibleTeams.map((team) => (
                    <TeamBox
                        key={team.id}
                        team={team}
                        queryKey={queryKey}
                        onDrop={handlePlayerDrop}
                    />
                ))}
            </div>
        </DndProvider>
    );
};

export default DragAndDropTeams;

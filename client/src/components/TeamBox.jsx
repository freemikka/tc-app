import React, { useRef, useEffect, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import PlayerItem from "./PlayerItem";
import { deleteTeam } from "../services/teamService";
import { useQueryClient } from "@tanstack/react-query";
import DotMenu from "./DotMenu";
import { useCreateHiddenTeam } from "../mutations/createHiddenTeams";
import { useCreateHiddenTrainingGroups } from "../mutations/createHiddenTrainingGroups";
import { useDeleteTrainingGroup } from "../mutations/deleteTrainingGroup";
import { Separator } from "@/components/ui/separator";

const TeamBox = ({ team, onDrop, queryKey }) => {
    const queryClient = useQueryClient();
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "PLAYER",
        drop: (item) => onDrop(item, team.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));
    const boxRef = useRef(null);

    // Apply background color directly instead of triggering a re-render
    useEffect(() => {
        if (boxRef.current) {
            boxRef.current.style.backgroundColor = isOver ? "#bfdbfe" : "white";
        }
    }, [isOver]);

    const sortFn = (a, b) => {
        if (a.position.positionId !== b.position.positionId)
            return a.position.positionId - b.position.positionId;
        else return a.firstName.localeCompare(b.firstName);
    };
    // Sort players groups alphabetically and by id
    const sortedPlayers = useMemo(() => {
        return [...team.players].sort(sortFn);
    }, [team.players]);

    const teamBoxLength = Math.max(sortedPlayers.length * 9.5, 100);
    const { mutate: createHidden } = useCreateHiddenTeam();
    const { mutate: createHiddenTrainingGroup } =
        useCreateHiddenTrainingGroups();
    const { mutate: deleteTrainingGroup } = useDeleteTrainingGroup();

    const handleHideTeam = (teamId) => {
        if (queryKey == "teamsWithPlayers") {
            createHidden(teamId);
        } else {
            createHiddenTrainingGroup(teamId);
        }
    };

    const handleMenuClick = async (MENU_TYPE) => {
        // handleClose();
        if (MENU_TYPE === "DELETE TEAM") {
            try {
                if (queryKey == "teamsWithPlayers") {
                    await deleteTeam(team.id); // Pass teamId to your service
                    queryClient.invalidateQueries({
                        queryKey: [queryKey],
                    });
                } else {
                    deleteTrainingGroup(team.id); // Pass teamId to your service
                }

                // Handle successful deletion (maybe update parent component state)
            } catch (error) {
                console.error("Error deleting team:", error);
            }
        }

        if (MENU_TYPE === "HIDE TEAM") {
            // Collapse the team so it no longer shows up
            handleHideTeam(team.id);
        }

        if (MENU_TYPE === "Update team") {
            console.log("not implemented");
        }
    };

    const menuItems = [
        {
            name: "Delete team",
            handleMenuClick: handleMenuClick,
            MENU_TYPE: "DELETE TEAM",
            MENU_ACTION: null,
        },
        {
            name: "Hide team",
            handleMenuClick: handleMenuClick,
            MENU_TYPE: "HIDE TEAM",
            MENU_ACTION: null,
        },
        {
            name: "Update team",
            handleMenuClick: handleMenuClick,
            MENU_TYPE: "UPDATE TEAM",
            MENU_ACTION: null,
        },
    ];

    return (
        <div
            ref={(node) => {
                drop(node);
                boxRef.current = node;
            }}
            style={{
                padding: "16px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                // backgroundColor: isOver ? "#bfdbfe" : "white",
                // height: `${teamBoxLength}vh`,
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
                <h2 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-2xl">
                    {team.name}
                </h2>

                {/* Menu button on the right */}
                <DotMenu menuItems={menuItems} />
            </div>
            <Separator className="mb-2" />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0px",
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

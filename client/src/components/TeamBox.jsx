import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import PlayerItem from "./PlayerItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { deleteTeam } from "../services/teamService";
import { createHiddenTeam } from "../services/hideTeamService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const TeamBox = ({ team, onDrop }) => {
    // const [teamVisibility, setTeamVisibility] = useState(false);
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

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const mutation = useMutation({
        mutationFn: createHiddenTeam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hiddenTeams"] });
        },
        onError: (err) => {
            console.error("Failed creating player:", err.message);
        },
    });

    const handleClick = (event) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = async (option) => {
        handleClose();
        // You can also add specific logic here
        if (option === 0) {
            try {
                const response = await deleteTeam(team.id); // Pass teamId to your service
                queryClient.invalidateQueries({ queryKey: ["teams"] });
                // Handle successful deletion (maybe update parent component state)
            } catch (error) {
                console.error("Error deleting team:", error);
            }
            // Do something specific
        }

        if (option === 1) {
            // Collapse the team so it no longer shows up
            // setTeamVisibility(!teamVisibility);

            try {
                const response = await createHiddenTeam(team.id);
                queryClient.invalidateQueries({ queryKey: ["hiddenTeams"] });
            } catch (error) {
                console.log("Error creating hidden team", error);
            }
        }
    };
    // teamVisibility
    // ? { display: "none" }
    // :
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
                <div>
                    <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem
                            onClick={() => {
                                handleMenuClick(0);
                            }}
                        >
                            Delete team
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleMenuClick(1);
                            }}
                        >
                            Hide team
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleMenuClick(2);
                            }}
                        >
                            Option 3
                        </MenuItem>
                    </Menu>
                </div>
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

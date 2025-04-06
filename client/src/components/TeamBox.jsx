import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import PlayerItem from "./PlayerItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const TeamBox = ({ team, onDrop }) => {
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

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (option) => {
        handleClose();

        // You can also add specific logic here
        if (option === 0) {
            console.log("Delete team");
            // Do something specific
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
                minHeight: "200px",
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
                            Option 2
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
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
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

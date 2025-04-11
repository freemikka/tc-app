import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const DotMenu = ({ handleMenuClick }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
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
    );
};

export default DotMenu;

import React, { useState, memo } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const DotMenu = ({ menuItems }) => {
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
            {open && (
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                >
                    {menuItems.map((menuItem) => {
                        return (
                            <MenuItem
                                key={menuItem.name}
                                id={menuItem.name}
                                onClick={() =>
                                    menuItem.handleMenuClick(
                                        menuItem.MENU_TYPE,
                                        menuItem.MENU_ACTION
                                    )
                                }
                            >
                                {menuItem.name}
                            </MenuItem>
                        );
                    })}
                </Menu>
            )}
        </div>
    );
};

export default memo(DotMenu);

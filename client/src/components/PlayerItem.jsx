import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import DotMenu from "./DotMenu";
import { useDeletePlayer } from "../mutations/deletePlayer";
import { useUpdatePlayerPosition } from "../mutations/updatePlayerPosition";

// Player ID based styling
const getPlayerStyle = (playerId) => {
    // Example: Different colors based on player ID
    const colors = {
        3: "8px solid #ff0000", // Setter
        4: "8px solid #02c923", // Middle
        5: "8px solid #a69b06", // Outside
        6: "8px solid #0008f0", // Diagonal
        7: "8px solid #dc179a", // Libero
        8: "8px solid #928c90", // No position
        9: "8px solid #ff0000", // Interest Setter
        10: "8px solid #02c923", // Interest Middle
        11: "8px solid #a69b06", // Interest Outside
        12: "8px solid #0008f0", // Interest Diagonal
        13: "8px solid #dc179a", // Interest Libero
        // Add more specific player styles as needed
    };

    // Default style
    const defaultStyle = {
        borderLeft: "8px solid #4CAF50", // Green accent by default
    };

    // If player has specific styling
    if (colors[playerId]) {
        return {
            padding: "8px",
            marginBottom: "4px",
            borderTop: "1px solid #ddd",
            borderRight: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "move",
            backgroundColor: "white",
            borderLeft: colors[playerId],
            fontStyle: playerId > 8 ? "italic" : "normal",
        };
    }
};

const PlayerItem = ({ player, onDrop }) => {
    const { mutate: mutateDeletePlayer } = useDeletePlayer();
    const { mutate: mutatePlayerPosition } = useUpdatePlayerPosition();

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "PLAYER",
        item: player,
        end: (item, monitor) => {
            if (!monitor.didDrop()) {
                // If not dropped on a valid target, notify parent to cancel
                onDrop(item, null);
            }
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const handleMenuClick = (option) => {
        if (option === 0) {
            //delete player
            mutateDeletePlayer(player.id);
        } else {
            mutatePlayerPosition({
                playerId: player.id,
                newPositionId: option + 2, // This is weird but due to how Supabase has stored the ID for each position. Should prob think of something better
            });
        }
    };

    const playerStyle = getPlayerStyle(player.position);

    const menuItems = [
        {
            name: "Delete player",
            handleMenuClick: handleMenuClick,
            option: 0,
        },
        {
            name: "Make setter",
            handleMenuClick: handleMenuClick,
            option: 1,
        },
        {
            name: "Make middle",
            handleMenuClick: handleMenuClick,
            option: 2,
        },
        {
            name: "Make outside",
            handleMenuClick: handleMenuClick,
            option: 3,
        },
        {
            name: "Make diagonal",
            handleMenuClick: handleMenuClick,
            option: 4,
        },
        {
            name: "Make libero",
            handleMenuClick: handleMenuClick,
            option: 5,
        },
        {
            name: "No position",
            handleMenuClick: handleMenuClick,
            option: 6,
        },
        {
            name: "Interest setter",
            handleMenuClick: handleMenuClick,
            option: 7,
        },
        {
            name: "Interest middle",
            handleMenuClick: handleMenuClick,
            option: 8,
        },
        {
            name: "Interest outside",
            handleMenuClick: handleMenuClick,
            option: 9,
        },
        {
            name: "Interest diagonal",
            handleMenuClick: handleMenuClick,
            option: 10,
        },
        {
            name: "Interest libero",
            handleMenuClick: handleMenuClick,
            option: 11,
        },
    ];

    return (
        <div
            ref={drag}
            style={{
                ...playerStyle,
                opacity: isDragging ? 0.5 : 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "2px",
                justifyContent: "space-between",
                paddingLeft: "8px",
                paddingTop: "0px",
                paddingBottom: "0px",
            }}
        >
            {player.firstName} {player.lastName}
            <DotMenu menuItems={menuItems} />
        </div>
    );
};

export default PlayerItem;

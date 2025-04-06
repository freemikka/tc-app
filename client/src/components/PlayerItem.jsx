import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";

const PlayerItem = ({ player, onDrop }) => {
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

    const playerStyle = getPlayerStyle(player.position_id);

    return (
        <div
            ref={drag}
            style={{
                ...playerStyle,
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            {player.first_name} {player.last_name}
        </div>
    );
};

// Player ID based styling
const getPlayerStyle = (playerId) => {
    // Example: Different colors based on player ID
    const colors = {
        3: "8px solid rgb(255, 0, 0)", // Setter
        4: "8px solid rgb(2, 201, 35)", // Middle
        5: "8px solid rgb(255, 238, 0)", // Outside
        6: "8px solid rgb(0, 8, 240)", // Diagonal
        7: "8px solid rgb(205, 127, 50)", // Libero
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
        };
    }
};

export default PlayerItem;

import React, { useCallback, useMemo, memo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import DotMenu from "./DotMenu";
import { useDeletePlayer } from "../mutations/deletePlayer";
import { useUpdatePlayerPosition } from "../mutations/updatePlayerPosition";

// Player ID based styling
const getPlayerStyle = (playerId, playerColor, positionName) => {
    // If player has specific styling
    return {
        padding: "2px",
        marginBottom: "4px",
        borderTop: "1px solid #ddd",
        borderRight: "1px solid #ddd",
        borderBottom: "1px solid #ddd",
        borderRadius: "4px",
        cursor: "move",
        backgroundColor: "white",
        fontSize: "16px",
        fontStyle: positionName.includes("interest") ? "italic" : "normal",
        borderLeft: `8px solid ${playerColor}`,
        textDecoration: positionName.includes("uitgeschreven")
            ? "line-through"
            : "",
    };
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

    // console.log("Playeritem");

    const handleMenuClick = useCallback((option) => {
        if (option === 0) {
            //delete player
            mutateDeletePlayer(player.id);
        } else {
            mutatePlayerPosition({
                playerId: player.id,
                newPositionId: option - 1, // since the first option is to delete a player we minus one this to get the correct position
            });
        }
    });

    const playerStyle = getPlayerStyle(
        player.position.positionId,
        player.position.positionColor,
        player.position.positionName
    );

    const menuItems = useMemo(() => [
        {
            name: "Delete player",
            handleMenuClick: handleMenuClick,
            option: 0,
        },
        {
            name: "Setter",
            handleMenuClick: handleMenuClick,
            option: 1,
        },
        {
            name: "Diagonaal",
            handleMenuClick: handleMenuClick,
            option: 3,
        },
        {
            name: "Passer-loper",
            handleMenuClick: handleMenuClick,
            option: 5,
        },
        {
            name: "Midden",
            handleMenuClick: handleMenuClick,
            option: 7,
        },
        {
            name: "Libero",
            handleMenuClick: handleMenuClick,
            option: 9,
        },
        {
            name: "Geen positie",
            handleMenuClick: handleMenuClick,
            option: 11,
        },
        {
            name: "Trainingslid",
            handleMenuClick: handleMenuClick,
            option: 13,
        },
        {
            name: "Setter (interesse)",
            handleMenuClick: handleMenuClick,
            option: 2,
        },
        {
            name: "Diagonaal (interesse)",
            handleMenuClick: handleMenuClick,
            option: 4,
        },
        {
            name: "Passer-loper (interesse)",
            handleMenuClick: handleMenuClick,
            option: 6,
        },
        {
            name: "Midden (interesse)",
            handleMenuClick: handleMenuClick,
            option: 8,
        },
        {
            name: "Libero (interesse)",
            handleMenuClick: handleMenuClick,
            option: 10,
        },
        {
            name: "Geen positie (interesse)",
            handleMenuClick: handleMenuClick,
            option: 12,
        },
        {
            name: "Trainingslid (interesse)",
            handleMenuClick: handleMenuClick,
            option: 14,
        },
        {
            name: "Uitgeschreven",
            handleMenuClick: handleMenuClick,
            option: 15,
        },
    ]);

    return (
        <div
            ref={drag}
            style={{
                ...playerStyle,
                opacity: isDragging ? 0.5 : 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
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

export default memo(PlayerItem);

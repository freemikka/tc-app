import React, { useCallback, useMemo, memo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import DotMenu from "./DotMenu";
import { useDeletePlayer } from "../mutations/deletePlayer";
import { useUpdatePlayerPosition } from "../mutations/updatePlayerPosition";
import { usePositions } from "../hooks/usePositions";
import AddPlayerForm from "./AddPlayerForm";
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
        fontStyle: positionName.includes("Interest") ? "italic" : "normal",
        borderLeft: `8px solid ${playerColor}`,
        textDecoration: positionName.includes("Uitgeschreven")
            ? "line-through"
            : "",
    };
};

const PlayerItem = ({ player, onDrop }) => {
    const { mutate: mutateDeletePlayer } = useDeletePlayer();
    const { mutate: mutatePlayerPosition } = useUpdatePlayerPosition();

    const {
        data: positions,
        isLoading: isPositionsLoading,
        isError: isPositionsError,
    } = usePositions();

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

    const handleMenuClick = useCallback((MENU_TYPE, MENU_ACTION) => {
        if (MENU_TYPE === "DELETE") {
            //delete player
            mutateDeletePlayer(player.id);
        } else if (MENU_TYPE === "UPDATE PLAYER") {
            return <AddPlayerForm />;
        } else if (MENU_TYPE === "UPDATE POSITION") {
            mutatePlayerPosition({
                playerId: player.id,
                newPositionId: MENU_ACTION,
            });
        }
    });

    const playerStyle = getPlayerStyle(
        player.position.positionId,
        player.position.positionColor,
        player.position.positionName
    );

    const menuItems = useMemo(() => {
        if (!positions) return [];

        return [
            {
                name: "Delete player",
                handleMenuClick: handleMenuClick,
                MENU_TYPE: "DELETE",
                MENU_ACTION: null,
            },
            {
                name: "Update player",
                handleMenuClick: handleMenuClick,
                MENU_TYPE: "UPDATE PLAYER",
                MENU_ACTION: null,
            },
            ...positions.map((position) => ({
                name: position.position_name,
                handleMenuClick: handleMenuClick,
                MENU_TYPE: "UPDATE POSITION",
                MENU_ACTION: position.id,
            })),
        ];
    }, [positions, handleMenuClick]);

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

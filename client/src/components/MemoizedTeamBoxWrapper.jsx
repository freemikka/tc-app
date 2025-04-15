import React from "react";
import TeamBox from "./TeamBox";

const MemoizedTeamBoxWrapper = React.memo(
    ({ teamId, name, players, queryKey, onDrop }) => {
        const team = { id: teamId, name, players };
        return <TeamBox team={team} queryKey={queryKey} onDrop={onDrop} />;
    }
);
export default MemoizedTeamBoxWrapper;

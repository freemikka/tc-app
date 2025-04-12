import { Player, TeamWithPlayers } from "../types/types";

export const mapPlayer = (player: any): Player => ({
    id: player.id,
    firstName: player.first_name,
    lastName: player.last_name,
    email: player.email,
    position: player.position_id?.toString(), // or a mapping from ID to name
    team: player.team,
});

export const mapTeamWithPlayers = (team: any): TeamWithPlayers => ({
    id: team.id,
    name: team.name,
    gender: team.gender,
    players: (team.players || []).map(mapPlayer),
});

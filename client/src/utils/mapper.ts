import {
    Player,
    TeamWithPlayers,
    TrainingGroupWithPlayers,
} from "../types/types";

export const mapPlayer = (player: any): Player => ({
    id: player.id,
    firstName: player.first_name,
    lastName: player.last_name,
    email: player.email,
    position: player.position_id?.toString(), // or a mapping from ID to name
    team: player.team,
    trainingGroup: player.traininggroup_id,
});

export const mapTeamWithPlayers = (team: any): TeamWithPlayers => ({
    id: team.id,
    name: team.name,
    gender: team.gender,
    players: (team.players || []).map(mapPlayer),
});

export const mapTrainingGroupWithPlayers = (
    trainingGroup: any
): TrainingGroupWithPlayers => ({
    id: trainingGroup.id,
    name: trainingGroup.name,
    gender: trainingGroup.gender,
    players: (trainingGroup.players || []).map(mapPlayer),
});

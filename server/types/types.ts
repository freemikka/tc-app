export interface Player {
    id: number;
    name: string;
    team: string;
}

export interface Team {
    id: number;
    name: string;
    associationID: number;
}

export interface PlayerWithPosition {
    id: string;
    first_name: string;
    last_name: string;
    position_id: number;
}

export interface TeamWithPlayers {
    id: string;
    name: string;
    players: PlayerWithPosition[];
}

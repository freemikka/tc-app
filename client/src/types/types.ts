export interface Player {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    team: string;
}

export interface TeamWithPlayers {
    id: string;
    name: string;
    players: Player[];
}

export default interface Team {
    id: number;
    name: string;
}

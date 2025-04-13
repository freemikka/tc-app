export interface Player {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    position: number;
    team: string;
    trainingGroup: string;
}

export interface TeamWithPlayers {
    id: string;
    name: string;
    gender: string;
    players: Player[];
}

export interface TrainingGroupWithPlayers {
    id: string;
    name: string;
    gender: string;
    players: Player[];
}

export interface Team {
    id: number;
    name: string;
    gender: string;
}

export interface trainingGroup {
    name: string;
    gender: string;
}

export interface Player {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    // position: number;
    position: Position;
}

export interface Position {
    positionId: number;
    associationId: number;
    positionName: string;
    positionColor: string;
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

export interface Association {
    name: string;
}

export interface AcceptRequestData {
    userId: string;
    associationId: number;
}

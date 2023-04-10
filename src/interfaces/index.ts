export interface Room {
    id: string,
    code: string,
    size: number,
    guests? : Guest[],
    blocks? : Topic_Block[],
}

export interface Guest {
    id: string,
    name: string,
    password: string,
    connected_room: Room,
    roomId: string,
    Topic_Block: Topic_Block[],
}

export interface Admin {
    id: string,
    username: string,
    password: string,
}

export interface Topic_Block {
    id: string,
    content: string,
    guest?: Guest,
    room?: Room,
    guestId?: string,
    roomId: string,
}

export interface LoginPayload {
    User:{Name:string,Gender:string}
}

export interface WSPayload {
    Type:string,
    User:{ID:string,RoomID:string,Name:string,Gender:string},
    SDP:any,
    ICE:any,
}

export interface JoinedRoomPayload {
    RoomID:string,
    Offer:any,
}
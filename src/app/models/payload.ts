export interface LoginPayload {
    User:{Name:string,Gender:string}
}

export interface WSPayload {
    Type:string,
    User:{Name:string,Gender:string},
    SDP:any,
    ICE:any,
}
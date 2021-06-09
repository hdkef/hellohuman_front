export interface LoginResponse {
    User:{ID:string,Name:string,Gender:string}
}

export interface RoomResponse {
    Type:string,
    RoomID:string,
	SDP:any,
	Peer:{ID:string,Name:string,Gender:string},
}

export interface ICEResponse  {
	Type:string,
	ICE:any
}

export interface AnswerResponse  {
	Type:string,
	SDP:any,
	Peer:{ID:string,Name:string,Gender:string},
}
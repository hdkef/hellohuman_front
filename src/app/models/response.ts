export interface LoginResponse {
    User:{ID:string,Name:string,Gender:string}
}

export interface RoomResponse {
    Type:string,
    RoomID:string,
}

export interface ICEResponse  {
	Type:string,
	ICE:any
}

export interface OfferAnswerResponse  {
	Type:string,
	SDP:any,
}
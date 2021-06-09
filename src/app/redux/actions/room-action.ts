import { Action } from "@ngrx/store"
import { Chat } from "src/app/models/chat"

export const SEND_CHAT = "Room Send Chat"
export const STOP_WS = "Room Stop WS"
export const SEND_ICE = "Room Send ICE"
export const SEND_SDP = "Room Send SDP"
export const INIT_WS = "Room Init WS"
export const RECEIVE_ROOM_ID = "Room Receive RoomID"
export const RECEIVE_PEER_INFO = "Room Receive Peer Info"
export const RECEIVE_PEER_INFO_AND_ROOM_ID = "Room Receive Peer Info And RoomID"
export const RESET_ROOM = "Room Reset Room"
export const DESTROY_ROOM = "Room Destroy"
export const INSERT_USER_CHAT = "Room Insert User Chat"
export const INSERT_PEER_CHAT = "Room Insert Peer Chat"
export const SEND_INFO = "Room Send Info"

export class ResetRoom implements Action{
    type: string = RESET_ROOM
    constructor(){}
}

export class ReceivePeerInfo implements Action{
    type: string = RECEIVE_PEER_INFO
    constructor(public payload:{ID:string,Name:string,Gender:string}){}
}

export class ReceivePeerInfoAndRoomID implements Action{
    type: string = RECEIVE_PEER_INFO_AND_ROOM_ID
    constructor(public payload:{RoomID:string,Peer:{ID:string,Name:string,Gender:string}}){}
}

export class SendChat implements Action{
    type: string = SEND_CHAT
    constructor(public payload:string){}
}

export class SendInfo implements Action{
    type: string = SEND_INFO
    constructor(public payload:string){}
}

export class StopWS implements Action{
    type: string = STOP_WS
    constructor(){}
}

export class SendICE implements Action{
    type: string = SEND_ICE
    constructor(public payload:{ICE:any}){}
}

export class SendSDP implements Action{
    type: string = SEND_SDP
    constructor(public payload:{SDP:any,Type:string}){}
}

export class InitWS implements Action{
    type: string = INIT_WS
    constructor(){}
}

export class InsertUserChat implements Action{
    type: string = INSERT_USER_CHAT
    constructor(public payload:Chat){}
}

export class InsertPeerChat implements Action{
    type: string = INSERT_PEER_CHAT
    constructor(public payload:Chat){}
}

export class ReceiveRoomID implements Action{
    type: string = RECEIVE_ROOM_ID
    constructor(public payload:string){}
}

export class Destroy implements Action{
    type: string = DESTROY_ROOM
    constructor(){}
}
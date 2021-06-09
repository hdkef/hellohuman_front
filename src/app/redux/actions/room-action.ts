import { Action } from "@ngrx/store"
import { Chat } from "src/app/models/chat"

export const RECEIVE_ROOM_ID = "Room Receive RoomID"
export const DESTROY_ROOM = "Room Destroy"
export const INSERT_USER_CHAT = "Room Insert User Chat"
export const INSERT_PEER_CHAT = "Room Insert Peer Chat"

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
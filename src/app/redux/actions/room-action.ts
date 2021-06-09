import { Action } from "@ngrx/store"

export const RECEIVE_ROOM_ID = "Room Receive RoomID"
export const DESTROY_ROOM = "Room Destroy"

export class ReceiveRoomID implements Action{
    type: string = RECEIVE_ROOM_ID
    constructor(public payload:string){}
}

export class Destroy implements Action{
    type: string = DESTROY_ROOM
    constructor(){}
}
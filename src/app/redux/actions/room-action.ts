import { Action } from "@ngrx/store"

export const RECEIVE_ROOM_ID = "Room Receive RoomID"

export class ReceiveRoomID implements Action{
    type: string = RECEIVE_ROOM_ID
    constructor(public payload:string){}
}
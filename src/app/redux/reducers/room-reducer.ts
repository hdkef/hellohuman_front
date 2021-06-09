import { Chat } from 'src/app/models/chat'
import * as fromRoomAction from '../actions/room-action'

export interface State {
    RoomID:string,
    ICES:any[],
    Offer:any,
    Answer:any,
    Info:string,
    ChatBox:Chat[],
}

const initialState:State = {
    RoomID:"",
    ICES:null,
    Offer:null,
    Answer:null,
    Info:"",
    ChatBox:null,
}

export function roomReducer (
    state:State = initialState,
    action
){
    let oldChatBox = state.ChatBox
    switch (action.payload){
        case fromRoomAction.INSERT_PEER_CHAT:
            if (!oldChatBox){
                let newChatBox = [action.payload]
                return {...state,ChatBox:newChatBox}
            }else{
                let newChatBox = [action.payload,...oldChatBox]
                return {...state,ChatBox:newChatBox}
            }
        case fromRoomAction.INSERT_USER_CHAT:
            if (!oldChatBox){
                let newChatBox = [action.payload]
                return {...state,ChatBox:newChatBox}
            }else{
                let newChatBox = [action.payload,...oldChatBox]
                return {...state,ChatBox:newChatBox}
            }
        case fromRoomAction.DESTROY_ROOM:
            return initialState
        case fromRoomAction.RECEIVE_ROOM_ID:
            return {...state,RoomID:action.payload}
        default:
            return state
    }
}
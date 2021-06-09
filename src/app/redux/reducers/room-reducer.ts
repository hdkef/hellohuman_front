import { Chat } from 'src/app/models/chat'
import * as fromRoomAction from '../actions/room-action'

export interface State {
    RoomID:string,
    ICES:any[],
    Offer:any,
    Answer:any,
    Info:string,
    ChatBox:Chat[],
    Peer:{ID:string,Name:string,Gender:string},
}

const initialState:State = {
    RoomID:"",
    ICES:null,
    Offer:null,
    Answer:null,
    Info:"",
    ChatBox:null,
    Peer:null,
}

export function roomReducer (
    state:State = initialState,
    action
){
    let oldChatBox = state.ChatBox
    switch (action.type){
        case fromRoomAction.RESET_ROOM:
            return initialState
        case fromRoomAction.RECEIVE_PEER_INFO_AND_ROOM_ID:
            return {...state,RoomID:action.payload.RoomID,Peer:action.payload.Peer}
        case fromRoomAction.RECEIVE_PEER_INFO:
            return {...state,Peer:action.payload}
        case fromRoomAction.SEND_INFO:
            return {...state,Info:action.payload}
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
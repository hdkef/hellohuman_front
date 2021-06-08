import * as fromRoomAction from '../actions/room-action'

export interface State {
    RoomID:string,
    ICES:any[],
    Offer:any,
    Answer:any,
    Info:string,
}

const initialState:State = {
    RoomID:"",
    ICES:null,
    Offer:null,
    Answer:null,
    Info:"",
}

export function roomReducer (
    state:State = initialState,
    action
){
    let oldICES = state.ICES 
    switch (action.payload){
        case fromRoomAction.SEND_INFO:
            return {...state,Info:action.payload}
        case fromRoomAction.DESTROY_ROOM:
            return initialState
        case fromRoomAction.RECEIVE_ROOM_ID:
            return {...state,RoomID:action.payload}
        case fromRoomAction.RECEIVE_OFFER:
            return {...state,Offer:action.payload}
        case fromRoomAction.RECEIVE_ANSWER:
            return {...state,Answer:action.payload}
        case fromRoomAction.RECEIVE_ICE:
            let newICES = [action.payload,...oldICES]
            return {...state,ICES:newICES}
        default:
            return state
    }
}
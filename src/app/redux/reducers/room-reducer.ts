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
        case fromRoomAction.RECEIVE_ROOM_ID:
            return {...state,RoomID:action.payload}
        default:
            return state
    }
}
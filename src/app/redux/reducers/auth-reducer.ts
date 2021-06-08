import * as fromAuthAction from '../actions/auth-action'

export interface State {
    ID:string,
    Name:string,
    Gender:string,
    Info:string,
}

const initialState:State = {
    ID:"",
    Name:"",
    Gender:"",
    Info:"",
}

export function authReducer (
    state:State = initialState,
    action
){
    switch(action.type){
        case fromAuthAction.SEND_INFO:
            return {...state,Info:action.payload}
        case fromAuthAction.LOGIN_OK:
            return {...state,ID:action.payload.User.ID,Name:action.payload.User.Name,Gender:action.payload.User.Gender}
        default:
            return state
    }
}
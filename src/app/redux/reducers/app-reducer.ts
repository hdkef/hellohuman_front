import { ActionReducerMap } from "@ngrx/store";
import * as fromAuth from './auth-reducer'
import * as fromRoom from './room-reducer'

export interface AppState {
    auth:fromAuth.State,
    room:fromRoom.State,
}


export const AppReducer: ActionReducerMap<AppState> = {
    auth:fromAuth.authReducer,
    room:fromRoom.roomReducer,
}
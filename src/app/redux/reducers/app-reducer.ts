import { ActionReducerMap } from "@ngrx/store";
import * as fromAuth from './auth-reducer'

export interface AppState {
    auth:fromAuth.State,
}


export const AppReducer: ActionReducerMap<AppState> = {
    auth:fromAuth.authReducer,
}
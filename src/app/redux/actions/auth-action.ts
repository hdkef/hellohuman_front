import { Action } from "@ngrx/store";
import * as fromPayload from '../../models/payload'
import * as fromResponse from '../../models/response'

export const LOGIN_START = "Auth Login Start"
export const LOGIN_OK = "Auth Login OK"
export const SEND_INFO = "Auth Send Info"

export class LoginStart implements Action {
    type: string = LOGIN_START

    constructor(public payload:fromPayload.LoginPayload){}
}

export class LoginOK implements Action {
    type: string = LOGIN_OK

    constructor(public payload:fromResponse.LoginResponse){}
}

export class SendInfo implements Action {
    type: string = SEND_INFO

    constructor(public payload:string){}
}
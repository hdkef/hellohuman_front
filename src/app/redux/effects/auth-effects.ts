import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as fromAuthAction from '../actions/auth-action'
import {HttpClient} from '@angular/common/http'
import { api } from "src/environments/environment";
import { of } from "rxjs";
import { catchError, map, switchMap } from 'rxjs/operators'
import * as fromResponse from '../../models/response'

@Injectable()
export class AuthEffect {
    constructor(private action$:Actions, private http:HttpClient){}

    loginStart = createEffect(()=>{
        return this.action$.pipe(
            ofType(fromAuthAction.LOGIN_START),
            switchMap((action:fromAuthAction.LoginStart)=>{
                let payload = JSON.stringify(action.payload)
                return this.http.post<fromResponse.LoginResponse>(`${api.login}`,payload).pipe(
                    map((data)=>{
                        return new fromAuthAction.LoginOK(data)
                    }),
                    catchError((err)=>{
                        alert(err.error)
                        return of(new fromAuthAction.SendInfo(err.error))
                    })
                )
            })
        )
    })
}

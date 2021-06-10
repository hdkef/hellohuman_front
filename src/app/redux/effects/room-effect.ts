import { EventEmitter, Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { api } from 'src/environments/environment';
import { AppState } from '../reducers/app-reducer';
import { staticvar } from '../../static/type';
import * as fromRoomAction from '../actions/room-action'
import { ICEResponse, AnswerResponse, RoomResponse, ChatResponse } from '../../models/response';
import { WSPayload } from "src/app/models/payload";
import { Chat } from "../../models/chat";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoomEffect {

  constructor(private store:Store<AppState>, private action$:Actions) { }

    joinedRoomEvent:EventEmitter<RoomResponse> = new EventEmitter<RoomResponse>()
    createdRoomEvent:EventEmitter<boolean> = new EventEmitter<boolean>()
    answerFromServerEvent:EventEmitter<AnswerResponse> = new EventEmitter<AnswerResponse>()
    ICEFromServerEvent:EventEmitter<any> = new EventEmitter<any>()
    peerDisconnectedEvent:EventEmitter<boolean> = new EventEmitter<boolean>()

    ws:WebSocket

    getJoinedRoomEvent(){
        return this.joinedRoomEvent
    }

    getCreatedRoomEvent(){
        return this.createdRoomEvent
    }

    getAnswerFromServerEvent(){
        return this.answerFromServerEvent
    }

    getICEFromServerEvent(){
        return this.ICEFromServerEvent
    }

    getPeerDisconnectedEvent(){
        return this.peerDisconnectedEvent
    }

    initWS = createEffect(()=>{
        return this.action$.pipe(
            ofType(fromRoomAction.INIT_WS),
            withLatestFrom(this.store.select("auth")),
            switchMap((value)=>{
                let action:fromRoomAction.InitWS = value[0]
                let state = value[1]
                let ok = this.tryInitWS(state.ID,state.Name,state.Gender)
                if (ok){
                    return of(new fromRoomAction.SendInfo("WS Established"))
                }else{
                    return of(new fromRoomAction.SendInfo("WS Error"))
                }
            })
        )
    })

    sendSDP = createEffect(()=>{
        return this.action$.pipe(
            ofType(fromRoomAction.SEND_SDP),
            withLatestFrom(this.store.select("auth"),this.store.select("room")),
            map((value)=>{
                let action:fromRoomAction.SendSDP = value[0]
                let auth = value[1]
                let room = value[2]
                let payload:WSPayload = {
                    Type:action.payload.Type,
                    User:{ID:auth.ID,Name:auth.Name,Gender:auth.Gender,RoomID:room.RoomID},
                    SDP:action.payload.SDP,
                    ICE:null,
                    Text:null,
                    Peer:null,
                }
                this.ws.send(JSON.stringify(payload))
            })
        )
    },{ dispatch: false })

    sendICE = createEffect(()=>{
        return this.action$.pipe(
            ofType(fromRoomAction.SEND_ICE),
            withLatestFrom(this.store.select("auth"),this.store.select("room")),
            map((value)=>{
                let action:fromRoomAction.SendICE = value[0]
                let auth = value[1]
                let room = value[2]
                let payload:WSPayload = {
                    Type:staticvar.ICEFromClient,
                    User:{ID:auth.ID,Name:auth.Name,Gender:auth.Gender,RoomID:room.RoomID},
                    SDP:null,
                    ICE:action.payload.ICE,
                    Text:null,
                    Peer:null,
                }
                this.ws.send(JSON.stringify(payload))
            })
        )
    },{dispatch:false})

    stopWS = createEffect(()=>{
        return this.action$.pipe(
            ofType(fromRoomAction.STOP_WS),
            switchMap(()=>{
                this.ws.close()
                this.ws = null
                return of(new fromRoomAction.SendInfo("Peer Disconnected"))
            })
        )
    })

    sendChat = createEffect(()=>{
        return this.action$.pipe(
            ofType(fromRoomAction.SEND_CHAT),
            withLatestFrom(this.store.select("auth"),this.store.select("room")),
            map((value)=>{
                console.log("sendChat")
                let action:fromRoomAction.SendChat = value[0]
                let auth = value[1]
                let room = value[2]
                let payload:WSPayload = {
                    Type:staticvar.ChatFromClient,
                    User:{ID:auth.ID,Name:auth.Name,Gender:auth.Gender,RoomID:room.RoomID},
                    SDP:null,
                    ICE:null,
                    Text:action.payload,
                    Peer:{ID:room.Peer.ID,Name:room.Peer.Name,Gender:room.Peer.Gender,RoomID:room.RoomID},
                }
                this.ws.send(JSON.stringify(payload))
            })
        )
    },{dispatch:false})


    tryInitWS = (ID,Name,Gender)=>{
        try {

            this.ws = new WebSocket(`${api.ws}`)

            this.ws.onopen = (e) => {
              //Implement initFromClient
              let tobesent:WSPayload = {
                Type:staticvar.InitFromClient,
                User:{ID:ID,Name:Name,Gender:Gender,RoomID:null},
                SDP:null,
                ICE:null,
                Text:null,
                Peer:null,
              }
              this.ws.send(JSON.stringify(tobesent))
            }


            this.ws.onmessage = (e) => {
                let data = JSON.parse(e.data)
                let roomRes:RoomResponse = data
                let iceRes:ICEResponse = data
                let sdpRes:AnswerResponse = data
                let chatRes:ChatResponse = data
                let chat:Chat = {
                    Name:chatRes.Name,
                    Text:chatRes.Text,
                    Date:chatRes.Date,
                }
                switch (data.Type){
                    case staticvar.CreatedRoomFromServer:
                        this.store.dispatch(new fromRoomAction.ReceiveRoomID(roomRes.RoomID))
                        this.createdRoomEvent.emit(true)
                        break
                    case staticvar.JoinedRoomFromServer:
                        this.store.dispatch(new fromRoomAction.ReceivePeerInfoAndRoomID(
                            {RoomID:roomRes.RoomID,Peer:roomRes.Peer}
                        ))
                        this.joinedRoomEvent.emit(roomRes)
                        break
                    case staticvar.ICEFromServer:
                        this.ICEFromServerEvent.emit(iceRes.ICE)
                        break
                    case staticvar.AnswerFromServer:
                        this.store.dispatch(new fromRoomAction.ReceivePeerInfo(sdpRes.Peer))
                        this.answerFromServerEvent.emit(sdpRes)
                        break
                    case staticvar.PeerDisconnected:
                        this.peerDisconnectedEvent.emit(true)
                        this.ws.close()
                        this.ws = null
                        break
                    case staticvar.ChatFromMe:
                        console.log("chatfromme")
                        this.store.dispatch(new fromRoomAction.InsertUserChat(chat))
                        break
                    case staticvar.ChatFromPeer:
                        console.log("chatfrompeer")
                        this.store.dispatch(new fromRoomAction.InsertPeerChat(chat))
                        break
                }
            }
            return true
        }catch(err){
            return false
        }
    }

}

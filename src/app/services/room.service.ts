import { EventEmitter, Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { api } from 'src/environments/environment';
import { AppState } from '../redux/reducers/app-reducer';
import { staticvar } from '../static/type';
import * as fromRoomAction from '../redux/actions/room-action'
import { ICEResponse, OfferAnswerResponse, RoomResponse } from '../models/response';
import { Actions } from "@ngrx/effects";
import { WSPayload } from "src/app/models/payload";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private store:Store<AppState>, private action$:Actions) { }

    joinedRoomEvent:EventEmitter<string> = new EventEmitter<string>()
    createdRoomEvent:EventEmitter<string> = new EventEmitter<string>()
    offerFromServerEvent:EventEmitter<any> = new EventEmitter<any>()
    answerFromServerEvent:EventEmitter<any> = new EventEmitter<any>()
    ICEFromServerEvent:EventEmitter<any> = new EventEmitter<any>()

    ws:WebSocket

    getJoinedRoomEvent(){
        return this.joinedRoomEvent
    }

    getCreatedRoomEvent(){
        return this.createdRoomEvent
    }

    getOfferFromServerEvent(){
        return this.offerFromServerEvent
    }

    getAnswerFromServerEvent(){
        return this.answerFromServerEvent
    }

    getICEFromServerEvent(){
        return this.ICEFromServerEvent
    }

    initWS = (payload:{ID:string,Name:string,Gender:string}) => {
        try {

            this.ws = new WebSocket(`${api.ws}`)

            this.ws.onopen = (e) => {
              //Implement initFromClient
              let tobesent:WSPayload = {
                Type:staticvar.InitFromClient,
                User:payload,
                SDP:null,
                ICE:null,
              }
              this.ws.send(JSON.stringify(tobesent))
            }


            this.ws.onmessage = (e) => {
                let data = JSON.parse(e.data)
                let roomRes:RoomResponse = data
                let iceRes:ICEResponse = data
                let sdpRes:OfferAnswerResponse = data
                switch (data.Type){
                    case staticvar.CreatedRoomFromServer:
                        this.createdRoomEvent.emit(roomRes.RoomID)
                        this.store.dispatch(new fromRoomAction.ReceiveRoomID(roomRes.RoomID))
                        break
                    case staticvar.JoinedRoomFromServer:
                        this.joinedRoomEvent.emit(roomRes.RoomID)
                        this.store.dispatch(new fromRoomAction.ReceiveRoomID(roomRes.RoomID))
                        break
                    case staticvar.ICEFromServer:
                        this.ICEFromServerEvent.emit(iceRes.ICE)
                        break
                    case staticvar.OfferFromServer:
                        this.offerFromServerEvent.emit(sdpRes.SDP)
                        break
                    case staticvar.AnswerFromServer:
                        this.answerFromServerEvent.emit(sdpRes.SDP)
                        break
                }
            }
            return true
        }catch(err){
            console.log(err)
            return false
        }
    }


    sendSDP = (SDP:any,Type:string,User:{ID:string,Name:string,Gender:string}) => {
        let payload:WSPayload = {
            Type:Type,
            User:User,
            SDP:SDP,
            ICE:null
        }
        this.ws.send(JSON.stringify(payload))
    }

    sendICE = (ICE:any,User:{ID:string,Name:string,Gender:string}) => {
      let payload:WSPayload = {
          Type:staticvar.ICEFromClient,
          User:User,
          SDP:null,
          ICE:ICE,
      }
      this.ws.send(JSON.stringify(payload))
  }
}

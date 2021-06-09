import { EventEmitter, Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { api } from 'src/environments/environment';
import { AppState } from '../redux/reducers/app-reducer';
import { staticvar } from '../static/type';
import * as fromRoomAction from '../redux/actions/room-action'
import { ICEResponse, AnswerResponse, RoomResponse, ChatResponse } from '../models/response';
import { WSPayload } from "src/app/models/payload";
import { Chat } from "../models/chat";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private store:Store<AppState>) { }

    joinedRoomEvent:EventEmitter<RoomResponse> = new EventEmitter<RoomResponse>()
    createdRoomEvent:EventEmitter<string> = new EventEmitter<string>()
    answerFromServerEvent:EventEmitter<AnswerResponse> = new EventEmitter<AnswerResponse>()
    ICEFromServerEvent:EventEmitter<any> = new EventEmitter<any>()
    peerDisconnectedEvent:EventEmitter<boolean> = new EventEmitter<boolean>()
    RoomID:string

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

    initWS = (ID:string,Name:string,Gender:string) => {
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
                        this.RoomID = roomRes.RoomID
                        this.createdRoomEvent.emit(roomRes.RoomID)
                        this.store.dispatch(new fromRoomAction.ReceiveRoomID(roomRes.RoomID))
                        break
                    case staticvar.JoinedRoomFromServer:
                        this.RoomID = roomRes.RoomID
                        this.joinedRoomEvent.emit(roomRes)
                        this.store.dispatch(new fromRoomAction.ReceiveRoomID(roomRes.RoomID))
                        break
                    case staticvar.ICEFromServer:
                        this.ICEFromServerEvent.emit(iceRes.ICE)
                        break
                    case staticvar.AnswerFromServer:
                        this.answerFromServerEvent.emit(sdpRes)
                        break
                    case staticvar.PeerDisconnected:
                        this.peerDisconnectedEvent.emit(true)
                        this.ws.close()
                        this.ws = null
                        break
                    case staticvar.ChatFromMe:
                        this.store.dispatch(new fromRoomAction.InsertUserChat(chat))
                        break
                    case staticvar.ChatFromPeer:
                        this.store.dispatch(new fromRoomAction.InsertPeerChat(chat))
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
            User:{ID:User.ID,Name:User.Name,Gender:User.Gender,RoomID:this.RoomID},
            SDP:SDP,
            ICE:null,
            Text:null,
            Peer:null,
        }
        this.ws.send(JSON.stringify(payload))
    }

    sendICE = (ICE:any,User:{ID:string,Name:string,Gender:string}) => {
      let payload:WSPayload = {
          Type:staticvar.ICEFromClient,
          User:{ID:User.ID,Name:User.Name,Gender:User.Gender,RoomID:this.RoomID},
          SDP:null,
          ICE:ICE,
          Text:null,
          Peer:null,
      }
      this.ws.send(JSON.stringify(payload))
    }

    stopWS = ()=>{
        this.ws.close()
        this.ws = null
    }

    sendChat = (Text,User:{ID,Name,Gender},Peer:{ID,Name,Gender})=>{
        let payload:WSPayload = {
            Type:staticvar.ChatFromClient,
            User:{ID:User.ID,Name:User.Name,Gender:User.Gender,RoomID:this.RoomID},
            SDP:null,
            ICE:null,
            Text:Text,
            Peer:{ID:Peer.ID,Name:Peer.Name,Gender:Peer.Gender,RoomID:this.RoomID},
        }
        this.ws.send(JSON.stringify(payload))
    }
}

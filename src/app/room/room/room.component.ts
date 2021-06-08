import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { LoginResponse } from 'src/app/models/response';
import { AppState } from 'src/app/redux/reducers/app-reducer';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {

  userAsync:Promise<LoginResponse>
  userInfo:LoginResponse
  authSubs:Subscription
  localVideo:HTMLVideoElement
  remoteVideo:HTMLVideoElement
  joinedRoomEvent:Subscription
  createdRoomEvent:Subscription
  offerFromServerEvent:Subscription
  answerFromServerEvent:Subscription
  ICEFromServerEvent:Subscription

  constructor(private store:Store<AppState>, private roomService:RoomService) { }
  
  
  ngOnDestroy(): void {
    if(this.authSubs){
      this.authSubs.unsubscribe()
    }
  }

  ngOnInit(): void {
    this.joinedRoomEvent = this.roomService.getJoinedRoomEvent().subscribe((event)=>{
      this.handleJoinedRoom(event)
    })
    this.createdRoomEvent = this.roomService.getCreatedRoomEvent().subscribe((event)=>{
      this.handleCreatedRoom(event)
    })
    this.offerFromServerEvent = this.roomService.getOfferFromServerEvent().subscribe((event)=>{
      this.handleOffer(event)
    })
    this.answerFromServerEvent = this.roomService.getAnswerFromServerEvent().subscribe((event)=>{
      this.handleAnswer(event)
    })
    this.ICEFromServerEvent = this.roomService.getICEFromServerEvent().subscribe((event)=>{
      this.handleICE(event)
    })
    this.subscribeAuth()
    this.getVideosElement()
  }

  getVideosElement = () => {
    this.localVideo = <HTMLVideoElement>document.getElementById("localvideo")
    this.remoteVideo = <HTMLVideoElement>document.getElementById("remotevideo")
  }

  subscribeAuth = () => {
    this.authSubs = this.store.select("auth").subscribe((data)=>{
      let ID = data["ID"]
      if (ID){
        let user:LoginResponse = {
          User:{ID:ID,Name:data["Name"],Gender:data["Gender"]}
        }
        this.userInfo = user
        this.userAsync = new Promise((resolve,_)=>{
          resolve(user)
        })
      }
    })
  }

  goLive(){
    this.startWebCam()
    this.roomService.initWS({ID:this.userInfo.User.ID,Name:this.userInfo.User.Name,Gender:this.userInfo.User.Gender})
  }

  goStop(){
    //implements stop streaming and destroy websocket
  }

  startWebCam = async () => {
    console.log(this.localVideo)
    try {
      navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream)=>{
        this.localVideo.srcObject = stream
        this.localVideo.muted = true
      }).catch((err)=>{
        console.log(err)
      })
    }catch(err){
      alert(err.error)
    }
  }

  handleCreatedRoom = (RoomID:string)=>{

  }

  handleJoinedRoom = (RoomID:string)=>{

  }

  handleOffer = (Offer:any)=>{

  }

  handleAnswer = (Answer:any)=>{

  }

  handleICE = (ICE:any)=>{

  }

}

import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AnswerResponse, LoginResponse, RoomResponse } from 'src/app/models/response';
import { AppState } from 'src/app/redux/reducers/app-reducer';
import { RoomService } from 'src/app/services/room.service';
import { staticvar } from 'src/app/static/type';
import { stunserver } from 'src/environments/environment';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})


export class RoomComponent implements OnInit, OnDestroy {

  userAsync:Promise<LoginResponse>
  peerAsync:Promise<LoginResponse>
  userInfo:LoginResponse
  authSubs:Subscription
  localVideo:HTMLVideoElement
  localStream:MediaStream
  remoteVideo:HTMLVideoElement
  joinedRoomEvent:Subscription
  createdRoomEvent:Subscription
  answerFromServerEvent:Subscription
  ICEFromServerEvent:Subscription
  PeerRef:webkitRTCPeerConnection

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
    console.log("goLive")
    this.startWebCamAndInitWS()
  }

  initWS = async ()=>{
    this.roomService.initWS(this.userInfo.User.ID,this.userInfo.User.Name,this.userInfo.User.Gender)
  }

  goStop(){
    //implements stop streaming and destroy websocket
  }

  startWebCamAndInitWS = async () => {
    console.log("startWebCam")
    try {
      navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream)=>{
        console.log("stream",stream)
        this.localVideo.srcObject = stream
        this.localStream = stream
        this.localVideo.muted = true
        this.roomService.initWS(this.userInfo.User.ID,this.userInfo.User.Name,this.userInfo.User.Gender)
      }).catch((err)=>{
        console.log(err)
      })
    }catch(err){
      alert(err.error)
    }
  }

  createPeer = ()=>{
    console.log("createPeer")
    const peer = new RTCPeerConnection({
      iceServers:[{urls:`${stunserver}`}]
    })
    return peer
  }

  createOffer = ()=>{
    console.log("createOffer")
    return this.PeerRef.createOffer().then((offer)=>{
      return this.PeerRef.setLocalDescription(offer)
    }).then(()=>{
      this.roomService.sendSDP(this.PeerRef.localDescription,staticvar.OfferFromClient,this.userInfo.User.ID,this.userInfo.User.Name,this.userInfo.User.Gender)
    })
  }

  sendICE = (event)=>{
    console.log("sendICE")
    let ice = event.candidate
    if (ice){
      this.roomService.sendICE(ice,this.userInfo.User.ID,this.userInfo.User.Name,this.userInfo.User.Gender)
    }
  }

  handlePeerTrack = (event:RTCTrackEvent)=>{
    console.log("handlePeerTrack")
    this.remoteVideo.srcObject = event.streams[0]
  }

  handleCreatedRoom = (RoomID:string)=>{
    console.log("handleCreatedRoom")
    //Implements creating offer and send it to signallingServer
    this.PeerRef = this.createPeer()
    this.PeerRef.onnegotiationneeded = this.createOffer
    this.PeerRef.onicecandidate = this.sendICE
    console.log("localStream",this.localStream)
    this.localStream.getTracks().forEach((track)=>{
      this.PeerRef.addTrack(track,this.localStream)
    })
    //when track is retrieved from other peer, feed that to video srcObject
    this.PeerRef.ontrack = this.handlePeerTrack

    console.log("Created a room. Sending an offer. Waiting an answer.")
  }

  handleJoinedRoom = (payload:RoomResponse)=>{
    console.log("handleJoinedRoom")
    console.log("offer", payload)
    this.peerAsync = new Promise((resolve,_)=>{
      let peer:LoginResponse = {
        User:{ID:payload.Peer.ID,Name:payload.Peer.Name,Gender:payload.Peer.Gender}
      }
      resolve(peer)
    })
    this.PeerRef = this.createPeer()
    this.PeerRef.onicecandidate = this.sendICE
    this.localStream.getTracks().forEach((track)=>{
      this.PeerRef.addTrack(track,this.localStream)
    })
    //when track is retrieved from other peer, feed that to video srcObject
    this.PeerRef.ontrack = this.handlePeerTrack

    //Implements setRemoteDescription(offer) and send answer to signalling server
    return this.PeerRef.setRemoteDescription(new RTCSessionDescription(payload.SDP)).then(()=>{
      return this.PeerRef.createAnswer()
    }).then((answer)=>{
      console.log("answer created ", answer)
      this.roomService.sendSDP(answer,staticvar.AnswerFromClient,this.userInfo.User.ID,this.userInfo.User.Name,this.userInfo.User.Gender)
      return this.PeerRef.setLocalDescription(answer)
    })
  }

  handleAnswer = (payload:AnswerResponse)=>{
    console.log("handleAnswer")
    console.log("Answer", payload)
    this.peerAsync = new Promise((resolve,_)=>{
      let peer:LoginResponse = {
        User:{ID:payload.Peer.ID,Name:payload.Peer.Name,Gender:payload.Peer.Gender}
      }
      resolve(peer)
    })
    //Implements setRemoteDescription(answer)
    return this.PeerRef.setRemoteDescription(new RTCSessionDescription(payload.SDP))
  }

  handleICE = (ICE:any)=>{
    console.log("handleICE")
    //Implements adding ICE candidate to peerConn
    // if (this.PeerRef.localDescription){
      this.PeerRef.addIceCandidate(new RTCIceCandidate(ICE))
    // }
  }

}

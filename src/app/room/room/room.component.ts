import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AnswerResponse, LoginResponse, RoomResponse } from 'src/app/models/response';
import { RoomEffect } from 'src/app/redux/effects/room-effect';
import { AppState } from 'src/app/redux/reducers/app-reducer';
import { staticvar } from 'src/app/static/type';
import { stunserver } from 'src/environments/environment';
import * as fromRoomAction from '../../redux/actions/room-action'

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
  peerDisconnectedEvent:Subscription
  ICEFromServerEvent:Subscription
  PeerRef:webkitRTCPeerConnection
  statusNotStarted:boolean = true
  canChat:boolean = false
  micState = {status:"on",value:true,color:"indianred"}
  vidState = {status:"on",value:true,color:"indianred"}

  constructor(private store:Store<AppState>, private roomService:RoomEffect, private router:Router) { }
  
  
  ngOnDestroy(): void {
    if(this.authSubs){
      this.authSubs.unsubscribe()
    }
  }

  ngOnInit(): void {
    this.store.dispatch(new fromRoomAction.ReceiveRoomID('BACOT'))
    this.joinedRoomEvent = this.roomService.getJoinedRoomEvent().subscribe((event)=>{
      this.handleJoinedRoom(event)
    })
    this.createdRoomEvent = this.roomService.getCreatedRoomEvent().subscribe((event)=>{
      this.handleCreatedRoom()
    })
    this.answerFromServerEvent = this.roomService.getAnswerFromServerEvent().subscribe((event)=>{
      this.handleAnswer(event)
    })
    this.ICEFromServerEvent = this.roomService.getICEFromServerEvent().subscribe((event)=>{
      this.handleICE(event)
    })
    this.peerDisconnectedEvent = this.roomService.getPeerDisconnectedEvent().subscribe((event)=>{
      this.handlePeerDisconnect()
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
    this.startWebCamAndInitWS()
    this.statusNotStarted = false
  }

  goStop(){
    //implements stop streaming and destroy websocket
    this.PeerRef.close()
    this.PeerRef = null
    this.store.dispatch(new fromRoomAction.StopWS())
    this.resetPeerInfo("stopped")
    this.statusNotStarted = true
  }

  startWebCamAndInitWS = async () => {
    try {
      navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream)=>{
        this.localVideo.srcObject = stream
        this.localStream = stream
        this.localVideo.muted = true
        this.store.dispatch(new fromRoomAction.InitWS())
      }).catch((err)=>{
        console.log(err)
      })
    }catch(err){
      alert(err.error)
    }
  }

  createPeer = ()=>{
    const peer = new RTCPeerConnection({
      iceServers:[{urls:`${stunserver}`}]
    })
    return peer
  }

  createOffer = ()=>{
    return this.PeerRef.createOffer().then((offer)=>{
      return this.PeerRef.setLocalDescription(offer)
    }).then(()=>{

      this.store.dispatch(new fromRoomAction.SendSDP(
        {SDP:this.PeerRef.localDescription,
        Type:staticvar.OfferFromClient,
      }
      ))
    })
  }

  sendICE = (event)=>{
    let ice = event.candidate
    if (ice){
      this.store.dispatch(new fromRoomAction.SendICE({ICE:ice}))
    }
  }

  handlePeerTrack = (event:RTCTrackEvent)=>{
    this.remoteVideo.srcObject = event.streams[0]
  }

  handleCreatedRoom = ()=>{
    //Implements creating offer and send it to signallingServer
    this.PeerRef = this.createPeer()
    this.PeerRef.onnegotiationneeded = this.createOffer
    this.PeerRef.onicecandidate = this.sendICE
    this.localStream.getTracks().forEach((track)=>{
      this.PeerRef.addTrack(track,this.localStream)
    })
    //when track is retrieved from other peer, feed that to video srcObject
    this.PeerRef.ontrack = this.handlePeerTrack

  }

  handleJoinedRoom = (payload:RoomResponse)=>{
    this.peerAsync = new Promise((resolve,_)=>{
      let peer:LoginResponse = {
        User:{ID:payload.Peer.ID,Name:payload.Peer.Name,Gender:payload.Peer.Gender}
      }
      this.canChat = true
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

      this.store.dispatch(new fromRoomAction.SendSDP(
        {SDP:answer,Type:staticvar.AnswerFromClient}
      ))
      return this.PeerRef.setLocalDescription(answer)
    })
  }

  handleAnswer = (payload:AnswerResponse)=>{
    this.peerAsync = new Promise((resolve,_)=>{
      let peer:LoginResponse = {
        User:{ID:payload.Peer.ID,Name:payload.Peer.Name,Gender:payload.Peer.Gender}
      }
      this.canChat = true
      resolve(peer)
    })
    //Implements setRemoteDescription(answer)
    return this.PeerRef.setRemoteDescription(new RTCSessionDescription(payload.SDP))
  }

  handleICE = (ICE:any)=>{
    //Implements adding ICE candidate to peerConn
    // if (this.PeerRef.localDescription){
      this.PeerRef.addIceCandidate(new RTCIceCandidate(ICE))
    // }
  }

  handlePeerDisconnect = ()=>{
    this.statusNotStarted = true
    this.PeerRef.close()
    this.PeerRef = null
    this.resetPeerInfo("peer disconnected")
      console.log("peer disconnected")
  }

  resetPeerInfo = (name)=>{
    this.peerAsync = new Promise((resolve,_)=>{
      let peer:LoginResponse = {
        User:{ID:"",Name:name,Gender:""}
      }
      this.canChat = false
      resolve(peer)
    })
    this.store.dispatch(new fromRoomAction.ResetRoom())
  }

  changeMicState(){
    this.changeStatus(this.micState)
    this.toggleMuteMic()
  }

  changeVidState(){
    this.changeStatus(this.vidState)
    this.toggleMuteVid()
  }

  changeStatus = (a:{status,value,color})=>{
    a.value = !a.value
    if (a.value){
      a.status = "on"
      a.color = "indianred"
    }else{
      a.status = "off"
      a.color = "grey"
    }
  }

  toggleMuteMic = ()=>{
    this.localStream.getAudioTracks().forEach((track)=>{track.enabled = !track.enabled})
  }

  toggleMuteVid = ()=>{
    this.localStream.getVideoTracks().forEach((track)=>{track.enabled = !track.enabled})
  }

  goAbout(){
    this.router.navigateByUrl("/about")
  }

}

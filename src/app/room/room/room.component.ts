import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { LoginResponse } from 'src/app/models/response';
import { AppState } from 'src/app/redux/reducers/app-reducer';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {

  user:Promise<LoginResponse>
  authSubs:Subscription
  localVideo:HTMLVideoElement
  remoteVideo:HTMLVideoElement
  constructor(private store:Store<AppState>) { }
  
  
  ngOnDestroy(): void {
    if(this.authSubs){
      this.authSubs.unsubscribe()
    }
  }

  ngOnInit(): void {
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
        this.user = new Promise((resolve,_)=>{
          resolve(user)
        })
      }
    })
  }

  goLive(){
    this.startWebCam()
  }

  goStop(){
    
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

}

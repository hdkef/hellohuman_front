import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Chat } from 'src/app/models/chat';
import { AppState } from 'src/app/redux/reducers/app-reducer';
import {SendChat} from '../../redux/actions/room-action'

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit, OnDestroy {

  constructor(private store:Store<AppState>) { }
  
  roomSubs:Subscription
  chats:Promise<Chat[]>

  ngOnDestroy(): void {
    if (this.roomSubs){
      this.roomSubs.unsubscribe()
    }
  }

  ngOnInit(): void {
    this.subscribeToChatBox()
  }

  subscribeToChatBox = ()=>{
    this.roomSubs = this.store.select("room").subscribe((data)=>{
      console.log(data)
      let chats = data["ChatBox"]
      if (chats){
        this.chats = new Promise((resolve,_)=>{
          resolve(chats)
        })
      }
    })
  }

  onChatTextEvent(Text){
    console.log("onChatTextEvent")
    this.store.dispatch(new SendChat(Text))
  }

}

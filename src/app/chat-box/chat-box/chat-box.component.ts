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
      let chats = data["ChatBox"]
      if (chats){
        this.chats = new Promise((resolve,_)=>{
          resolve(chats)
        })
        return setTimeout(()=>{this.scrollToBottom()},0) //respond scroll to bottom async because render is async
      }
    })
  }

  onChatTextEvent(Text){
    this.store.dispatch(new SendChat(Text))
  }

  scrollToBottom = ()=>{
    var div = document.getElementById("chat-group");
    div.scrollTop = div.scrollHeight;
  }

}

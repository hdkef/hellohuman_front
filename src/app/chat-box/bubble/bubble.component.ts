import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Chat } from 'src/app/models/chat';

@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.css']
})
export class BubbleComponent implements OnChanges {

  constructor() { }

  @Input()chat:Chat
  chatAsync:Promise<Chat>
    
  ngOnChanges(changes: SimpleChanges): void {
    let chat = this.chat
    if (chat){
      this.chatAsync = new Promise((resolve,_)=>{
        resolve(chat)
      })
    }
  }
  


}

import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit {

  constructor() { }

  @Output()

  ngOnInit(): void {

  }

  onChatTextEvent(Text){

  }

}

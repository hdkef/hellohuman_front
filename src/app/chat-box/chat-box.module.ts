import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BubbleComponent } from './bubble/bubble.component';
import { InputComponent } from './input/input.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';



@NgModule({
  declarations: [
    BubbleComponent,
    InputComponent,
    ChatBoxComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    BubbleComponent,
    InputComponent,
    ChatBoxComponent,
  ]
})
export class ChatBoxModule { }

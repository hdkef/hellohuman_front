import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room/room.component';
import { RouterModule } from '@angular/router';
import { ChatBoxModule } from '../chat-box/chat-box.module';



@NgModule({
  declarations: [
    RoomComponent
  ],
  imports: [
    CommonModule,
    ChatBoxModule,
    RouterModule.forChild([
      {path:'',component:RoomComponent}
    ])
  ]
})
export class RoomModule { }

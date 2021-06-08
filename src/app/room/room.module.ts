import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room/room.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    RoomComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path:'',component:RoomComponent}
    ])
  ]
})
export class RoomModule { }

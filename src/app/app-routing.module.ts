import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'',pathMatch:'full',redirectTo:'login'},
  {path:'login',loadChildren:()=>{
    return import('./login/login.module').then((m)=>{return m.LoginModule})
  }},
  {path:'about',loadChildren:()=>{
    return import('./about/about.module').then((m)=>{return m.AboutModule})
  }},
  {path:'room',loadChildren:()=>{
    return import('./room/room.module').then((m)=>{return m.RoomModule})
  }},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

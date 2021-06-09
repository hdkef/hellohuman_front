import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {AppReducer} from './redux/reducers/app-reducer'
import { AuthEffect } from './redux/effects/auth-effect';
import { HttpClientModule } from '@angular/common/http';
import { RoomEffect } from './redux/effects/room-effect';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(AppReducer),
    EffectsModule.forRoot([AuthEffect,RoomEffect])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

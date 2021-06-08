import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LoginPayload } from 'src/app/models/payload';
import { AppState } from 'src/app/redux/reducers/app-reducer';
import {LoginStart} from '../../redux/actions/auth-action'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private store:Store<AppState>) { }

  loginForm:FormGroup

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'Name':new FormControl(null,Validators.required),
      'Gender':new FormControl("F",Validators.required)
    })
  }

  goLogin(){
    let payload:LoginPayload = {
      User:{Name:this.loginForm.value.Name,Gender:this.loginForm.value.Gender}
    }
    this.store.dispatch(new LoginStart(payload))
  }

}

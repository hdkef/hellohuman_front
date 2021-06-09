import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  constructor() { }

  @Output()chatTextEvent:EventEmitter<string> = new EventEmitter<string>()
  chatForm:FormGroup

  ngOnInit(): void {
    this.chatForm = new FormGroup({
      'Text':new FormControl(null,Validators.required)
    })
  }

  sendChatText(){
    this.chatTextEvent.emit(this.chatForm.value.Text)
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  ngOnInit(): void {
    if (window.innerWidth <= 1100  && window.innerHeight <= 900){
      alert("this web app is made for desktop. Please return.")
    }
  }
  title = 'angular';
}

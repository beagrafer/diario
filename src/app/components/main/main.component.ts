import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Map, tileLayer } from 'leaflet';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent{


  constructor(private authService: AuthService) {

  }


  logOut() {
    this.authService.logOut();
  }
}
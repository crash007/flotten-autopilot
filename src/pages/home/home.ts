import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RudderService } from '../../services/rudder-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(public navCtrl: NavController, private rudderService: RudderService) {

  }

  click(event) {
    console.log(event)
    
  }
  leftDown(event) {
    console.log(event)
    this.rudderService.startbarbord();
    
  }
  
  rightDown(event) {
    console.log(event)
    this.rudderService.startStyrbord();
  }
  
  leftUp(event) {
    console.log(event)
    this.rudderService.stopBarbord();
  }
  
  rightUp(event) {
    console.log(event)
    this.rudderService.stopStyrbord();
  
  }
  
  
}

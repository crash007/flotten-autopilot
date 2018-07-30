import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RudderService } from '../../services/rudder-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  connected: boolean;
  isLeftOutline: boolean = false;
  isRightOutline: boolean = false;

  constructor(public navCtrl: NavController, private rudderService: RudderService) {
    
  }

  
  leftDown(event) {
    this.isLeftOutline = true;
    this.rudderService.startbarbord();
    
  }
  
  rightDown(event) {
    this.isRightOutline = true;
    this.rudderService.startStyrbord();
  }
  
  leftUp(event) {
    this.isLeftOutline = false;
    this.rudderService.stopBarbord();
  }
  
  rightUp(event) {
    this.isRightOutline = false;
    this.rudderService.stopStyrbord();
  
  }

  onBluetoothClick(){
    this.connected = false;
    this.rudderService.initBluetooth();
    this.connected = this.rudderService.isConnected();
  }
  
  
}

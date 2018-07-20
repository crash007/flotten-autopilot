import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RudderService } from '../../services/rudder-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  connected: boolean;
  constructor(public navCtrl: NavController, private rudderService: RudderService) {
    
  }

  
  leftDown(event) {
    this.rudderService.startbarbord();
    
  }
  
  rightDown(event) {
    this.rudderService.startStyrbord();
  }
  
  leftUp(event) {
    this.rudderService.stopBarbord();
  }
  
  rightUp(event) {
    this.rudderService.stopStyrbord();
  
  }

  onBluetoothClick(){
    this.connected = false;
    this.rudderService.initBluetooth();
    this.connected = this.rudderService.isConnected();
  }
  
  
}

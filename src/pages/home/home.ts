import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import {Relay} from '../relay.model';
import { RudderTurnController } from '../autopilot/rudderturncontroller.module';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  rudderController: RudderTurnController;

  constructor(public navCtrl: NavController, private bluetoothSerial: BluetoothSerial) {
    bluetoothSerial.enable();
    
    //let babordRelay = Relay.RELAY_A;
    //let styrbordRelay = Relay.RELAY_B;
    let minAngel=-90;
    let maxAngel = 90;
    let turnTime = 30*1000;

    this.rudderController = new RudderTurnController(this.bluetoothSerial, -minAngel, maxAngel, turnTime);

  }

  click(event) {
    console.log(event)
    
  }
  leftDown(event) {
    console.log(event)
    this.rudderController.startbarbord();
    
  }
  
  rightDown(event) {
    console.log(event)
    this.rudderController.startStyrbord();
  }
  
  leftUp(event) {
    console.log(event)
    this.rudderController.stopBarbord();
  }
  
  rightUp(event) {
    console.log(event)
    this.rudderController.stopStyrbord();
  
  }
  
  success(success){
    console.log("success"+success);
    
  }
  
  failure(fail){
    console.log(fail);
   
  }
  
  send(data){
    this.bluetoothSerial.write(data).then(this.success, this.failure);
  }
}

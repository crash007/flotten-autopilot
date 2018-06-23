import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import {Relay} from './relay.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(public navCtrl: NavController, private bluetoothSerial: BluetoothSerial, private babordRelay: Relay, private styrbordRelay: Relay) {
    bluetoothSerial.enable();
    
    babordRelay.start = [0xA0, 0x01,0x01,0xA2];
    babordRelay.stop = [0xA0, 0x01,0x00,0xA1];

    styrbordRelay.start = [0xA0, 0x02,0x01,0xA3];
    styrbordRelay.stop = [0xA0, 0x02,0x00,0xA2];

  }

  click(event) {
    console.log(event)
    
  }
  leftDown(event) {
    console.log(event)
    this.send(this.babordRelay.start);
  }
  
  rightDown(event) {
    console.log(event)
    this.send(this.styrbordRelay.start);
  }
  
  leftUp(event) {
    console.log(event)
    this.send(this.babordRelay.stop);
  }
  
  rightUp(event) {
    console.log(event)
    this.send(this.styrbordRelay.stop);
  
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

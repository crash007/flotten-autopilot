import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import {Relay} from './relay.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  babordRelay : Relay;
  styrbordRelay: Relay;

  constructor(public navCtrl: NavController, private bluetoothSerial: BluetoothSerial) {
    bluetoothSerial.enable();
    
    this.babordRelay = Relay.RELAY_A;
    this.styrbordRelay = Relay.RELAY_B;
    
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

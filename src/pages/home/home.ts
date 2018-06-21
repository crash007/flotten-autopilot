import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(public navCtrl: NavController, private bluetoothSerial: BluetoothSerial) {
   bluetoothSerial.enable();
  }

  leftDown(event) {
    console.log(event)
    this.bluetoothSerial.write([0xA0, 0x01,0x01,0xA2]).then(this.success, this.failure);
  }
  
  rightDown(event) {
    console.log(event)
    this.bluetoothSerial.write([0xA0, 0x02,0x01,0xA3]).then(this.success, this.failure);
  }
  
  leftUp(event) {
    console.log(event)
    this.bluetoothSerial.write([0xA0, 0x01,0x00,0xA1]).then(this.success, this.failure);
  }
  
  rightUp(event) {
    console.log(event)
    this.bluetoothSerial.write([0xA0, 0x02,0x00,0xA2]).then(this.success, this.failure);
  }
  
  success(){
    console.log("success");
    
  }
  
  failure(){
    console.log("failure");
   alert("sfsdf");
  }
}

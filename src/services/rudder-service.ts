import { Injectable } from '@angular/core';
import { BluetoothSerial } from "@ionic-native/bluetooth-serial";
import { Relay } from '../models/relay.model';



@Injectable()
export class RudderService { 

    constructor(private bluetoothSerial: BluetoothSerial) {      
      
        bluetoothSerial.enable();
        this.connect();
        
    }

    private connect() {
        
            this.bluetoothSerial.connect("02:11:23:34:B3:04").subscribe((data: any) => {
                console.log(JSON.stringify(data, null, 2));
            });
        
    }

    private success(success) {
        console.log("success" + success);

    }

    private failure(fail) {
        console.log(fail);
        this.connect();
     

    }


    /** time in ms */
    public send(direction: Relay, time: number) {
        this.bluetoothSerial.write(direction.start).then(this.success, this.failure);
        setTimeout(() => {
            console.log("sending stop ");
            this.bluetoothSerial.write(direction.stop).then(this.success, this.failure);
        }, time);
    }

    private start(direction: Relay) {
        this.bluetoothSerial.write(direction.start).then(this.success, this.failure);
    }

    private stop(direction: Relay) {
        this.bluetoothSerial.write(direction.stop).then(this.success, this.failure);
    }

    public startbarbord() {
        this.start(Relay.BARBORD_RELAY);
    }

    public stopBarbord() {
        this.stop(Relay.BARBORD_RELAY);
    }

    public startStyrbord() {
        this.start(Relay.STYRBORD_RELAY);
    }

    public stopStyrbord() {
        this.stop(Relay.STYRBORD_RELAY);
    }
    
}
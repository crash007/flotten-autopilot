import { Injectable } from '@angular/core';
import { BluetoothSerial } from "@ionic-native/bluetooth-serial";
import { Relay } from '../models/relay.model';



@Injectable()
export class RudderService {

    private connected: boolean;


    constructor(private bluetoothSerial: BluetoothSerial) {

        this.initBluetooth();
    }

    public initBluetooth() {
        console.log("init bluetooth");
        if (this.bluetoothSerial) {
            this.bluetoothSerial.isConnected().then( () => {this.connected=true; console.log("Already connected")},
                () => {
                    console.log("check if bluetooth enabled");
                    this.bluetoothSerial.isEnabled().then(
                        ()=> {
                            setTimeout(() => {
                                this.connect(),1000
                            });
                            
                        }
                        , 
                        () => { this.bluetoothSerial.enable().then(() => {
                            console.log("enable bluetooth"); this.connect()
                        }, (fail) =>
                                console.log(fail));
                    }

                    );
                }
            );

        }
    }

    public isConnected(){
        return this.connected;
    }
    private connect() {
        console.log("connecting to 02:11:23:34:B3:04");
        
            this.bluetoothSerial.connect("02:11:23:34:B3:04").subscribe((data: any) => {
                console.log("connect callback:");
                console.log(JSON.stringify(data, null, 2));
                this.connected = true;
            });
    }

    private success(success) {
        console.log("success" + success);

    }

    private failure(fail) {
        console.log("Failure sending: " + fail);
        this.connect();
    }


    /** time in ms */
    public move(direction: Relay, time: number) {
        console.log("Moving rudder in direction: "+direction+" ,for time: "+time+" ms");
        this.bluetoothSerial.write(direction.start).then(this.success, this.failure);
        setTimeout(() => {
            console.log("sending stop ");
            this.bluetoothSerial.write(direction.stop).then(this.success, this.failure);
        }, time);
    }

    private send(data: number[]) {
        this.bluetoothSerial.write(data).then(this.success, this.failure);
    }

   
    public startbarbord() {
        this.send(Relay.BARBORD_RELAY.start);
    }

    public stopBarbord() {
        this.send(Relay.BARBORD_RELAY.stop);
    }

    public startStyrbord() {
        this.send(Relay.STYRBORD_RELAY.start);
    }

    public stopStyrbord() {
        this.send(Relay.STYRBORD_RELAY.stop);
    }

}
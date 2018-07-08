import { Relay } from "../relay.model";
import { BluetoothSerial } from "@ionic-native/bluetooth-serial";

export class RudderTurnController{
    
    
    constructor(private bluetoothSerial: BluetoothSerial, private minAngel:number, private maxAngel:number, private turnTime:number, private barbordRelay:Relay, private styrbordRelay:Relay){
        
    }

    turnToAngel(angel:number){

        let direction;
        
        if(angel < 0){
            direction = this.barbordRelay;
        }else{
            direction = this.styrbordRelay;
        }

        let time = Math.abs(angel)*this.turnTime/( Math.abs(this.minAngel)+ Math.abs(this.maxAngel));
        console.log("turnAngel: "+angel+" , turnTime: "+time);

        //call bluetooth
    }

}
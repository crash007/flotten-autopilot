import { Relay } from "../relay.model";
import { BluetoothSerial } from "@ionic-native/bluetooth-serial";

export class RudderTurnController{
    
    private currentAngel: number
    constructor(private bluetoothSerial: BluetoothSerial, private initAngel:number, private minAngel:number, private maxAngel:number, private turnTime:number, private barbordRelay:Relay, private styrbordRelay:Relay){
        this.currentAngel=initAngel;
    }

    turnToAngel(angel:number){

        let direction;
        
        if(angel < this.currentAngel){
            direction = this.barbordRelay;
        }else{
            direction = this.styrbordRelay;
        }

        let time = Math.abs(angel)*this.turnTime/( Math.abs(this.minAngel)+ Math.abs(this.maxAngel));
        console.log("turnAngel:"+angel+" , turnTime:"+time);
    }

}
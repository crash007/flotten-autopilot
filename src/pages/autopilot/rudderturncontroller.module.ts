
import { Relay } from "../../models/relay.model";
import { RudderService } from "../../services/rudder-service";

export class RudderTurnController {


    constructor(private rudderService: RudderService, private minAngel: number, private maxAngel: number, private turnTime: number) {
   
    }

   

    turn(angel: number) {

        let direction: Relay;
        console.log("angel:"+angel);
        console.log(""); 
        if (angel < 0) {
            direction = Relay.BARBORD_RELAY;
        } else {
            direction = Relay.STYRBORD_RELAY;
        }
        console.log("Direction: "+direction);
        let time = Math.abs(angel) * this.turnTime / (Math.abs(this.minAngel) + Math.abs(this.maxAngel));
        console.log("turnAngel: " + angel + " , turnTime: " + time);
        if (time > this.turnTime) {
            time = this.turnTime;
            console.log("Turning max turntime: " + time);
        }

        this.rudderService.send(direction, time * 1000);

    }
  

    setMinAngel(minAngel: number) {
        this.minAngel = minAngel;
    }


    setMaxAngel(maxAngel: number) {
        this.maxAngel = maxAngel;
    }

    setTurntime(turnTime: number) {
        this.turnTime = turnTime;
    }



}
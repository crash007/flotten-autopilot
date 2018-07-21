
import { Relay } from "../../models/relay.model";
import { RudderService } from "../../services/rudder-service";
import { Subject } from "rxjs/Subject";

export class RudderTurnController {


    private lastRudderAngel: number;
    private lastRudderAngelSubject : Subject<number>;

    constructor(private rudderService: RudderService, private minAngel: number, private maxAngel: number, private turnTime: number) {
        this.lastRudderAngel=0;
        this.lastRudderAngelSubject = new Subject();
    }

   
    
    turnToAngel(angel: number) {
        console.log("Turning from "+ this.lastRudderAngel+" to rudder-angel: " + angel);
        
        let direction: Relay;
        let deltaAngel = this.lastRudderAngel-angel;
       

        let moveRudderTime = Math.abs(deltaAngel) * +this.turnTime*1000 / ( Math.abs(+this.minAngel) + +this.maxAngel);
        console.log("moveRudderTime: "+moveRudderTime);

        if (deltaAngel < 0) {
            direction = Relay.BARBORD_RELAY;
        } else {
            direction = Relay.STYRBORD_RELAY;
        }

        if(moveRudderTime > 100){
            this.rudderService.move(direction, moveRudderTime);
            this.lastRudderAngel = angel;
            this.lastRudderAngelSubject.next(this.lastRudderAngel);
        }else{
            console.log("Not moving, movetime: "+moveRudderTime);
        }

    }
  
    public getRudderAngel(){
        return this.lastRudderAngelSubject;
    }

    resetRudderAngel(){
        this.lastRudderAngel=0;
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
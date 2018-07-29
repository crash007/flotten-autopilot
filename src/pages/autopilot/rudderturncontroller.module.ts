
import { Relay } from "../../models/relay.model";
import { RudderService } from "../../services/rudder-service";
import { Subject } from "rxjs/Subject";
import { RudderSettings } from "../../models/ruddersettings.model";

export class RudderTurnController {

    private lastRudderAngel: number;
    private lastRudderAngelSubject: Subject<number>;
    /**
     * 
     * @param rudderService 
     * @param minAngel degrees
     * @param maxAngel degrees
     * @param degreesPerSec 
     */
    constructor(private rudderService: RudderService, private rudderSettings: RudderSettings) {
        this.lastRudderAngel = 0;
        this.lastRudderAngelSubject = new Subject();
        console.log("ruddercontroller, degreespersec: " + rudderSettings.degreesPerSec);
        console.log("ruddercontroller, maxturntiume: " + rudderSettings.maxturnTime);
        console.log(JSON.stringify(rudderSettings, null, 2));
    }

    /**
     * 
     * @param angel 
     * @param maxTurntime in seconds 
     */
    turnToAngel(angel: number) {
        console.log("Turning from " + this.lastRudderAngel + " to rudder-angel: " + angel);

        let direction: Relay;


        if (Math.abs(angel) > this.rudderSettings.maxAngel) {
            angel = Math.sign(angel) * +this.rudderSettings.maxAngel;
            console.log("limiting maxangel to: " + angel);

        }

        let deltaAngel = angel - +this.lastRudderAngel;
        let turnTime = this.getTurntime(deltaAngel);
        

        if (turnTime > this.rudderSettings.maxturnTime) {

            turnTime = this.rudderSettings.maxturnTime;
            console.log("Limiting turntime to " + turnTime);
            deltaAngel = Math.sign(deltaAngel) * +this.rudderSettings.degreesPerSec * +turnTime;

        }


        if (turnTime > 0.1) {
            console.log("moveRudderTime: " + turnTime + " , deltaangel: " + deltaAngel);

            if (deltaAngel < 0) {
                direction = Relay.BARBORD_RELAY;
            } else {
                direction = Relay.STYRBORD_RELAY;
            }


            this.rudderService.move(direction, turnTime);
            this.lastRudderAngel = angel;
            this.lastRudderAngelSubject.next(this.lastRudderAngel);
        } else {
            console.log("Not moving rudder. turntime: " + turnTime);
        }

    }

    private getTurntime(deltaAngel: number): number {
        return +Math.abs(deltaAngel) / +this.rudderSettings.degreesPerSec;
    }

    public getRudderAngel() {
        return this.lastRudderAngelSubject;
    }

    resetRudderAngel() {
        this.lastRudderAngel = 0;
    }

    setSettings(rudderSettings: RudderSettings) {
        console.log("setting ruddersettings");

        console.log(JSON.stringify(rudderSettings, null, 2));
        this.rudderSettings = rudderSettings;
    }

}
import { LatLng } from "@ionic-native/google-maps";
import { Spherical } from '@ionic-native/google-maps'

export class Regulator {

    private errSum: number;
    private lasttime: number; //seconds
    private refHeading: number;

    constructor(private setpoint: LatLng, private currentPosition, private k_p: number, private k_i) {
        this.lasttime = Date.now() / 1000;
        this.errSum = 0;
        this.refHeading = Spherical.computeHeading(currentPosition, setpoint);
        console.log("Ref heading: " + this.refHeading);
    }

    getControlSignal(currentHeading: number) {

        let error = this.calculateError(currentHeading);
        console.log("error:" + error)
        let output = this.k_p * error + this.k_i * this.errSum;
        return output;
    }

    updateDrift(currentPosition: LatLng) {
        let distance = Spherical.computeDistanceBetween(this.currentPosition, currentPosition);
        if ( distance > 10) {
            console.log("Travelled :" +distance+" meters");
            let now = Date.now() / 1000;
            let deltaTime = now - this.lasttime;
            let heading = Spherical.computeHeading(this.currentPosition, currentPosition);
            console.log("gps heading: " + heading);
            let error = this.calculateError(heading);
            this.errSum += error * deltaTime;
            console.log("ErrSum: " + this.errSum);
            this.lasttime = now;
            this.currentPosition = currentPosition;

        }
    }

    private calculateError(currentHeading: number) {
        if (currentHeading > 180) {
            currentHeading = currentHeading - 360;
        }

        return this.refHeading - currentHeading;
    }

}
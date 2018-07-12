import { LatLng } from "@ionic-native/google-maps";
import { Spherical } from '@ionic-native/google-maps'

export class Regulator {
    

    private errSum: number;
    private lasttime: number; //seconds
    private refHeading: number;

    
    constructor(private setpoint: LatLng, private currentPosition, private k_p: number, private k_i) {
        this.setNewSetpoint(setpoint,currentPosition);
    }

    
    setNewSetpoint(setpoint: LatLng,currentPosition: LatLng){
        this.setpoint=setpoint;
        this.lasttime = Date.now() / 1000;
        this.refHeading = Spherical.computeHeading(currentPosition, setpoint);
        this.errSum = 0;
        console.log("Ref heading: " + this.refHeading);
    }
  

    getControlSignal(currentHeading: number) {

        let error = this.calculateError(currentHeading);
        console.log("error:" + error);
        let output = this.k_p * error + this.k_i * this.errSum;
        return output;
    }

    getControlSignalLatLng(currentPosition: LatLng) {
        let distance = Spherical.computeDistanceBetween(this.currentPosition, currentPosition);
        console.log("Travelled :" + distance + " meters");
        
        let now = Date.now() / 1000;
        let deltaTime = now - this.lasttime;
        let heading = Spherical.computeHeading(this.currentPosition, currentPosition);
        console.log("gps heading: " + heading);
        let error = this.calculateError(heading);
        this.errSum += error * deltaTime;
        console.log("ErrSum: " + this.errSum);
        this.lasttime = now;
        this.currentPosition = currentPosition;
        return this.k_p * error + this.k_i * this.errSum;
        
    }
    
    updateDrift(currentPosition: LatLng) {
        let distance = Spherical.computeDistanceBetween(this.currentPosition, currentPosition);
        console.log("Travelled :" + distance + " meters");
        
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

    private calculateError(currentHeading: number) {
        if (currentHeading > 180) {
            currentHeading = currentHeading - 360;

        }
        let angel = this.refHeading - currentHeading;
        if (Math.abs(angel) > 180) {
            angel = angel - 360;
        }
        return angel;
    }

    
    setKi(k_i: number) {
        this.k_i = k_i;
    }

    setKp(k_p: number) {
        this.k_p = k_p;
    }

}
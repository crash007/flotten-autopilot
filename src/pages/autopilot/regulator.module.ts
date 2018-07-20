import { LatLng } from "@ionic-native/google-maps";
import { Spherical } from '@ionic-native/google-maps'

export class Regulator {
    

    private errSum: number;
    private lasttime: number; //seconds
    private refHeading: number;

    
    constructor( setpoint: LatLng, private lastPosition, private k_p: number, private k_i) {
        this.setNewSetpoint(setpoint,lastPosition);
    }

    
    setNewSetpoint(setpoint: LatLng,currentPosition: LatLng){
        
        this.lasttime = Date.now() / 1000; //seconds
        this.refHeading = Spherical.computeHeading(currentPosition, setpoint);
        this.errSum = 0;
        console.log("Ref heading: " + this.refHeading);
    }
  
/**
 * 
 * @param currentHeading 
 * rudder angel
 */
    getControlSignal(currentHeading: number) {

        let error = this.calculateError(currentHeading);
        console.log("error:" + error);
        return this.pid(error);
    }
    
    
/**
 * 
 * @param currentPosition 
 * 
 * RUdder angel
 */
    getControlSignalLatLng(currentPosition: LatLng) {
        let distance = Spherical.computeDistanceBetween(this.lastPosition, currentPosition);
        console.log("Travelled :" + distance + " meters");
        
        let now = Date.now() / 1000;
        let deltaTime = now - this.lasttime;
        let heading = Spherical.computeHeading(this.lastPosition, currentPosition);
        console.log("gps heading: " + heading);
        let error = this.calculateError(heading);
        this.errSum += error * deltaTime;
        console.log("ErrSum: " + this.errSum);
        this.lasttime = now;
        this.lastPosition = currentPosition;
        return this.pid(error);
        
    }
    
    private pid(error: number) {
        return this.k_p * error + this.k_i * this.errSum;
    }

    updateIntegral(currentPosition: LatLng) {
        let distance = Spherical.computeDistanceBetween(this.lastPosition, currentPosition);
        console.log("Travelled :" + distance + " meters");
        
        let now = Date.now() / 1000; //Seconds
        let deltaTime = now - this.lasttime; //Seconds
        let heading = Spherical.computeHeading(this.lastPosition, currentPosition);
        console.log("gps heading: " + heading);
        let error = this.calculateError(heading);
        this.errSum += error * deltaTime;
        console.log("ErrSum: " + this.errSum);
        this.lasttime = now;
        this.lastPosition = currentPosition;


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
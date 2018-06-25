import { LatLng } from "@ionic-native/google-maps";
import {Spherical } from '@ionic-native/google-maps'

export class Regulator {

    private errSum:number;
    private lasttime: number; //seconds
    private lastPosition: LatLng;

    constructor(private setpoint: LatLng, private startPosition, private k_p:number, private k_i){
        this.lasttime = Date.now()/1000;
        this.errSum=0;
        this.lastPosition=startPosition;      
    }

    compute(currentPosition:LatLng){
        
        let now = Date.now()/1000;
        let deltaTime = now-this.lasttime;
        let error = this.calculateError(currentPosition);
        console.log("error:"+error)
        this.errSum += error*deltaTime;

        let output = this.k_p*error + this.k_i*this.errSum;
        this.lasttime = now;
        this.lastPosition=currentPosition;

        return output;
    } 

    private calculateError( currentPosition:LatLng ){
        let refHeading = Spherical.computeHeading(this.lastPosition, this.setpoint);
        console.log("reference heading"+refHeading);
        let heading = Spherical.computeHeading(this.lastPosition, currentPosition);
        console.log("curent heading:"+heading);
        return refHeading-heading;
    }
}
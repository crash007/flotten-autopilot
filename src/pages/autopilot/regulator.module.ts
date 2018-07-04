import { LatLng } from "@ionic-native/google-maps";
import {Spherical } from '@ionic-native/google-maps'

export class Regulator {

    private errSum:number;
    private lasttime: number; //seconds
    private refHeading: number;

    constructor(private setpoint: LatLng, private startPosition, private k_p:number, private k_i){
        this.lasttime = Date.now()/1000;
        this.errSum=0;
        this.refHeading = Spherical.computeHeading(startPosition, setpoint);
        console.log("Ref heading: "+this.refHeading);      
    }

    compute(currentHeading:number){
        
        let now = Date.now()/1000;
        let deltaTime = now-this.lasttime;
        let error;

        if(currentHeading >180){
            currentHeading =currentHeading-360; 
        }

        error = this.refHeading-currentHeading;
         
        console.log("error:"+error)
        this.errSum += error*deltaTime;

        let output = this.k_p*error + this.k_i*this.errSum;
        this.lasttime = now;
        

        return output;
    } 

    
}
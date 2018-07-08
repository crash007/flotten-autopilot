import { Regulator } from "./regulator.module";
import { RudderTurnController } from "./rudderturncontroller.module";
import { GoogleMap, LatLng, MyLocation } from "@ionic-native/google-maps";
import { DeviceOrientation, DeviceOrientationCompassHeading } from "@ionic-native/device-orientation";
import { Subscription } from "rxjs/Subscription";

export class Autopilot {

  compassSubscription: Subscription;
    constructor(private regulator: Regulator, private rudderController: RudderTurnController, private map: GoogleMap,
        private deviceOrientation: DeviceOrientation, private points: Array<LatLng>, private Ts_compass:number, private Ts_gps:number){

    }


    public start(){
         this.compassSubscription = this.deviceOrientation.watchHeading({ frequency: this.Ts_compass }).subscribe((data: DeviceOrientationCompassHeading) => {
            //console.log(JSON.stringify(data, null, 2));
            console.log("magetic heading compass: " + data.magneticHeading);
            let turn = this.regulator.getControlSignal(data.magneticHeading);
            console.log("turn" + turn);
            this.rudderController.turnToAngel(turn);
          });
      
      
          if (this.Ts_gps > 0) {
            setInterval(() => {
              this.map.getMyLocation()
                .then((location: MyLocation) => {
                  console.log(JSON.stringify(location, null, 2));
                  console.log("Getting location: " + location.latLng);
                  this.regulator.updateDrift(location.latLng);
      
                });
            }, this.Ts_gps);
          }
    }

    public stop(){
        this.compassSubscription.unsubscribe();


    }

}
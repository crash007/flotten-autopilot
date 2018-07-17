import { Regulator } from "./regulator.module";
import { RudderTurnController } from "./rudderturncontroller.module";
import { GoogleMap, LatLng, MyLocation, Spherical } from "@ionic-native/google-maps";
import { DeviceOrientation, DeviceOrientationCompassHeading } from "@ionic-native/device-orientation";
import { Subscription } from "rxjs/Subscription";
import { Settings } from "../../models/settings.model";
import { RudderService } from "../../services/rudder-service";

export class Autopilot {

  compassSubscription: Subscription;
  gpsSubscription: any;
  regulator: Regulator;
  rudderController: RudderTurnController;
 

  constructor(private map: GoogleMap, private deviceOrientation: DeviceOrientation, private points: Array<LatLng>, private rudderService: RudderService,
    private settings: Settings) {

    }


  public start() {
  
    this.rudderController = new RudderTurnController(this.rudderService, this.settings.minAngel, this.settings.maxAngel, this.settings.turnTime);

    this.map.getMyLocation()
      .then((location: MyLocation) => {

        this.drawLine(location.latLng, this.points[0]);

        this.regulator = new Regulator(this.points[0], location.latLng, this.settings.kp, this.settings.ki);

        if (this.settings.compass) {
          this.compassSubscription = this.deviceOrientation.watchHeading({ frequency: this.settings.tsCompass*1000 }).subscribe((data: DeviceOrientationCompassHeading) => {
            //console.log(JSON.stringify(data, null, 2));
            console.log("magetic heading compass: " + data.trueHeading);
            let turn = this.regulator.getControlSignal(data.trueHeading);
            console.log("turn" + turn);
            this.rudderController.turn(turn);
          });
        }
        this.gpsSubscription = setInterval(() => {
          this.map.getMyLocation()
            .then((location: MyLocation) => {
              console.log(JSON.stringify(location, null, 2));
              console.log("Getting location: " + location.latLng);

              let distanceToSetpoint = Spherical.computeDistanceBetween(location.latLng, this.points[0]);

              if (distanceToSetpoint < this.settings.setpointRadius) {

                if (this.points.length > 1) {
                  this.regulator.setNewSetpoint(this.points[1], location.latLng);
                  delete this.points[0];
                }

              }

              if (!this.settings.compass) {
                this.rudderController.turn(this.regulator.getControlSignalLatLng(location.latLng));
              } else {
                this.regulator.updateDrift(location.latLng);
              }
            });
        }, this.settings.tsGps*1000);
      });

  }

  public stop() {
    console.log("Stopping autopilot")

    if (this.compassSubscription != null) {
      this.compassSubscription.unsubscribe();
    }

    if (this.gpsSubscription != null) {
      this.gpsSubscription.unsubscribe();
    }
  }

  drawLine(from: LatLng, to: LatLng) {
    this.map.addPolylineSync({
      points: [from, to],
      color: '#AA00FF',
      width: 2,
      geodesic: false,
      clickable: true  // clickable = false in default
    });
  }


  updateSettins(settings: Settings){
    this.settings = settings;
    this.regulator.setKp(this.settings.kp);
    this.regulator.setKi(this.settings.ki);
    this.rudderController.setMinAngel(this.settings.minAngel);
    this.rudderController.setMaxAngel(this.settings.maxAngel);
    this.rudderController.setTurntime(this.settings.turnTime);
  }

}
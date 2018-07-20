import { Regulator } from "./regulator.module";
import { RudderTurnController } from "./rudderturncontroller.module";
import { GoogleMap, LatLng, MyLocation, Spherical } from "@ionic-native/google-maps";
import { DeviceOrientation, DeviceOrientationCompassHeading } from "@ionic-native/device-orientation";
import { Subscription } from "rxjs/Subscription";
import { Settings } from "../../models/settings.model";
import { RudderService } from "../../services/rudder-service";
import { BackgroundMode } from "@ionic-native/background-mode";

export class Autopilot {

  compassSubscription: Subscription;
  gpsIntervall: number;
  regulator: Regulator;
  rudderController: RudderTurnController;
 

  constructor(private map: GoogleMap, private deviceOrientation: DeviceOrientation, private points: Array<LatLng>, private rudderService: RudderService,
    private settings: Settings, private backgroundMode: BackgroundMode) {

    }


  public start() {
  
    //this.rudderService.initBluetooth();
    this.backgroundMode.enable();
    this.rudderController = new RudderTurnController(this.rudderService, this.settings.minAngel, this.settings.maxAngel, this.settings.turnTime);

    this.map.getMyLocation()
      .then((location: MyLocation) => {

        this.drawLine(location.latLng, this.points[0]);

        this.regulator = new Regulator(this.points[0], location.latLng, this.settings.kp, this.settings.ki);

        if (this.settings.compass) {
          this.startCompassWatcher();
        }

        
        this.startGpsWatcher();
      });

  }

  private startGpsWatcher() {
    this.gpsIntervall = setInterval(() => {
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
            this.rudderController.turnToAngel(this.regulator.getControlSignalLatLng(location.latLng));
          }
          else {
            this.regulator.updateIntegral(location.latLng);
          }
        });
    }, this.settings.tsGps * 1000);
  }

  private startCompassWatcher() {
    this.compassSubscription = this.deviceOrientation.watchHeading({ frequency: this.settings.tsCompass * 1000 }).subscribe((data: DeviceOrientationCompassHeading) => {
      console.log("magetic heading compass: " + data.trueHeading);
      let turn = this.regulator.getControlSignal(data.trueHeading);
      this.rudderController.turnToAngel(turn);
    });
  }

  public stop() {
    console.log("Stopping autopilot")

    if (this.compassSubscription != null) {
      this.compassSubscription.unsubscribe();
      
    }

    if (this.gpsIntervall != null) {
      clearInterval(this.gpsIntervall);
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
import { Regulator } from "./regulator.module";
import { RudderTurnController } from "./rudderturncontroller.module";
import { GoogleMap, LatLng, MyLocation, Spherical } from "@ionic-native/google-maps";
import { DeviceOrientation, DeviceOrientationCompassHeading } from "@ionic-native/device-orientation";
import { Subscription } from "rxjs/Subscription";
import { Settings } from "../../models/settings.model";
import { RudderService } from "../../services/rudder-service";
import { BackgroundMode } from "@ionic-native/background-mode";
import { Subject } from "rxjs/Subject";


export class Autopilot {

  compassSubscription: Subscription;
  gpsIntervall: NodeJS.Timer;
  regulator: Regulator;
  rudderController: RudderTurnController;
  headingSubject = new Subject<number>();

  constructor(private map: GoogleMap, private deviceOrientation: DeviceOrientation, private points: Array<LatLng>, private rudderService: RudderService,
    private settings: Settings, private backgroundMode: BackgroundMode) {

  }


  public start() {

    this.backgroundMode.enable();
    this.rudderController = new RudderTurnController(this.rudderService, this.settings.rudder);

    this.map.getMyLocation()
      .then((location: MyLocation) => {

        this.drawLine(location.latLng, this.points[0]);

        this.regulator = new Regulator(this.points[0], location.latLng, this.settings.regulator.kp, this.settings.regulator.ki);
        this.startCompassWatcher();
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

          this.regulator.updateIntegral(location.latLng);

        });
    }, this.settings.regulator.tsGps * 1000);
  }

  private startCompassWatcher() {
    this.compassSubscription = this.deviceOrientation.watchHeading({ frequency: this.settings.regulator.tsCompass * 1000 }).subscribe((data: DeviceOrientationCompassHeading) => {
      console.log("magetic heading compass: " + data.trueHeading);
      this.headingSubject.next(data.trueHeading);
      let rudderAngel = this.regulator.getControlSignal(data.trueHeading);
      this.rudderController.turnToAngel(rudderAngel);

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

  public getRudderAngel() {
    return this.rudderController.getRudderAngel();
  }

  public getHeading() {
    return this.headingSubject;
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


  updateSettings(settings: Settings) {
    this.settings = settings;
    if (this.regulator != null) {
     
      this.regulator.setKp(this.settings.regulator.kp);
      this.regulator.setKi(this.settings.regulator.ki);
    }

    if (this.rudderController != null) {
      this.rudderController.setSettings(this.settings.rudder);
    }
  }
}
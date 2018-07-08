import { Regulator } from "./regulator.module";
import { RudderTurnController } from "./rudderturncontroller.module";
import { GoogleMap, LatLng, MyLocation } from "@ionic-native/google-maps";
import { DeviceOrientation, DeviceOrientationCompassHeading } from "@ionic-native/device-orientation";
import { Subscription } from "rxjs/Subscription";
import { BluetoothSerial } from "@ionic-native/bluetooth-serial";
import { Relay } from "../relay.model";

export class Autopilot {

  compassSubscription: Subscription;
  gpsSubscription: any;
  regulator: Regulator;
  rudderController: RudderTurnController;
  private Ts_compass: number;
  private Ts_gps: number

  constructor(private map: GoogleMap, private deviceOrientation: DeviceOrientation, private points: Array<LatLng>, private bluetoothSerial: BluetoothSerial) {
    this.Ts_compass = 5 * 1000;
    this.Ts_gps = 30 * 1000;
  }


  public start() {
    let Kp = 0.5;
    let Ki = 0;

    let minAngel = -90;
    let maxAngel = 90;
    let turnTime = 20;
    let barbordRelay = Relay.RELAY_A;
    let styrbord = Relay.RELAY_B;
    let useCompass = false;

    this.rudderController = new RudderTurnController(this.bluetoothSerial, minAngel, maxAngel, turnTime, barbordRelay, styrbord);

    this.map.getMyLocation()
      .then((location: MyLocation) => {

        this.drawLine(location.latLng, this.points[0]);
        this.regulator = new Regulator(this.points[0], location.latLng, Kp, Ki);

        if (useCompass) {
          this.compassSubscription = this.deviceOrientation.watchHeading({ frequency: this.Ts_compass }).subscribe((data: DeviceOrientationCompassHeading) => {
            //console.log(JSON.stringify(data, null, 2));
            console.log("magetic heading compass: " + data.trueHeading);
            let turn = this.regulator.getControlSignal(data.trueHeading);
            console.log("turn" + turn);
            this.rudderController.turnToAngel(turn);
          });
        }
        this.gpsSubscription = setInterval(() => {
          this.map.getMyLocation()
            .then((location: MyLocation) => {
              console.log(JSON.stringify(location, null, 2));
              console.log("Getting location: " + location.latLng);
              
              if (!useCompass) {
                this.rudderController.turnToAngel(this.regulator.getControlSignalLatLng(location.latLng));
              }else{
                this.regulator.updateDrift(location.latLng);
              }
            });
        }, this.Ts_gps);
      });

  }

  public stop() {
    console.log("Stopping autopilot")

    if (this.compassSubscription != null) {
      this.compassSubscription.unsubscribe();
    }

    if (this.gpsSubscription != null) {
      this.gpsSubscription.stop();
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

}
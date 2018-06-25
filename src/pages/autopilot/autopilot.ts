import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Relay } from '../relay.model'

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  MyLocation,
  GoogleMapsAnimation,
  Marker,
  GoogleMapsEvent,
  Polyline,
  LatLng,
  Spherical
} from '@ionic-native/google-maps';
import { Regulator } from './regulator.module';
import { RudderTurnController } from './rudderturncontroller.module';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';


@Component({
  selector: 'page-autopilot',
  templateUrl: 'autopilot.html'
})
export class Autopilot {

  map: GoogleMap;
  points: Array<LatLng>;
  regulator: Regulator;
  rudder: RudderTurnController;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private bluetoothSerial: BluetoothSerial) {

  }

  ionViewDidLoad() {
    this.loadMap();
  }


  loadMap() {

    console.log("load map");
    let options: GoogleMapOptions = {
      controls: {
        compass: true,
        myLocation: true,
        myLocationButton: true,
        mapToolbar: true,
      },
    };

    this.map = GoogleMaps.create('map_canvas', options);

    this.map.getMyLocation()
      .then((location: MyLocation) => {
        console.log(JSON.stringify(location, null, 2));
        this.map.animateCamera({
          target: location.latLng,
          zoom: 15,
          tilt: 30
        })
      }).then(() => {
        this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((data: any) => {
          this.map.clear();
          console.log("map click");
          let position: LatLng = <LatLng>data[0];
          console.log(JSON.stringify(position, null, 2));
          let marker: Marker = this.map.addMarkerSync({
            title: 'Goal',
            position: position,
            animation: GoogleMapsAnimation.BOUNCE
          });

          marker.showInfoWindow();

          // If clicked it, display the alert
          marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
            this.showToast('clicked!');
          });

          this.map.getMyLocation()
            .then((location: MyLocation) => {
              let START = location.latLng;
              let END = position;

              this.points = [
                START,
                END
              ];

              let polyline: Polyline = this.map.addPolylineSync({
                points: this.points,
                color: '#AA00FF',
                width: 2,
                geodesic: false,
                clickable: true  // clickable = false in default
              });
            });


        });
      });

  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });

    toast.present(toast);
  }


  onButtonClick() {
    console.log("start autopilot");

    let Kp = 0.5;
    let Ki = 0.001;
    let Ts = 20;

    let initAngel = 0;
    let minAngel = -90;
    let maxAngel = 90;
    let turnTime = 20;
    let barbordRelay = Relay.RELAY_A;
    let styrbord = Relay.RELAY_B;

    this.regulator = new Regulator(this.points[1], this.points[0], Kp, Ki);
    this.rudder = new RudderTurnController(this.bluetoothSerial, initAngel, minAngel, maxAngel, turnTime, barbordRelay, styrbord);

    let distance = Spherical.computeDistanceBetween(this.points[0], this.points[1]);
    console.log(distance);

    this.controllerUpdate();

    setInterval(() => {
      this.controllerUpdate(); // Now the "this" still references the component
    }, Ts * 1000);




  }

  controllerUpdate() {
    this.map.getMyLocation()
      .then((location: MyLocation) => {
        console.log("Getting location: " + location.latLng);
        let turn = this.regulator.compute(location.latLng);
        console.log("turn"+turn);
        this.rudder.turnToAngel(turn);

      });
  }
}

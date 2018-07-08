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
  LatLng
} from '@ionic-native/google-maps';
import { Regulator } from './regulator.module';
import { RudderTurnController } from './rudderturncontroller.module';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { DeviceOrientation } from '@ionic-native/device-orientation';
import { Autopilot } from './autopilot.module';


@Component({
  selector: 'page-autopilot',
  templateUrl: 'autopilot.html'
})
export class AutopilotPage {

  map: GoogleMap;
  points: Array<LatLng> = new Array<LatLng>();
  //regulator: Regulator;
  //rudder: RudderTurnController;
  autopilot: Autopilot;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private bluetoothSerial: BluetoothSerial,
    private deviceOrientation: DeviceOrientation) {


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
          //this.map.clear();
          console.log("map click");
          let position: LatLng = <LatLng>data[0];
          this.points.push(position);
          console.log(JSON.stringify(position, null, 2));
          let marker: Marker = this.map.addMarkerSync({
            title: 'Goal ' + this.points.length,
            position: position,
            animation: GoogleMapsAnimation.BOUNCE
          });


          marker.showInfoWindow();

          // If clicked it, display the alert
          marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
            this.showToast('clicked!');
          });

          if (this.points.length > 1) {
            let i = this.points.length;
            this.drawLine(this.points[i - 2], this.points[i - 1]);
          }


        });
      });

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

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });

    toast.present(toast);
  }

  onResetClick(){
    this.map.clear();
    this.points =[];
  }

  onButtonClick() {
    console.log("start autopilot");


    let Kp = 0.5;
    let Ki = 0;
    let Ts_compass = 5*1000;
    let Ts_gps = 0*1000;

  
    let minAngel = -90;
    let maxAngel = 90;
    let turnTime = 20;
    let barbordRelay = Relay.RELAY_A;
    let styrbord = Relay.RELAY_B;

    
    this.map.getMyLocation()
      .then((location: MyLocation) => {

        this.drawLine(location.latLng, this.points[0]);
        let regulator = new Regulator(this.points[0], location.latLng, Kp, Ki);
        let rudder = new RudderTurnController(this.bluetoothSerial, minAngel, maxAngel, turnTime, barbordRelay, styrbord);
    
        this.autopilot = new Autopilot(regulator, rudder, this.map,this.deviceOrientation, this.points, Ts_compass, Ts_gps);
        this.autopilot.start();
        
      });
  }

}

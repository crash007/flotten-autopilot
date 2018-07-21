import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

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

import { DeviceOrientation } from '@ionic-native/device-orientation';
import { Autopilot } from './autopilot.module';
import { SettingsService } from '../../services/share/settings-service';
import { RudderService } from '../../services/rudder-service';
import { BackgroundMode } from '@ionic-native/background-mode';


@Component({
  selector: 'page-autopilot',
  templateUrl: 'autopilot.html'
})
export class AutopilotPage {

  map: GoogleMap;
  points: Array<LatLng> = new Array<LatLng>();
  autopilot: Autopilot;
  rudderAngel: string;
  heading: string;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private rudderService: RudderService,
    private deviceOrientation: DeviceOrientation, private settingsService: SettingsService, private backgroundMode: BackgroundMode) {
      
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

  onStopClick(){
    this.autopilot.stop();
  }

  onStartClick() {
    console.log("start autopilot");
   

    this.settingsService.getSettings().then(settings => {
      console.log(JSON.stringify(settings, null, 2));
      
      this.autopilot = new Autopilot(this.map,this.deviceOrientation,this.points,this.rudderService, settings, this.backgroundMode);
     this.autopilot.start();
     this.autopilot.getRudderAngel().subscribe((angel)=> this.rudderAngel=angel.toFixed(0));
     this.autopilot.getHeading().subscribe((heading)=> this.heading=heading.toFixed(0));

    },
      error => console.log(JSON.stringify(error, null, 2))
    );


    
   
  }

}

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
  Polyline,
  LatLng
} from '@ionic-native/google-maps';


@Component({
  selector: 'page-autopilot',
  templateUrl: 'autopilot.html'
})
export class Autopilot {

  map: GoogleMap;
  points: Array<LatLng>;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {

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

    /*this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((data) => {
      console.log("map click");
      //this.placeMarkerAndPanTo(data.latLng, this.map);
      /*
      let marker: Marker = this.map.addMarkerSync({
        title: 'Goal',
        snippet: '',
        position: data.latLng,
        animation: GoogleMapsAnimation.BOUNCE
      });

      // show the infoWindow
      marker.showInfoWindow();

      // If clicked it, display the alert
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this.showToast('clicked!');
      });
      */
    //});

  }



  onButtonClick() {
    
  }


  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });

    toast.present(toast);
  }
}

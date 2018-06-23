import { Component} from '@angular/core';
import { NavController} from 'ionic-angular';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions
} from '@ionic-native/google-maps';


@Component({
  selector: 'page-autopilot',
  templateUrl: 'autopilot.html'
})
export class Autopilot {

  map: GoogleMap;
 
  constructor(public navCtrl: NavController) {  
    
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
        mapToolbar: true
      }
    };

    this.map = GoogleMaps.create('map_canvas', options );

  }
}

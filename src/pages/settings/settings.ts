import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsService } from '../../services/share/settings-service';
import { Settings } from '../../models/settings.model';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  settings: Settings = new Settings();

  constructor(public navCtrl: NavController, private settingsService: SettingsService) {
    
    this.settingsService.getSettings().then(data => {
      console.log(JSON.stringify(data, null, 2));
      
      if(data !=null){  
        this.settings = data;
      }
    },
      error => console.log(JSON.stringify(error, null, 2))
    );

    console.log("settings");
    console.log(JSON.stringify(this.settings, null, 2));

  }

  click($event) {
    console.log(JSON.stringify(this.settings, null, 2));
    this.settingsService.setSettings(this.settings);

  }
}

import { Injectable } from '@angular/core';
import { Settings } from '../../models/settings.model';
import { NativeStorage } from '@ionic-native/native-storage';



@Injectable()
export class SettingsService {

    constructor(private nativeStorage: NativeStorage) {      
      
    }

    public setSettings(settings: Settings) {
        this.nativeStorage.setItem('settings', settings)
        .then(
            () => console.log('Stored item!'),
            error => {
                console.log(JSON.stringify(error, null, 2));
            }
        );
    }

    public getSettings() {
        return this.nativeStorage.getItem('settings')
        
    }
}
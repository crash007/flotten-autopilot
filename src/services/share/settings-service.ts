import { Injectable } from '@angular/core';
import { Settings } from '../../models/settings.model';
import { NativeStorage } from '@ionic-native/native-storage';
import { Subject } from 'rxjs/Subject';



@Injectable()
export class SettingsService {

    private settingsSubject= new Subject<Settings>();

    constructor(private nativeStorage: NativeStorage) {      
      
    }

    public setSettings(settings: Settings) {
        this.nativeStorage.setItem('settings', settings)
        .then(
            () => {console.log('Stored item!')
            this.settingsSubject.next(settings);
        },
            error => {
                console.log(JSON.stringify(error, null, 2));
            }
        );
    }

    public getSettings() {
        return this.nativeStorage.getItem('settings')
        
    }

    public settingsUpdate(){
        return this.settingsSubject;
    }
}
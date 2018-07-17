import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { MyApp } from './app.component';

import { AutopilotPage } from '../pages/autopilot/autopilot';
import { SettingsPage } from '../pages/settings/settings';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GoogleMaps } from "@ionic-native/google-maps";
import {DeviceOrientation} from "@ionic-native/device-orientation";
import { NativeStorage } from '@ionic-native/native-storage';
import { SettingsService } from '../services/share/settings-service';
import { RudderService } from '../services/rudder-service';


@NgModule({
  declarations: [
    MyApp,
    AutopilotPage,
    SettingsPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AutopilotPage,
    SettingsPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BluetoothSerial,
    GoogleMaps,
    DeviceOrientation,
    SettingsService,
    NativeStorage,
    RudderService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

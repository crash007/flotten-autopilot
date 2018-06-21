import { Component } from '@angular/core';

import { Autopilot } from '../autopilot/autopilot';
import { SettingsPage } from '../settings/settings';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = Autopilot;
  tab3Root = SettingsPage;

  constructor() {

  }
}

import { Component } from '@angular/core';

import { AutopilotPage } from '../autopilot/autopilot';
import { SettingsPage } from '../settings/settings';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AutopilotPage;
  tab3Root = SettingsPage;

  constructor() {

  }
}

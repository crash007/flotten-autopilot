import { RudderSettings } from "./ruddersettings.model";
import { RegulatorSettings } from "./regulatorsettings.model";

export class Settings {

    constructor() {
        this.regulator= new RegulatorSettings();
        this.rudder = new RudderSettings();
        this.setpointRadius = 10;
    }

    regulator: RegulatorSettings;
    rudder: RudderSettings;
    setpointRadius: number;

}
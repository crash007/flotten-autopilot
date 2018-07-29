

export class RegulatorSettings {

    constructor() {
        this.kp = 0.5;
        this.ki= 0.01;
        this.tsCompass=6;
        this.tsGps=60;
    }

    kp : number;
    ki : number;
    tsCompass: number;
    tsGps: number;

}
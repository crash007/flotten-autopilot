import { Relay } from "../relay.model";
import { BluetoothSerial } from "@ionic-native/bluetooth-serial";

export class RudderTurnController {


    constructor(private bluetoothSerial: BluetoothSerial, private minAngel: number, private maxAngel: number, private turnTime: number) {

    }

    turn(angel: number) {

        let direction: Relay;

        if (angel < 0) {
            direction = Relay.BARBORD_RELAY;
        } else {
            direction = Relay.STYRBORD_RELAY;
        }

        let time = Math.abs(angel) * this.turnTime / (Math.abs(this.minAngel) + Math.abs(this.maxAngel));
        console.log("turnAngel: " + angel + " , turnTime: " + time);
        this.send(direction,time);

    }

    private success(success) {
        console.log("success" + success);

    }

    private failure(fail) {
        console.log(fail);

    }

    /** time in ms */
    private send(direction: Relay, time: number) {
        this.bluetoothSerial.write(direction.start).then(this.success, this.failure);
        setTimeout(() => {
            console.log("sending stop ");
            this.bluetoothSerial.write(direction.stop).then(this.success, this.failure);
        }, time);
    }

    private start(direction: Relay) {
        this.bluetoothSerial.write(direction.start).then(this.success, this.failure);
    }

    private stop(direction: Relay) {
        this.bluetoothSerial.write(direction.stop).then(this.success, this.failure);
    }

    public startbarbord() {
        this.start(Relay.BARBORD_RELAY);
    }

    public stopBarbord() {
        this.stop(Relay.BARBORD_RELAY);
    }

    public startStyrbord() {
        this.start(Relay.STYRBORD_RELAY);
    }

    public stopStyrbord() {
        this.stop(Relay.STYRBORD_RELAY);
    }

}
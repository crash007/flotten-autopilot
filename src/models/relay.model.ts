export class Relay {

    constructor(public name:string, public start: number[], public stop: number[]) {

    }

    public static RELAY_A_STOP = [0xA0, 0x01, 0x00, 0xA1];
    public static RELAY_B_START = [0xA0, 0x02, 0x01, 0xA3];
    public static RELAY_A_START = [0xA0, 0x01, 0x01, 0xA2];
    public static RELAY_B_STOP = [0xA0, 0x02, 0x00, 0xA2];

   //public static RELAY_A = 
   //public static RELAY_B = 
   public static BARBORD_RELAY = new Relay("BARBORD",Relay.RELAY_B_START, Relay.RELAY_B_STOP); //Relay.RELAY_B;
   public static STYRBORD_RELAY = new Relay("STYRBORD",Relay.RELAY_A_START, Relay.RELAY_A_STOP); //Relay.RELAY_A;

}


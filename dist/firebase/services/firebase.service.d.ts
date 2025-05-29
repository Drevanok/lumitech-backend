import { SensorData, SensorInfoResponse } from '../interface/sensor-data.interface';
export declare class FirebaseService {
    private db;
    constructor();
    sendSensorData(data: SensorData): Promise<void>;
    private checkAndSendAlert;
    private sendAlert;
    getInfoSensor(mac: string): Promise<SensorInfoResponse>;
    getAlert(mac: string): Promise<{
        msg: string;
        data: string | null;
    }>;
}

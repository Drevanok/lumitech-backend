import { RosetaService } from '../services/roseta.service';
import { JwtPayload } from 'jsonwebtoken';
import { ReceivedIpRosettaDto } from '../dto/received-ip-roseta..dto';
import { FirebaseService } from '../../firebase/services/firebase.service';
import { ChangeUbicationDto } from '../dto/modified-data-rosette.dto';
export declare class RosetaController {
    private readonly rosetaService;
    private readonly fireBaseService;
    constructor(rosetaService: RosetaService, fireBaseService: FirebaseService);
    receivedIP(receivedIpRosettaDto: ReceivedIpRosettaDto): Promise<{
        msg: string;
    }>;
    registerRosetta(req: {
        user: JwtPayload;
    }): Promise<{
        msg: string;
    }>;
    getAllRosettes(req: {
        user: JwtPayload;
    }): Promise<{
        msg: string;
        data: import("../interface/rosetta.interface").Rosetta[];
    }>;
    receivedDataRosette(data: any): Promise<{
        msg: string;
    }>;
    getInfoSensor(mac: string): Promise<import("../../firebase/interface/sensor-data.interface").SensorInfoResponse>;
    getAlerts(mac: string): Promise<{
        msg: string;
        data: string | null;
    }>;
    changeUbication(changeUbicationDto: ChangeUbicationDto, req: {
        user: JwtPayload;
    }): Promise<{
        msg: string;
    }>;
    deleteRosette(mac: string, req: {
        user: JwtPayload;
    }): Promise<{
        msg: string;
    }>;
}

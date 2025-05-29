import { DataSource } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ReceivedIpRosettaDto } from '../dto/received-ip-roseta..dto';
import { ChangeUbicationDto } from '../dto/modified-data-rosette.dto';
import { Rosetta } from '../interface/rosetta.interface';
export declare class RosetaService {
    private readonly dataSource;
    private readonly httpService;
    constructor(dataSource: DataSource, httpService: HttpService);
    receivedIPRosetta(receivedIpRosettaDto: ReceivedIpRosettaDto): Promise<{
        msg: string;
    }>;
    registerRosetta(uuid: string): Promise<{
        msg: string;
    }>;
    getAllRosettes(uuid: string): Promise<{
        msg: string;
        data: Rosetta[];
    }>;
    changeUbication(changeUbicationDto: ChangeUbicationDto, uuid: string): Promise<{
        msg: string;
    }>;
    removeRosette(mac: string, uuid: string): Promise<{
        msg: string;
    }>;
}

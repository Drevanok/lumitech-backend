"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RosetaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const create_rosetta_dto_1 = require("../dto/create-rosetta.dto");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
let ipRosette = '';
let RosetaService = class RosetaService {
    dataSource;
    httpService;
    constructor(dataSource, httpService) {
        this.dataSource = dataSource;
        this.httpService = httpService;
    }
    async receivedIPRosetta(receivedIpRosettaDto) {
        const { rossette_ip } = receivedIpRosettaDto;
        console.log('IP recibida en el backend:', rossette_ip);
        ipRosette = rossette_ip;
        console.log('IP de la roseta guardada:', ipRosette);
        return { msg: 'IP de la roseta recibida correctamente' };
    }
    async registerRosetta(uuid) {
        try {
            const apiUrl = `http://${ipRosette}/send-data`;
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(apiUrl));
            const dataFromEsp32 = response.data;
            const dtoInstance = (0, class_transformer_1.plainToInstance)(create_rosetta_dto_1.CreateRosettaDto, dataFromEsp32);
            const errors = (0, class_validator_1.validateSync)(dtoInstance);
            if (errors.length > 0) {
                console.log('Errores de validación:', errors);
                throw new common_1.BadRequestException('Los datos recibidos del ESP32 no son válidos.');
            }
            const { rosette_mac, rosette_ip, wifi_ssid, wifi_password } = dtoInstance;
            await this.dataSource.query('CALL register_rosette(?, ?, ?, ?, ?, @p_message)', [rosette_mac, rosette_ip, wifi_ssid, wifi_password, uuid]);
            const result = await this.dataSource.query('SELECT @p_message as message');
            return { msg: result[0].message };
        }
        catch (error) {
            console.log('Error al registrar la roseta:', error);
            throw new common_1.InternalServerErrorException('Error al registrar la roseta.');
        }
    }
    async getAllRosettes(uuid) {
        try {
            const result = await this.dataSource.query('CALL get_rosettes_by_user(?)', [uuid]);
            return {
                msg: 'Rosetas obtenidas correctamente',
                data: result[0],
            };
        }
        catch (error) {
            console.error('Error al obtener las rosetas del usuario:', error);
            throw new common_1.InternalServerErrorException('Error al obtener las rosetas del usuario.');
        }
    }
    async changeUbication(changeUbicationDto, uuid) {
        const { ubication, rosette_mac } = changeUbicationDto;
        try {
            await this.dataSource.query('CALL change_rosette_ubication(?, ?, ?, @p_message)', [ubication, uuid, rosette_mac]);
            const result = await this.dataSource.query('SELECT @p_message as message');
            const message = result[0]?.message;
            if (message === 'Ubicación de roseta actualizada exitosamente') {
                return { msg: message };
            }
            else {
                throw new common_1.BadRequestException(message || 'No se pudo actualizar la ubicación.');
            }
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error al cambiar la ubicación de la roseta.');
        }
    }
    async removeRosette(mac, uuid) {
        try {
            await this.dataSource.query('CALL delete_rosette_for_user(?, ?, @p_message)', [uuid, mac]);
            const result = await this.dataSource.query('SELECT @p_message as message');
            return { msg: result[0].message };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al intentar eliminar esta roseta.');
        }
    }
};
exports.RosetaService = RosetaService;
exports.RosetaService = RosetaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        axios_1.HttpService])
], RosetaService);
//# sourceMappingURL=roseta.service.js.map
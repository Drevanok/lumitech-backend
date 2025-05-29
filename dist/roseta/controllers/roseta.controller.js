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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RosetaController = void 0;
const common_1 = require("@nestjs/common");
const roseta_service_1 = require("../services/roseta.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const received_ip_roseta__dto_1 = require("../dto/received-ip-roseta..dto");
const firebase_service_1 = require("../../firebase/services/firebase.service");
const modified_data_rosette_dto_1 = require("../dto/modified-data-rosette.dto");
let RosetaController = class RosetaController {
    rosetaService;
    fireBaseService;
    constructor(rosetaService, fireBaseService) {
        this.rosetaService = rosetaService;
        this.fireBaseService = fireBaseService;
    }
    async receivedIP(receivedIpRosettaDto) {
        console.log('Ip:', receivedIpRosettaDto);
        return await this.rosetaService.receivedIPRosetta(receivedIpRosettaDto);
    }
    async registerRosetta(req) {
        const userUuid = req.user.uuid;
        return await this.rosetaService.registerRosetta(userUuid);
    }
    async getAllRosettes(req) {
        const userUuid = req.user.uuid;
        return await this.rosetaService.getAllRosettes(userUuid);
    }
    async receivedDataRosette(data) {
        console.log('Datos recibidos del ESP32:', data);
        try {
            await this.fireBaseService.sendSensorData(data);
            return { msg: 'Datos recibidos y enviados a Firebase correctamente' };
        }
        catch (error) {
            return { msg: 'Error al enviar los datos a Firebase' };
        }
    }
    async getInfoSensor(mac) {
        return await this.fireBaseService.getInfoSensor(mac);
    }
    async getAlerts(mac) {
        const alertData = await this.fireBaseService.getAlert(mac);
        if (!alertData) {
            return {
                msg: 'No se encontraron alertas para la roseta con MAC: ' + mac,
                data: null,
            };
        }
        return alertData;
    }
    async changeUbication(changeUbicationDto, req) {
        const userUuid = req.user.uuid;
        return await this.rosetaService.changeUbication(changeUbicationDto, userUuid);
    }
    async deleteRosette(mac, req) {
        const userUuid = req.user.uuid;
        return await this.rosetaService.removeRosette(mac, userUuid);
    }
};
exports.RosetaController = RosetaController;
__decorate([
    (0, common_1.Post)('received-ip'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [received_ip_roseta__dto_1.ReceivedIpRosettaDto]),
    __metadata("design:returntype", Promise)
], RosetaController.prototype, "receivedIP", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RosetaController.prototype, "registerRosetta", null);
__decorate([
    (0, common_1.Get)('get-all-rosettes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RosetaController.prototype, "getAllRosettes", null);
__decorate([
    (0, common_1.Post)('sensor-data'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RosetaController.prototype, "receivedDataRosette", null);
__decorate([
    (0, common_1.Get)('sensor/:mac'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('mac')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RosetaController.prototype, "getInfoSensor", null);
__decorate([
    (0, common_1.Get)('alerts/:mac'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('mac')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RosetaController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Patch)('change-ubication'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [modified_data_rosette_dto_1.ChangeUbicationDto, Object]),
    __metadata("design:returntype", Promise)
], RosetaController.prototype, "changeUbication", null);
__decorate([
    (0, common_1.Delete)('remove-rosette/:mac'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('mac')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RosetaController.prototype, "deleteRosette", null);
exports.RosetaController = RosetaController = __decorate([
    (0, common_1.Controller)('roseta'),
    __metadata("design:paramtypes", [roseta_service_1.RosetaService,
        firebase_service_1.FirebaseService])
], RosetaController);
//# sourceMappingURL=roseta.controller.js.map
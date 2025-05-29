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
exports.ChangePasswordDto = exports.ChangeUbicationDto = void 0;
const class_validator_1 = require("class-validator");
class ChangeUbicationDto {
    rosette_mac;
    ubication;
}
exports.ChangeUbicationDto = ChangeUbicationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsMACAddress)({ message: 'La dirección MAC no es válida.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La dirección MAC no puede estar vacía.' }),
    __metadata("design:type", String)
], ChangeUbicationDto.prototype, "rosette_mac", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La ubicación no puede estar vacía.' }),
    __metadata("design:type", String)
], ChangeUbicationDto.prototype, "ubication", void 0);
class ChangePasswordDto {
    wifi_ssid;
    wifi_password;
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña no puede estar vacía.' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "wifi_ssid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña no puede estar vacía.' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "wifi_password", void 0);
//# sourceMappingURL=modified-data-rosette.dto.js.map
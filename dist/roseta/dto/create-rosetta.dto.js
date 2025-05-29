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
exports.CreateRosettaDto = void 0;
const class_validator_1 = require("class-validator");
class CreateRosettaDto {
    rosette_mac;
    rosette_ip;
    wifi_ssid;
    wifi_password;
}
exports.CreateRosettaDto = CreateRosettaDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMACAddress)({}, { message: 'La dirección MAC no es válida.' }),
    __metadata("design:type", String)
], CreateRosettaDto.prototype, "rosette_mac", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIP)('4', { message: 'La dirección IP debe ser IPv4 y no es válida.' }),
    __metadata("design:type", String)
], CreateRosettaDto.prototype, "rosette_ip", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRosettaDto.prototype, "wifi_ssid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRosettaDto.prototype, "wifi_password", void 0);
//# sourceMappingURL=create-rosetta.dto.js.map
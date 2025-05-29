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
exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
class CreateUserDto {
    userName;
    userLastName;
    userNickName;
    userEmail;
    userPassword;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 50, { message: 'El nombre debe tener entre 3 y 50 caracteres.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre no puede estar vacío.' }),
    (0, class_validator_1.Matches)(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,50}$/, {
        message: 'El nombre solo puede contener letras y espacios.',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "userName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 50, { message: 'El apellido debe tener entre 3 y 50 caracteres.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El apellido no puede estar vacío.' }),
    (0, class_validator_1.Matches)(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,50}$/, {
        message: 'El apellido solo puede contener letras y espacios.',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "userLastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 15, { message: 'El nickname debe tener entre 3 y 15 caracteres.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nickname no puede estar vacío.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "userNickName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Debe proporcionar un correo electrónico válido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El correo electrónico no puede estar vacío.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "userEmail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(8, 15, {
        message: 'La contraseña debe tener entre 8 y 15 caracteres.',
    }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
        message: 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo.',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña no puede estar vacía.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "userPassword", void 0);
//# sourceMappingURL=create-user.dto.js.map
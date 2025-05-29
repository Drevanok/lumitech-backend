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
exports.ChangeUserNickNameDto = exports.ChangePasswordDto = exports.ChangeUserLastNameDto = exports.ChangeUserNameDto = void 0;
const class_validator_1 = require("class-validator");
class ChangeUserNameDto {
    userName;
}
exports.ChangeUserNameDto = ChangeUserNameDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 50, { message: 'El nombre debe tener entre 3 y 50 caracteres.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre no puede estar vacío.' }),
    (0, class_validator_1.Matches)(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,50}$/, {
        message: 'El nombre solo puede contener letras y espacios.',
    }),
    __metadata("design:type", String)
], ChangeUserNameDto.prototype, "userName", void 0);
;
class ChangeUserLastNameDto {
    userLastName;
}
exports.ChangeUserLastNameDto = ChangeUserLastNameDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 50, { message: 'El apellido debe tener entre 3 y 50 caracteres.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El apellido no puede estar vacío.' }),
    (0, class_validator_1.Matches)(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,50}$/, {
        message: 'El apellido solo puede contener letras y espacios.',
    }),
    __metadata("design:type", String)
], ChangeUserLastNameDto.prototype, "userLastName", void 0);
class ChangePasswordDto {
    currentPassword;
    userNewPassword;
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
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
], ChangePasswordDto.prototype, "userNewPassword", void 0);
class ChangeUserNickNameDto {
    nickName;
}
exports.ChangeUserNickNameDto = ChangeUserNickNameDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3, { message: 'El nickName debe tener al menos 3 caracteres.' }),
    __metadata("design:type", String)
], ChangeUserNickNameDto.prototype, "nickName", void 0);
//# sourceMappingURL=modified-data-user.dto.js.map
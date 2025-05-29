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
exports.LoginDto = void 0;
const class_validator_1 = require("class-validator");
let EitherEmailOrNickNameConstraint = class EitherEmailOrNickNameConstraint {
    validate(_, args) {
        const obj = args.object;
        return !!(obj.email || obj.nickName);
    }
    defaultMessage() {
        return 'Debes proporcionar al menos el email o el nickName.';
    }
};
EitherEmailOrNickNameConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'eitherEmailOrNickName', async: false })
], EitherEmailOrNickNameConstraint);
class LoginDto {
    nickName;
    email;
    password;
    checkEitherEmailOrNickName;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3, { message: 'El nickName debe tener al menos 3 caracteres.' }),
    __metadata("design:type", String)
], LoginDto.prototype, "nickName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'El correo electrónico no es válido.' }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña no puede estar vacía.' }),
    (0, class_validator_1.MinLength)(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.Validate)(EitherEmailOrNickNameConstraint),
    __metadata("design:type", Boolean)
], LoginDto.prototype, "checkEitherEmailOrNickName", void 0);
//# sourceMappingURL=login.dto.js.map
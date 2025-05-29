"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RosetaModule = void 0;
const common_1 = require("@nestjs/common");
const roseta_controller_1 = require("./controllers/roseta.controller");
const roseta_service_1 = require("../roseta/services/roseta.service");
const auth_module_1 = require("../auth/auth.module");
const firebase_module_1 = require("../firebase/firebase.module");
const axios_1 = require("@nestjs/axios");
let RosetaModule = class RosetaModule {
};
exports.RosetaModule = RosetaModule;
exports.RosetaModule = RosetaModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, (0, common_1.forwardRef)(() => auth_module_1.AuthModule), firebase_module_1.FirebaseModule],
        controllers: [roseta_controller_1.RosetaController],
        providers: [roseta_service_1.RosetaService],
    })
], RosetaModule);
//# sourceMappingURL=roseta.module.js.map
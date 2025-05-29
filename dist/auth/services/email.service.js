"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
let EmailService = class EmailService {
    transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    async sendVerificationEmail(email, name, token) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Lumitech" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Verifica tu cuenta en Lumitech',
                html: `<p>Hola, ${name},</p>
                       <p>Gracias por registrarte en Lumitech. Por favor, verifica tu cuenta haciendo clic en el siguiente enlace:</p>
                        <p>copia y pega el token en tu aplicacion para verificar tu cuenta</p>
                       <a>${token}</a>
                       <p>Si no te registraste en Lumitech, ignora este correo.</p>`,
            });
            console.log(`Token de verificación: ${token}`);
        }
        catch (error) {
            console.error('Error enviando el correo: ', error);
            throw new common_1.HttpException('No se pudo enviar el correo de verificación.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendRecoveryEmail(email, name, resetToken) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Lumitech" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Recuperación de contraseña en Lumitech',
                html: `<p>Hola, ${name},</p>
                      <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para restablecerla:</p>
                      <p>copia y pega el token en tu aplicacion para reestablecer tu contraseña</p>
                      <a>${resetToken}</a>
                      <p>Si no solicitaste el restablecimiento de contraseña, ignora este correo.</p>`,
            });
            console.log('Correo de recuperacion enviado: ', info.messageId);
        }
        catch (error) {
            console.error('Error enviando el correo de recuperación: ', error);
            throw new common_1.HttpException('No se pudo enviar el correo de recuperación.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map
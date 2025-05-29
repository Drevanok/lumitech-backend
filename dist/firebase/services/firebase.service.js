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
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const admin = __importStar(require("firebase-admin"));
const path = __importStar(require("path"));
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
}
else {
    const serviceAccountPath = path.join(process.cwd(), 'src/firebase/lumitech-sensors-firebase-adminsdk-fbsvc-50eb2dd997.json');
    serviceAccount = require(serviceAccountPath);
}
let FirebaseService = class FirebaseService {
    db;
    constructor() {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: 'https://lumitech-sensors-default-rtdb.firebaseio.com',
            });
        }
        this.db = admin.database();
    }
    async sendSensorData(data) {
        const mac = data.rosette_mac;
        const temperature = data.temperature;
        const humidity = data.humidity;
        const timestamp = Date.now();
        const tempPath = `rosettes/${mac}/sensors/temperature`;
        const humPath = `rosettes/${mac}/sensors/humidity`;
        await this.db.ref(tempPath).set({
            timestamp,
            valor: temperature,
        });
        await this.db.ref(humPath).set({
            timestamp,
            valor: humidity,
        });
        console.log('Datos enviados correctamente a Firebase.');
        await this.checkAndSendAlert(mac, temperature);
    }
    async checkAndSendAlert(mac, temperature) {
        const threshold = 55;
        if (temperature > threshold) {
            await this.sendAlert(mac, temperature);
        }
    }
    async sendAlert(mac, temperature) {
        const alertPath = `alerts/${mac}`;
        await this.db.ref(alertPath).set({
            message: `¡Alerta! Temperatura muy alta: ${temperature}°C`,
            timestamp: Date.now(),
        });
        console.log(`Alerta enviada para la roseta ${mac}: Temperatura muy alta: ${temperature}°C`);
    }
    async getInfoSensor(mac) {
        try {
            const tempRef = this.db.ref(`rosettes/${mac}/sensors/temperature`);
            const humRef = this.db.ref(`rosettes/${mac}/sensors/humidity`);
            const tempSnapshot = await tempRef.once('value');
            const humSnapshot = await humRef.once('value');
            if (!tempSnapshot.exists() || !humSnapshot.exists()) {
                return {
                    msg: 'No se encontraron datos de sensor para la roseta.',
                    data: null,
                };
            }
            const temperatureData = tempSnapshot.val();
            const humidityData = humSnapshot.val();
            return {
                msg: 'Datos obtenidos correctamente',
                data: {
                    temperature: temperatureData,
                    humidity: humidityData,
                },
            };
        }
        catch (error) {
            console.error(error);
            return {
                msg: 'Error al recuperar los datos del sensor.',
                data: null,
            };
        }
    }
    async getAlert(mac) {
        const alertRef = this.db.ref(`alerts/${mac}`);
        const alertSnapshot = await alertRef.once('value');
        if (alertSnapshot.exists()) {
            return {
                msg: 'Alerta encontrada',
                data: alertSnapshot.val(),
            };
        }
        else {
            return {
                msg: 'No hay alertas para esta roseta.',
                data: null,
            };
        }
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map
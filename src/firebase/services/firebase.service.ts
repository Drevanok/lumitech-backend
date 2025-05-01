import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SensorData, SensorInfoResponse } from '../interface/sensor-data.interface';
import serviceAccount from '../lumitech-sensors-firebase-adminsdk-fbsvc-50eb2dd997.json';

@Injectable()
export class FirebaseService {
  private db: admin.database.Database;

  // Constructor to initialize Firebase Admin SDK
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        databaseURL: 'https://lumitech-sensors-default-rtdb.firebaseio.com',
      });
    }

    this.db = admin.database();
  }

  // Method to send sensor data to Firebase
  async sendSensorData(data: SensorData) {
    const mac = data.rosette_mac;
    const temperature = data.temperature;
    const humidity = data.humidity;
    const timestamp = Date.now();

    // Route paths for temperature and humidity
    const tempPath = `rosettes/${mac}/sensors/temperature`;
    const humPath = `rosettes/${mac}/sensors/humidity`;

    // Send data to Firebase
    await this.db.ref(tempPath).set({
      timestamp,
      valor: temperature,
    });

    await this.db.ref(humPath).set({
      timestamp,
      valor: humidity,
    });

    console.log('Datos enviados correctamente a Firebase.');

    // Check if the temperature exceeds the threshold and send an alert if necessary
    await this.checkAndSendAlert(mac, temperature);
  }

  // Method to check if the temperature exceeds the threshold and send an alert
  private async checkAndSendAlert(mac: string, temperature: number) {
    const threshold = 70; // Establecer umbral en 70°C

    // If the temperature exceeds the threshold, send an alert
    if (temperature > threshold) {
      await this.sendAlert(mac, temperature);
    }
  }

  // Method to send an alert to Firebase
  private async sendAlert(mac: string, temperature: number) {
    const alertPath = `alerts/${mac}`;
    await this.db.ref(alertPath).set({
      message: `¡Alerta! Temperatura muy alta: ${temperature}°C`,
      timestamp: Date.now(),
    });

    console.log(`Alerta enviada para la roseta ${mac}: Temperatura muy alta: ${temperature}°C`);
  }

  // Method to get sensor information from Firebase
  async getInfoSensor(mac: string): Promise<SensorInfoResponse> {
    try {
      // Rutas
      const tempRef = this.db.ref(`rosettes/${mac}/sensors/temperature`);
      const humRef = this.db.ref(`rosettes/${mac}/sensors/humidity`);

      // get data from Firebase
      const tempSnapshot = await tempRef.once('value');
      const humSnapshot = await humRef.once('value');

      // Check if data exists
      if (!tempSnapshot.exists() || !humSnapshot.exists()) {
        return {
          msg: 'No se encontraron datos de sensor para la roseta.',
          data: null,
        };
      }

      // get data and prepare send to user
      const temperatureData = tempSnapshot.val();
      const humidityData = humSnapshot.val();

      return {
        msg: 'Datos obtenidos correctamente',
        data: {
          temperature: temperatureData,
          humidity: humidityData,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        msg: 'Error al recuperar los datos del sensor.',
        data: null,
      };
    }
  }

  // Method to get alerts from Firebase
  async getAlert(mac: string): Promise<any> {
    const alertRef = this.db.ref(`alerts/${mac}`);
    const alertSnapshot = await alertRef.once('value');

    if (alertSnapshot.exists()) {
      return {
        msg: 'Alerta encontrada',
        data: alertSnapshot.val(),
      };
    } else {
      return {
        msg: 'No hay alertas para esta roseta.',
        data: null,
      };
    }
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('RosetaController (e2e)', () => {
  let app: INestApplication;

  // Suponemos que ya tienes un token JWT válido (lo puedes obtener por autenticación previa)
  const jwtToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiODQ1NWQ2NjctNGE2Mi00ZDFmLWE0ZmUtZTZlM2IxYjkxMDY3IiwiaWF0IjoxNzQ1NjI4MzMxLCJleHAiOjE3NDgyMjAzMzF9._GSYMYYF64KoG3WZaQxYBFyo84rXh9XWLYsrzUUqew8'; // Sustituye esto con el token JWT válido

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/roseta/pre-register (POST)', async () => {
    const generateQrDto = {
      wifiSSID: 'IZZI-64B8',
      wifiPassword: '2C00AB2064B8',
      ubication: 'COCINA2',
    };

    const response = await request(app.getHttpServer())
      .post('/roseta/pre-register')
      .set('Authorization', `Bearer ${jwtToken}`) // Agregar el token JWT en el encabezado Authorization
      .send(generateQrDto);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('qrCode'); // Asegúrate de que la respuesta tenga un qrCode
    console.log(response.body.qrCode); // Esto imprimirá el código QR en base64 (si lo necesitas)
  });
});

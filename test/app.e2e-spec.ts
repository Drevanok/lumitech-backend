import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('RosetaController (e2e)', () => {
  let app: INestApplication;

  const jwtToken = 'Bearer Token'
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
      .set('Authorization', `Bearer ${jwtToken}`) 
      .send(generateQrDto);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('qrCode'); 
    console.log(response.body.qrCode); 
  });
});

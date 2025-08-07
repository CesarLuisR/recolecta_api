// authController.test.ts
import request from 'supertest';
import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import cookieParser from 'cookie-parser';

import * as authController from '../../../src/User/controllers/authCtrl';
import * as cedulaService from '../../../src/User/services/cedulaService';
import * as authServices from '../../../src/User/services/authServices';
import * as emailService from '../../../src/User/services/emailVerificationService';
import transporter from '../../../src/utils/SMTP';
import TokenRepository from '../../../src/User/repository/tokenRepository';
import { BadRequestError, UnauthorizedError, ForbiddenError } from '../../../src/utils/error';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../../src/utils/token';

// Helper para montar un handler en ruta dinámica
function createApp(handler: RequestHandler, route: string) {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.all(route, handler);
  // Manejador de errores que respeta statusCode y status
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.statusCode || err.status || 500;
    res.status(status).json({ message: err.message });
  });
  return app;
}

jest.mock('../../../src/User/services/cedulaService');
jest.mock('../../../src/User/services/authServices');
jest.mock('../../../src/User/services/emailVerificationService');
jest.mock('../../../src/utils/SMTP');
jest.mock('../../../src/utils/token');
jest.mock('../../../src/User/repository/tokenRepository');

describe('authController handlers', () => {
  beforeEach(jest.clearAllMocks);

  describe('signUp', () => {
    const app = createApp(authController.signUp, '/test/:municipio_slug');

    it('201 y JSON cuando todo va bien', async () => {
      (cedulaService.validateCedulaService as jest.Mock).mockReturnValue(true);
      (emailService.emailVerificationService as jest.Mock).mockResolvedValue(true);
      (authServices.registerUserService as jest.Mock)
        .mockResolvedValue({ user_id: 42, tipo_usuario: 'cliente' });

      const payload = { nombre: 'Juan', apellido: 'Perez', cedula: '00113918256', email: 'a@b.com' };
      const res = await request(app)
        .post('/test/slug-correcto')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Usuario creado exitosamente', user: { user_id: 42, tipo_usuario: 'cliente' } });
      expect(cedulaService.validateCedulaService).toHaveBeenCalledWith(payload.cedula);
      expect(emailService.emailVerificationService).toHaveBeenCalledWith(payload.email);
      expect(authServices.registerUserService).toHaveBeenCalledWith(payload, 'slug-correcto');
    });

    it('400 si falta un campo', async () => {
      const res = await request(app)
        .post('/test/slug')
        .send({ nombre: 'Juan' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Se necesitan todos los datos');
    });

    it('400 si cédula inválida', async () => {
      (cedulaService.validateCedulaService as jest.Mock).mockReturnValue(false);

      const res = await request(app)
        .post('/test/slug')
        .send({ nombre: 'Juan', apellido: 'Perez', cedula: '123', email: 'a@b.com' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Cedula invalida');
    });
  });

  describe('magicLink', () => {
    const app = createApp(authController.magicLink, '/test');

    it('201, envía mail y cookie', async () => {
      (authServices.magicLinkService as jest.Mock).mockResolvedValue({ id: 'abc', session_id: 'sid' });
      (transporter.sendMail as jest.Mock).mockResolvedValue({});

      const res = await request(app)
        .post('/test')
        .send({ user_id: 1, email: 'a@b.com' });

      expect(res.status).toBe(201);
      expect(transporter.sendMail).toHaveBeenCalled();
      expect(res.headers['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringContaining('session_id=sid')
        ])
      );
    });
  });

  describe('validateMagicLink', () => {
    const app = createApp(authController.validateMagicLink, '/test/:id');

    it('200 con data cuando link existe', async () => {
      (authServices.verifyMagicLinkService as jest.Mock).mockResolvedValue({ exists: true, verified: true });

      const res = await request(app).get('/test/abc123');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ data: { exists: true, verified: true } });
    });
  });

  describe('getSessionId', () => {
    const app = createApp(authController.getSessionId, '/test/:id');

    it('201 y cookie session_id', async () => {
      (authServices.getSessionIdService as jest.Mock).mockResolvedValue('sess');

      const res = await request(app).get('/test/5');
      expect(res.status).toBe(201);
      expect(res.headers['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringContaining('session_id=sess')
        ])
      );
    });
  });

  describe('magicConsume', () => {
    const app = createApp(authController.magicConsume, '/test/:id');

    it('201, cookies de access y refresh, y JSON con user', async () => {
      const fakeUser = { id: 10, tipo_usuario: 'cliente' };
      (authServices.magicConsumeService as jest.Mock).mockResolvedValue(fakeUser);
      (generateAccessToken as jest.Mock).mockReturnValue('AT');
      (generateRefreshToken as jest.Mock).mockReturnValue('RT');

      const res = await request(app)
        .get('/test/abc')
        .set('Cookie', ['session_id=abc']);

      expect(res.status).toBe(201);
      expect(res.headers['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringContaining('refreshToken=RT'),
          expect.stringContaining('accessToken=AT')
        ])
      );
    });

    it('401 si falta session_id', async () => {
      const res = await request(app).get('/test/abc');
      expect(res.status).toBe(401);
    });
  });

  describe('logIn', () => {
    const app = createApp(authController.logIn, '/test');

    it('201, cookies y JSON con user', async () => {
      const fakeUser = { id: 5, tipo_usuario: 'cliente' };
      (authServices.loginUserService as jest.Mock).mockResolvedValue(fakeUser);
      (generateAccessToken as jest.Mock).mockReturnValue('AT');
      (generateRefreshToken as jest.Mock).mockReturnValue('RT');

      const res = await request(app)
        .post('/test')
        .send({ email: 'a@b.com', password: 'pass' });

      expect(res.status).toBe(201);
      expect(res.headers['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringContaining('refreshToken=RT'),
          expect.stringContaining('accessToken=AT')
        ])
      );
      expect(TokenRepository.saveRefreshToken).toHaveBeenCalledWith(fakeUser.id, 'RT');
    });

    it('400 si faltan datos', async () => {
      const res = await request(app).post('/test').send({ email: 'a@b.com' });
      expect(res.status).toBe(400);
    });

    it('401 si credenciales inválidas', async () => {
      (authServices.loginUserService as jest.Mock)
        .mockRejectedValue(new UnauthorizedError('Credenciales invalidas'));

      const res = await request(app)
        .post('/test')
        .send({ email: 'a@b.com', password: 'wrong' });

      expect(res.status).toBe(401);
    });
  });

  describe('refreshToken', () => {
    const app = createApp(authController.refreshToken, '/test');

    it('200 y cookies actualizadas', async () => {
      (verifyRefreshToken as jest.Mock).mockReturnValue({ id: 1, tipo_usuario: 'cliente' });
      (TokenRepository.isRefreshTokenValid as jest.Mock).mockResolvedValue(true);
      (generateAccessToken as jest.Mock).mockReturnValue('AT2');
      (generateRefreshToken as jest.Mock).mockReturnValue('RT2');

      const res = await request(app)
        .post('/test')
        .set('Cookie', ['refreshToken=oldRT']);

      expect(res.status).toBe(200);
      expect(res.headers['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringContaining('refreshToken=RT2'),
          expect.stringContaining('accessToken=AT2')
        ])
      );
    });

    it('401 si no hay refreshToken', async () => {
      const res = await request(app).post('/test');
      expect(res.status).toBe(401);
    });

    it('403 si verify falla', async () => {
      (verifyRefreshToken as jest.Mock).mockImplementation(() => { throw new Error(); });

      const res = await request(app)
        .post('/test')
        .set('Cookie', ['refreshToken=bad']);

      expect(res.status).toBe(403);
    });
  });

  describe('logOut', () => {
    const app = createApp(authController.logOut, '/test');

    it('204 limpia cookies si no hay token válido', async () => {
      (verifyRefreshToken as jest.Mock).mockImplementation(() => { throw new Error(); });

      const res = await request(app)
        .post('/test')
        .set('Cookie', ['refreshToken=bad']);

      expect(res.status).toBe(204);
    });

    it('204 limpia cookies después de revocar', async () => {
      (verifyRefreshToken as jest.Mock).mockReturnValue({ id: 1, tipo_usuario: 'cliente' });
      (TokenRepository.revokeToken as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app)
        .post('/test')
        .set('Cookie', ['refreshToken=good']);

      expect(res.status).toBe(204);
      expect(TokenRepository.revokeToken).toHaveBeenCalledWith(1, 'good');
    });
  });
});

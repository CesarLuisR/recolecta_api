// userController.test.ts
import request from 'supertest';
import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import cookieParser from 'cookie-parser';

import * as userController from '../../../src/User/controllers/userCtrl';
import { verifyAccessToken } from '../../../src/utils/token';
import { loadUserService, getUserService } from '../../../src/User/services/userServices';
import { UnauthorizedError, NotFoundError } from '../../../src/utils/error';

// Helper para montar un handler en ruta sin params
function createApp(handler: RequestHandler) {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.all('/test', handler);
  app.use((err: any, req: express.Request, res: express.Response, next: NextFunction) => {
    const status = err.statusCode || err.status || 500;
    res.status(status).json({ message: err.message });
  });
  return app;
}

jest.mock('../../../src/utils/token');
jest.mock('../../../src/User/services/userServices');

describe('userController handlers', () => {
  beforeEach(jest.clearAllMocks);

  describe('load', () => {
    const app = createApp(userController.load);

    it('200 y devuelve user cuando token válido', async () => {
      const fakePayload = { id: 3 };
      const fakeUser = { id: 3, email: 'u@e.com', nombre: 'Test' };
      (verifyAccessToken as jest.Mock).mockReturnValue(fakePayload);
      (loadUserService as jest.Mock).mockResolvedValue(fakeUser);

      const res = await request(app)
        .get('/test')
        .set('Cookie', ['accessToken=validToken']);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ user: fakeUser });
    });

    it('401 si token ausente o inválido', async () => {
      (verifyAccessToken as jest.Mock).mockImplementation(() => { throw new UnauthorizedError('No autorizado'); });
      const res = await request(app).get('/test');
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'No autorizado');
    });
  });

  describe('getUser', () => {
    const app = createApp(userController.getUser);

    it('200 y devuelve id de usuario cuando existe', async () => {
      (getUserService as jest.Mock).mockResolvedValue({ id: 7 });

      const res = await request(app)
        .post('/test')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 7 });
    });

    it('404 si no se encuentra usuario', async () => {
      (getUserService as jest.Mock).mockRejectedValue(new NotFoundError('Usuario no encontrado'));

      const res = await request(app)
        .post('/test')
        .send({ email: 'none@example.com' });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Usuario no encontrado');
    });
  });

  describe('noVerifiedUser', () => {
    const app = createApp(userController.noVerifiedUser);

    it('200 y devuelve user cuando existe', async () => {
      const mockUser = { id: 8, email: 'a@b.com', verified: false };
      (getUserService as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/test')
        .send({ email: 'a@b.com' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ user: mockUser });
    });

    it('404 si usuario no existe', async () => {
      (getUserService as jest.Mock).mockRejectedValue(new NotFoundError('Usuario no encontrado'));

      const res = await request(app)
        .post('/test')
        .send({ email: 'x@y.com' });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Usuario no encontrado');
    });
  });
});
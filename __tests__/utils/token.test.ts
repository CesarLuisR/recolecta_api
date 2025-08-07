import jwt from 'jsonwebtoken';
import config from '../../src/config';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  TokenPayload
} from '../../src/utils/token';

jest.mock('jsonwebtoken');

const payload: TokenPayload = {
  id: 1,
  tipo_usuario: 'cliente'
};

describe('Token utils', () => {
  const signMock = jwt.sign as jest.Mock;
  const verifyMock = jwt.verify as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAccessToken', () => {
    it('debería llamar a jwt.sign con el payload y la clave de acceso', () => {
      signMock.mockReturnValue('access.token');
      const token = generateAccessToken(payload);
      expect(token).toBe('access.token');
      expect(signMock).toHaveBeenCalledWith(payload, config.jwtAccessSecret, { expiresIn: '15m' });
    });
  });

  describe('generateRefreshToken', () => {
    it('debería llamar a jwt.sign con el payload y la clave de refresh', () => {
      signMock.mockReturnValue('refresh.token');
      const token = generateRefreshToken(payload);
      expect(token).toBe('refresh.token');
      expect(signMock).toHaveBeenCalledWith(payload, config.jwtRefreshSecret, { expiresIn: '7d' });
    });
  });

  describe('verifyAccessToken', () => {
    it('debería verificar el token con la clave de acceso', () => {
      verifyMock.mockReturnValue(payload);
      const result = verifyAccessToken('fake-token');
      expect(result).toEqual(payload);
      expect(verifyMock).toHaveBeenCalledWith('fake-token', config.jwtAccessSecret);
    });
  });

  describe('verifyRefreshToken', () => {
    it('debería verificar el token con la clave de refresh', () => {
      verifyMock.mockReturnValue(payload);
      const result = verifyRefreshToken('fake-token');
      expect(result).toEqual(payload);
      expect(verifyMock).toHaveBeenCalledWith('fake-token', config.jwtRefreshSecret);
    });
  });
});

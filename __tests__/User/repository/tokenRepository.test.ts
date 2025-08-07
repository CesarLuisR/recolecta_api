// tokenRepository.test.ts
import TokenRepository from '../../../src/User/repository/tokenRepository';
import { pool } from '../../../src/database';

jest.mock('../../../src/database', () => ({
  pool: {
    query: jest.fn(),
  },
}));

const mockQuery = pool.query as jest.Mock;

describe('TokenRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveRefreshToken', () => {
    it('debería llamar a query con los parámetros correctos', async () => {
      mockQuery.mockResolvedValue({});

      await TokenRepository.saveRefreshToken(1, 'token123');
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), expect.any(Array));
      // Podrías verificar específicamente que el segundo parámetro tenga user_id y token
      const params = mockQuery.mock.calls[0][1];
      expect(params[0]).toBe(1);
      expect(params[1]).toBe('token123');
      expect(params[2]).toBeInstanceOf(Date); // expires_at
    });
  });

  describe('isRefreshTokenValid', () => {
    it('debería devolver true si hay token válido', async () => {
      mockQuery.mockResolvedValue({
        rows: [{}], // al menos un resultado
      });

      const result = await TokenRepository.isRefreshTokenValid(1, 'token123');
      expect(result).toBe(true);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1, 'token123']);
    });

    it('debería devolver false si no hay token válido', async () => {
      mockQuery.mockResolvedValue({
        rows: [],
      });

      const result = await TokenRepository.isRefreshTokenValid(1, 'token123');
      expect(result).toBe(false);
    });
  });

  describe('revokeToken', () => {
    it('debería llamar a query con user_id y token', async () => {
      mockQuery.mockResolvedValue({});

      await TokenRepository.revokeToken(1, 'token123');
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1, 'token123']);
    });
  });
});

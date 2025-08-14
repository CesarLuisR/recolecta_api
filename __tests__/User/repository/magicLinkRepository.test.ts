import MagicLinkRepository, { MagicLinkI } from '../../../src/User/repository/magicLinkRepository';
import { pool } from '../../../src/database';

jest.mock('../../../src/database', () => ({
  pool: {
    query: jest.fn(),
  },
}));

const mockQuery = pool.query as jest.Mock;

describe('MagicLinkRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('retorna MagicLinkI si se crea correctamente', async () => {
      const mockData: MagicLinkI = {
        id: 'abc',
        session_id: 'session123',
        user_id: 1,
        expires_at: new Date(),
        used: false,
        created_at: new Date()
      };
      mockQuery.mockResolvedValue({
        rowCount: 1,
        rows: [mockData],
      });

      const result = await MagicLinkRepository.create(1);
      expect(pool.query).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('retorna null si no se crea', async () => {
      mockQuery.mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      const result = await MagicLinkRepository.create(1);
      expect(result).toBeNull();
    });
  });

  describe('getNotExpired', () => {
    it('retorna el link si no ha expirado', async () => {
      const mockLink = { id: 'abc', session_id: 's1', user_id: 1, expires_at: new Date(), used: false, created_at: new Date() };
      mockQuery.mockResolvedValue({
        rowCount: 1,
        rows: [mockLink],
      });

      const result = await MagicLinkRepository.getNotExpired('abc');
      expect(result).toEqual(mockLink);
    });

    it('retorna null si está expirado o no existe', async () => {
      mockQuery.mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      const result = await MagicLinkRepository.getNotExpired('abc');
      expect(result).toBeNull();
    });
  });

  describe('getUsedLink', () => {
    it('retorna true si el link fue usado', async () => {
      mockQuery.mockResolvedValue({
        rowCount: 1,
        rows: [{}],
      });

      const result = await MagicLinkRepository.getUsedLink('abc');
      expect(result).toBe(true);
    });

    it('retorna false si no hay link usado', async () => {
      mockQuery.mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      const result = await MagicLinkRepository.getUsedLink('abc');
      expect(result).toBe(false);
    });
  });

  describe('isUsedLink', () => {
    it('retorna true si el link está marcado como usado', async () => {
      mockQuery.mockResolvedValue({
        rowCount: 1,
        rows: [{}],
      });

      const result = await MagicLinkRepository.isUsedLink('abc');
      expect(result).toBe(true);
    });

    it('retorna false si no está usado', async () => {
      mockQuery.mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      const result = await MagicLinkRepository.isUsedLink('abc');
      expect(result).toBe(false);
    });
  });

  describe('isSessionValid', () => {
    it('retorna true si la sesión es válida', async () => {
      mockQuery.mockResolvedValue({
        rowCount: 1,
        rows: [{}],
      });

      const result = await MagicLinkRepository.isSessionValid('abc', 'token123');
      expect(result).toBe(true);
    });

    it('retorna false si la sesión no es válida', async () => {
      mockQuery.mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      const result = await MagicLinkRepository.isSessionValid('abc', 'token123');
      expect(result).toBe(false);
    });
  });

  describe('setUsed', () => {
    it('ejecuta query para marcar como usado', async () => {
      mockQuery.mockResolvedValue({});
      await MagicLinkRepository.setUsed('abc');
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['abc']);
    });
  });
});

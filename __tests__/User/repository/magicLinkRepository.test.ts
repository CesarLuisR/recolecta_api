// magicLinkRepository.test.ts
import MagicLinkRepository, { MagicLinkI } from '../../../src/User/repository/magicLinkRepository';
import { pool } from '../../../src/database';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../../../src/utils/error';

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
      const mockData = { id: 'abc', session_id: 'session123' };
      mockQuery.mockResolvedValue({
        rowCount: 1,
        rows: [mockData],
      });

      const result = await MagicLinkRepository.create(1);
      expect(pool.query).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('lanza NotFoundError si no se crea', async () => {
      mockQuery.mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      await expect(MagicLinkRepository.create(1)).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('getValid', () => {
    it('retorna el link válido si existe', async () => {
      const mockLink = { id: 'abc', token: 'token123' };
      mockQuery.mockResolvedValue({
        rowCount: 1,
        rows: [mockLink],
      });

      const result = await MagicLinkRepository.getValid('abc', 'token123');
      expect(pool.query).toHaveBeenCalled();
      expect(result).toEqual(mockLink);
    });

    it('lanza ForbiddenError si link no válido', async () => {
      mockQuery.mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      await expect(MagicLinkRepository.getValid('abc', 'token123')).rejects.toBeInstanceOf(ForbiddenError);
    });
  });

  describe('getUsedLink', () => {
    it('no lanza error si el link fue usado', async () => {
      mockQuery.mockResolvedValue({
        rowCount: 1,
        rows: [{}],
      });

      await expect(MagicLinkRepository.getUsedLink('abc')).resolves.toBeUndefined();
    });

    it('lanza UnauthorizedError si no hay link usado', async () => {
      mockQuery.mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      await expect(MagicLinkRepository.getUsedLink('abc')).rejects.toBeInstanceOf(UnauthorizedError);
    });
  });

  describe('setUsed', () => {
    it('llama a query para marcar link como usado', async () => {
      mockQuery.mockResolvedValue({});

      await MagicLinkRepository.setUsed('abc');
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['abc']);
    });
  });
});

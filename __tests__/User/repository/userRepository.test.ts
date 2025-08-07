// userRepository.test.ts
import UserRepository from '../../../src/User/repository/userRepository';
import { pool } from '../../../src/database';
import { NotFoundError } from '../../../src/utils/error';
import { User } from '../../../src/types/user';

jest.mock('../../../src/database', () => ({
  pool: {
    query: jest.fn(),
  },
}));

const mockQuery = pool.query as jest.Mock;

describe('UserRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserByEmail', () => {
    it('debería devolver un usuario si existe', async () => {
      const mockUser: User = {
        id: 1,
        nombre: 'Juan',
        email: 'juan@example.com',
        apellido: "Perez",
        cedula: '11234098234',
        tipo_usuario: "cliente",
        municipio_id: 1,
        password_hash: "",
        creado_en: new Date(),
        verified: false
      };

      mockQuery.mockResolvedValue({
        rowCount: 1,
        rows: [mockUser],
      });

      const result = await UserRepository.getUserByEmail('juan@example.com');
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['juan@example.com']);
      expect(result).toEqual(mockUser);
    });

    it('debería devolver null si no encuentra usuario', async () => {
      mockQuery.mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      const result = await UserRepository.getUserByEmail('noexiste@example.com');
      expect(result).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('debería devolver un usuario si existe', async () => {
      const mockUser: User = {
        id: 1,
        nombre: 'Juan',
        email: 'juan@example.com',
        apellido: "Perez",
        cedula: '11234098234',
        tipo_usuario: "cliente",
        municipio_id: 1,
        password_hash: "",
        creado_en: new Date(),
        verified: false
      };

      mockQuery.mockResolvedValue({
        rowCount: 1,
        rows: [mockUser],
      });

      const result = await UserRepository.getUserById(1);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1]);
      expect(result).toEqual(mockUser);
    });

    it('debería lanzar NotFoundError si no existe usuario', async () => {
      mockQuery.mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      await expect(UserRepository.getUserById(999)).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});

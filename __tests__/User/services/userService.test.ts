// userService.test.ts
import { getUserService, loadUserService } from '../../../src/User/services/userServices';
import UserRepository from '../../../src/User/repository/userRepository';
import { NotFoundError } from '../../../src/utils/error';

jest.mock('../../../src/User/repository/userRepository');

describe('User Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserService', () => {
    it('debería devolver usuario si existe', async () => {
      const mockUser = { id: 1, email: 'test@example.com', nombre: 'Juan' };
      (UserRepository.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await getUserService('test@example.com');

      expect(UserRepository.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('debería lanzar NotFoundError si no existe usuario', async () => {
      (UserRepository.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(getUserService('noexiste@example.com')).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('loadUserService', () => {
    it('debería devolver usuario si existe', async () => {
      const mockUser = { id: 1, email: 'test@example.com', nombre: 'Juan' };
      (UserRepository.getUserById as jest.Mock).mockResolvedValue(mockUser);

      const result = await loadUserService(1);

      expect(UserRepository.getUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('debería propagar error si UserRepository.getUserById lanza error', async () => {
      const error = new Error('DB failure');
      (UserRepository.getUserById as jest.Mock).mockRejectedValue(error);

      await expect(loadUserService(99)).rejects.toThrow(error);
    });
  });
});

import * as authService from '../../../src/User/services/authServices';
import AuthRepository from '../../../src/User/repository/authRepository';
import MagicLinkRepository from '../../../src/User/repository/magicLinkRepository';
import UserRepository from '../../../src/User/repository/userRepository';
import { Conflict, NotFoundError, UnauthorizedError } from '../../../src/utils/error';
import { SignUpData, LogInData } from '../../../src/types/auth';

jest.mock('../../../src/User/repository/authRepository');
jest.mock('../../../src/User/repository/magicLinkRepository');
jest.mock('../../../src/User/repository/userRepository');

const data: SignUpData = {
    nombre: "Juan",
    apellido: "Perez",
    email: "juanperez@gmail.com",
    cedula: "1031874312",
    municipio_id: 1,
    password: "pepe"
};

describe('Auth Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUserService', () => {
    it('crea usuario exitosamente', async () => {
      (AuthRepository.getMunicipiosBySlug as jest.Mock).mockResolvedValue(1);
      (AuthRepository.createUser as jest.Mock).mockResolvedValue({ id: 1, tipo_usuario: 'cliente' });

      const result = await authService.registerUserService(data, 'slug');
      expect(result).toEqual({ id: 1, tipo_usuario: 'cliente' });
    });

    it('lanza UnauthorizedError si municipio no existe', async () => {
      (AuthRepository.getMunicipiosBySlug as jest.Mock).mockResolvedValue(null);
      await expect(authService.registerUserService(data, 'slug')).rejects.toThrow(UnauthorizedError);
    });

    it('lanza UnauthorizedError si createUser devuelve null', async () => {
      (AuthRepository.getMunicipiosBySlug as jest.Mock).mockResolvedValue(1);
      (AuthRepository.createUser as jest.Mock).mockResolvedValue(null);
      await expect(authService.registerUserService(data, 'slug')).rejects.toThrow(UnauthorizedError);
    });

    it('lanza Conflict si código es 23505', async () => {
      (AuthRepository.getMunicipiosBySlug as jest.Mock).mockRejectedValue({ code: '23505' });
      await expect(authService.registerUserService(data, 'slug')).rejects.toThrow(Conflict);
    });
  });

  describe('magicLinkService', () => {
    it('devuelve datos si se crea correctamente', async () => {
      const magicData = { id: 'abc', session_id: '123', user_id: 1 };
      (MagicLinkRepository.create as jest.Mock).mockResolvedValue(magicData);
      const result = await authService.magicLinkService(1);
      expect(result).toEqual(magicData);
    });

    it('lanza NotFoundError si create devuelve null', async () => {
      (MagicLinkRepository.create as jest.Mock).mockResolvedValue(null);
      await expect(authService.magicLinkService(1)).rejects.toThrow(NotFoundError);
    });
  });

  describe('magicConsumeService', () => {
    it('consume link válido y devuelve usuario', async () => {
      const dataLink = { user_id: 1 };
      const user = { id: 1, nombre: 'Juan' };
      (MagicLinkRepository.isUsedLink as jest.Mock).mockResolvedValue(false);
      (MagicLinkRepository.getNotExpired as jest.Mock).mockResolvedValue(dataLink);
      (MagicLinkRepository.setUsed as jest.Mock).mockResolvedValue(undefined);
      (AuthRepository.setUserStatus as jest.Mock).mockResolvedValue(user);

      const result = await authService.magicConsumeService('abc');
      expect(result).toEqual(user);
    });

    it('lanza UnauthorizedError si link ya fue usado', async () => {
      (MagicLinkRepository.isUsedLink as jest.Mock).mockResolvedValue(true);
      await expect(authService.magicConsumeService('abc')).rejects.toThrow(UnauthorizedError);
    });

    it('lanza UnauthorizedError si link expiró', async () => {
      (MagicLinkRepository.isUsedLink as jest.Mock).mockResolvedValue(false);
      (MagicLinkRepository.getNotExpired as jest.Mock).mockResolvedValue(null);
      await expect(authService.magicConsumeService('abc')).rejects.toThrow(UnauthorizedError);
    });

    it('lanza NotFoundError si usuario no existe', async () => {
      (MagicLinkRepository.isUsedLink as jest.Mock).mockResolvedValue(false);
      (MagicLinkRepository.getNotExpired as jest.Mock).mockResolvedValue({ user_id: 1 });
      (MagicLinkRepository.setUsed as jest.Mock).mockResolvedValue(undefined);
      (AuthRepository.setUserStatus as jest.Mock).mockResolvedValue(null);
      await expect(authService.magicConsumeService('abc')).rejects.toThrow(NotFoundError);
    });
  });

  describe('consumeUsedMagicLink', () => {
    it('consume link usado correctamente', async () => {
      const user = { id: 1, nombre: 'Juan' };
      (MagicLinkRepository.getUsedLink as jest.Mock).mockResolvedValue({ id: 'abc' });
      (MagicLinkRepository.getNotExpired as jest.Mock).mockResolvedValue({ user_id: 1 });
      (AuthRepository.setUserStatus as jest.Mock).mockResolvedValue(user);

      const result = await authService.consumeUsedMagicLink('abc');
      expect(result).toEqual(user);
    });

    it('lanza UnauthorizedError si link usado no existe', async () => {
      (MagicLinkRepository.getUsedLink as jest.Mock).mockResolvedValue(null);
      await expect(authService.consumeUsedMagicLink('abc')).rejects.toThrow(UnauthorizedError);
    });

    it('lanza UnauthorizedError si link expiró', async () => {
      (MagicLinkRepository.getUsedLink as jest.Mock).mockResolvedValue({ id: 'abc' });
      (MagicLinkRepository.getNotExpired as jest.Mock).mockResolvedValue(null);
      await expect(authService.consumeUsedMagicLink('abc')).rejects.toThrow(UnauthorizedError);
    });

    it('lanza NotFoundError si usuario no existe', async () => {
      (MagicLinkRepository.getUsedLink as jest.Mock).mockResolvedValue({ id: 'abc' });
      (MagicLinkRepository.getNotExpired as jest.Mock).mockResolvedValue({ user_id: 1 });
      (AuthRepository.setUserStatus as jest.Mock).mockResolvedValue(null);
      await expect(authService.consumeUsedMagicLink('abc')).rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyMagicLinkService', () => {
    it('devuelve exists y verified si link usado existe', async () => {
      (MagicLinkRepository.getUsedLink as jest.Mock).mockResolvedValue({ id: 'abc' });
      const result = await authService.verifyMagicLinkService('abc');
      expect(result).toEqual({ exists: true, verified: true });
    });

    it('lanza NotFoundError si link usado no existe', async () => {
      (MagicLinkRepository.getUsedLink as jest.Mock).mockResolvedValue(null);
      await expect(authService.verifyMagicLinkService('abc')).rejects.toThrow(NotFoundError);
    });
  });

  describe('loginUserService', () => {
    it('devuelve usuario si existe', async () => {
      const user = { id: 1, email: 'a@b.com' };
      (UserRepository.getUserByEmail as jest.Mock).mockResolvedValue(user);
      const data: LogInData = { email: 'a@b.com', password: 'pass' };
      const result = await authService.loginUserService(data);
      expect(result).toEqual(user);
    });

    it('lanza NotFoundError si usuario no existe', async () => {
      (UserRepository.getUserByEmail as jest.Mock).mockResolvedValue(null);
      await expect(authService.loginUserService({ email: 'x', password: 'y' })).rejects.toThrow(NotFoundError);
    });
  });

  describe('getSessionIdService', () => {
    it('devuelve session_id si existe', async () => {
      (AuthRepository.getUserSession as jest.Mock).mockResolvedValue('session123');
      const result = await authService.getSessionIdService(1);
      expect(result).toBe('session123');
    });

    it('lanza NotFoundError si session_id no existe', async () => {
      (AuthRepository.getUserSession as jest.Mock).mockResolvedValue(null);
      await expect(authService.getSessionIdService(1)).rejects.toThrow(NotFoundError);
    });
  });
});

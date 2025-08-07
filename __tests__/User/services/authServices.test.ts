// authService.test.ts
import * as authService from '../../../src/User/services/authServices';
import AuthRepository from '../../../src/User/repository/authRepository';
import MagicLinkRepository from '../../../src/User/repository/magicLinkRepository';
import UserRepository from '../../../src/User/repository/userRepository';
import { comparePassword } from '../../../src/utils/hash';
import { Conflict, NotFoundError, UnauthorizedError } from '../../../src/utils/error';
import { SignUpData } from '../../../src/types/auth';

jest.mock('../../../src/User/repository/authRepository');
jest.mock('../../../src/User/repository/magicLinkRepository');
jest.mock('../../../src/User/repository/userRepository');
jest.mock('../../../src/utils/hash');

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
    it('debería crear un usuario exitosamente', async () => {
      (AuthRepository.getMunicipiosBySlug as jest.Mock).mockResolvedValue(1);
      (AuthRepository.createUser as jest.Mock).mockResolvedValue({ user_id: 1, tipo_usuario: 'cliente' });

      const result = await authService.registerUserService(data, 'slug-municipio');

      expect(AuthRepository.getMunicipiosBySlug).toHaveBeenCalledWith('slug-municipio');
      expect(AuthRepository.createUser).toHaveBeenCalledWith(data, '1');
      expect(result).toEqual({ user_id: 1, tipo_usuario: 'cliente' });
    });

    it('debería lanzar Conflict si hay error con código 23505', async () => {
      (AuthRepository.getMunicipiosBySlug as jest.Mock).mockRejectedValue({ code: '23505' });

      await expect(authService.registerUserService(data, 'slug')).rejects.toThrow(Conflict);
    });

    it('debería propagar otros errores', async () => {
      const error = new Error('fail');
      (AuthRepository.getMunicipiosBySlug as jest.Mock).mockRejectedValue(error);

      await expect(authService.registerUserService(data, 'slug')).rejects.toThrow(error);
    });
  });

  describe('magicLinkService', () => {
    it('debería devolver datos de magic link', async () => {
      const magicData = { id: 'abc', session_id: '123' };
      (MagicLinkRepository.create as jest.Mock).mockResolvedValue(magicData);

      const result = await authService.magicLinkService(1);

      expect(MagicLinkRepository.create).toHaveBeenCalledWith(1);
      expect(result).toEqual(magicData);
    });
  });

  describe('magicConsumeService', () => {
    it('debería consumir link mágico y devolver usuario', async () => {
      const magicData = { user_id: 1, id: 'abc', session_id: 'xyz' };
      const user = { id: 1, nombre: 'Juan' };
      (MagicLinkRepository.getValid as jest.Mock).mockResolvedValue(magicData);
      (MagicLinkRepository.setUsed as jest.Mock).mockResolvedValue(undefined);
      (AuthRepository.setUserStatus as jest.Mock).mockResolvedValue(user);

      const result = await authService.magicConsumeService('abc', 'token');

      expect(MagicLinkRepository.getValid).toHaveBeenCalledWith('abc', 'token');
      expect(MagicLinkRepository.setUsed).toHaveBeenCalledWith('abc');
      expect(AuthRepository.setUserStatus).toHaveBeenCalledWith(magicData.user_id);
      expect(result).toEqual(user);
    });
  });

  describe('verifyMagicLinkService', () => {
    it('debería devolver exists y verified true si link usado', async () => {
      (MagicLinkRepository.getUsedLink as jest.Mock).mockResolvedValue(undefined);

      const result = await authService.verifyMagicLinkService('abc');

      expect(MagicLinkRepository.getUsedLink).toHaveBeenCalledWith('abc');
      expect(result).toEqual({ exists: true, verified: true });
    });
  });

  describe('loginUserService', () => {
    it('debería devolver usuario si login correcto', async () => {
      const user = { id: 1, email: 'a@b.com', password_hash: 'hash' };
      (UserRepository.getUserByEmail as jest.Mock).mockResolvedValue(user);
      (comparePassword as jest.Mock).mockResolvedValue(true);

      const data = { email: 'a@b.com', password: 'pass' };
      const result = await authService.loginUserService(data);

      expect(UserRepository.getUserByEmail).toHaveBeenCalledWith(data.email);
      expect(comparePassword).toHaveBeenCalledWith(data.password, user.password_hash);
      expect(result).toEqual(user);
    });

    it('debería lanzar NotFoundError si usuario no existe', async () => {
      (UserRepository.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.loginUserService({ email: 'no@existe.com', password: 'pass' }))
        .rejects.toBeInstanceOf(NotFoundError);
    });

    it('debería lanzar UnauthorizedError si contraseña inválida', async () => {
      const user = { id: 1, email: 'a@b.com', password_hash: 'hash' };
      (UserRepository.getUserByEmail as jest.Mock).mockResolvedValue(user);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.loginUserService({ email: 'a@b.com', password: 'wrong' }))
        .rejects.toBeInstanceOf(UnauthorizedError);
    });
  });

  describe('getSessionIdService', () => {
    it('debería devolver el session_id', async () => {
      (AuthRepository.getUserSession as jest.Mock).mockResolvedValue('session123');

      const result = await authService.getSessionIdService(1);

      expect(AuthRepository.getUserSession).toHaveBeenCalledWith(1);
      expect(result).toBe('session123');
    });
  });
});

// emailVerificationService.test.ts
import { emailVerificationService } from '../../../src/User/services/emailVerificationService';
import UserRepository from '../../../src/User/repository/userRepository';
import { BadRequestError, Conflict } from '../../../src/utils/error';

jest.mock('../../../src/User/repository/userRepository');

describe('emailVerificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lanza BadRequestError si el email es inválido', async () => {
    await expect(emailVerificationService('no-es-email'))
      .rejects.toBeInstanceOf(BadRequestError);
  });

  it('lanza Conflict si el email ya está registrado', async () => {
    (UserRepository.getUserByEmail as jest.Mock).mockResolvedValue({ id: 1, email: 'test@example.com' });

    await expect(emailVerificationService('test@example.com'))
      .rejects.toBeInstanceOf(Conflict);
  });

  it('devuelve true si el email es válido y no está registrado', async () => {
    (UserRepository.getUserByEmail as jest.Mock).mockResolvedValue(null);

    const result = await emailVerificationService('nuevo@example.com');
    expect(result).toBe(true);
  });
});

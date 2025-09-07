import { SignUpData, SignUpPersonaData } from "../../lib/Auth/controllers/clienteCtrl";
import { emailVerificationService } from "../../lib/Auth/services/emailVerificationService";
import { Persona, User } from "../../types/Usuario";
import { Conflict, NotFoundError, UnauthorizedError } from "../../utils/error";
import { hashPassword } from "../../utils/hash";
import AuthRepository from "../repository/authRepository";
import MagicLinkRepository, { MagicLinkI } from "../repository/magicLinkRepository";
import UserRepository from "../repository/userRepository";

export const registerUserService = async (data: SignUpData, municipio_slug: string) => {
    try {
        const municipio_id = await AuthRepository.getMunicipiosBySlug(municipio_slug);
        if (!municipio_id) throw new NotFoundError("Municipio no encontrado");

        await emailVerificationService(data.correo);

        const password_hash = await hashPassword(data.password);

        const user: User | null = await AuthRepository.createUser(data, password_hash, municipio_id);
        if (!user) throw new NotFoundError("Usuario no encontrado");

        return user;
    } catch (e: any) {
        console.error("Error en el register service", e);

        // En caso de duplicate key (cedula)
        if (e.code === '23505')
            throw new Conflict("Este usuario ya esta registrado");

        throw e;
    }
}

export const magicLinkService = async (user_id: number): Promise<MagicLinkI> => {
    const magicData: MagicLinkI | null = await MagicLinkRepository.create(user_id);

    if (!magicData)
        throw new NotFoundError();

    return magicData;
};

export const magicConsumeService = async (id: string): Promise<User> => {
    const isUsed = await MagicLinkRepository.isUsedLink(id);
    if (isUsed)
        throw new UnauthorizedError("USED");

    const data = await MagicLinkRepository.getNotExpired(id);
    if (!data)
        throw new UnauthorizedError("EXPIRED");

    await MagicLinkRepository.setUsed(id);
    const user = await AuthRepository.setUserStatus(data.user_id);
    if (!user) throw new NotFoundError();

    return user;
}

export const consumeUsedMagicLink = async (id: string): Promise<User> => {
    const isUsedLink = await MagicLinkRepository.getUsedLink(id);
    if (!isUsedLink)
        throw new UnauthorizedError("Link no encontrado");

    const data = await MagicLinkRepository.getNotExpired(id);
    if (!data)
        throw new UnauthorizedError("EXPIRED");

    const user = await AuthRepository.setUserStatus(data.user_id);
    if (!user) throw new NotFoundError();

    return user;
}

interface userExistenceInterface {
    exists: boolean;
    verified: boolean;
}

export const verifyMagicLinkService = async (id: string): Promise<userExistenceInterface> => {
    const isUsed = await MagicLinkRepository.getUsedLink(id);
    if (!isUsed)
        throw new NotFoundError("Link no encontrado");

    return { exists: true, verified: true };
}

// TODO: no se necesita password tampoco aqui 
export const loginUserService = async (data: LogInData): Promise<User> => {
    const user = await UserRepository.getUserByEmail(data.email);
    if (!user)
        throw new NotFoundError();

    // const validPassword = await comparePassword(data.password, user.password_hash);
    // if (!validPassword) throw new UnauthorizedError("Credenciales invalidas");

    return user;
}

export const getSessionIdService = async (user_id: number): Promise<string> => {
    const id = await AuthRepository.getUserSession(user_id);
    if (!id) throw new NotFoundError("Este usuario esta creado y no necesita verificacion");
    return id;
}
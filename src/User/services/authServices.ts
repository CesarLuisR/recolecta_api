import { LogInData, SignUpData } from "../../types/auth";
import { User } from "../../types/user";
import { Conflict, NotFoundError, UnauthorizedError } from "../../utils/error";
import { comparePassword, hashPassword } from "../../utils/hash";
import AuthRepository from "../repository/authRepository";
import MagicLinkRepository, { MagicLinkI } from "../repository/magicLinkRepository";
import UserRepository from "../repository/userRepository";

// tofix: ya aqui no se necesita password
export const registerUserService = async (data: SignUpData, municipio_slug: string) => {
    try {
        const id = await AuthRepository.getMunicipiosBySlug(municipio_slug);

        const user: { user_id: number, tipo_usuario: string } 
            = await AuthRepository.createUser(data, id.toString());

        return user;
    } catch(e: any) {
        console.error("Error en el register service", e);

        // En caso de duplicate key (cedula)
        if (e.code === '23505')
            throw new Conflict("Este usuario ya esta registrado");

        throw e;
    }
}

export const magicLinkService = async (user_id: number): Promise<MagicLinkI> => {
    const magicData: MagicLinkI = await MagicLinkRepository.create(user_id);
    return magicData;
};

export const magicConsumeService = async (id: string, token: string): Promise<User> => {
    const data = await MagicLinkRepository.getValid(id, token);

    if (data.used === true)
        throw new Error("Magic link ya utilizado");

    await MagicLinkRepository.setUsed(id);
    const user = await AuthRepository.setUserStatus(data.user_id);
    return user;
}

interface userExistenceInterface {
    exists: boolean;
    verified: boolean;
}

export const verifyMagicLinkService = async (id: string): Promise<userExistenceInterface> => {
    await MagicLinkRepository.getUsedLink(id);

    return { exists: true, verified: true };
}

// tofix: no se necesita password tampoco aqui 
export const loginUserService = async (data: LogInData): Promise<User> => {
    const user = await UserRepository.getUserByEmail(data.email);
    if (!user) 
        throw new NotFoundError();

    const validPassword = await comparePassword(data.password, user.password_hash);
    if (!validPassword) throw new UnauthorizedError("Credenciales invalidas");

    return user;
}

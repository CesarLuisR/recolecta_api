import { User } from "../../types/Usuario";
import { NotFoundError } from "../../utils/error";
import UserRepository from "../repository/userRepository";

export interface UserCredentials {
    nombre: string;
    apellido: string;
    cedula: string;
    email: string;
}

export const getUserService = async (email: string): Promise<User> => {
    const user = await UserRepository.getUserByEmail(email);
    if (user) return user;

    throw new NotFoundError("Usuario no encontrado");
}

export const loadUserService = async (id: number): Promise<User> => {
    const user = await UserRepository.getUserById(id);
    return user;
}

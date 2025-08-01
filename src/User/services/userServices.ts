import { User } from "../../types/user";
import { NotFoundError } from "../../utils/error";
import UserRepository from "../repository/userRepository";

export const loginUserExistenceService = async (email: string): Promise<number> => {
    const user = await UserRepository.getUserByEmail(email);
    if (user)
        return user.id;

    throw new NotFoundError("Usuario no encontrado");
}

export const loadUserService = async (id: number): Promise<User> => {
    const user = await UserRepository.getUserById(id);
    return user;
}
import isEmail from "validator/lib/isEmail";
import { BadRequestError, Conflict } from "../../../utils/error";
import UserRepository from "../../../User/repository/userRepository";

export const emailVerificationService = async (email: string) => {
    const isFormatValid = isEmail(email);
    if (!isFormatValid)
        throw new BadRequestError();

    const user = await UserRepository.getUserByEmail(email);
    if (user) 
        throw new Conflict("El usuario esta registrado");
}
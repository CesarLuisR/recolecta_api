import isEmail from "validator/lib/isEmail"
import { BadRequestError, Conflict, NotFoundError } from "../../utils/error";
import UserRepository from "../repository/userRepository";

export const emailVerificationService = async (email: string): Promise<boolean> => {
    const isFormatValid = isEmail(email);
    if (!isFormatValid)
        throw new BadRequestError();

    const user = await UserRepository.getUserByEmail(email);
    if (user) 
        throw new Conflict("El usuario esta registrado, ya sea la cedula o el correo");

    return true;
}
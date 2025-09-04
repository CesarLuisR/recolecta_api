import isEmail from "validator/lib/isEmail";
import { BadRequestError, Conflict } from "../../../utils/error";
import { UsuarioRepository } from "../../Usuarios/repositories/usuarioRepository";

export const emailVerificationService = async (email: string) => {
    const isFormatValid = isEmail(email);
    if (!isFormatValid)
        throw new BadRequestError();

    const user = await UsuarioRepository.getUsuarioByEmail(email);
    if (user) 
        throw new Conflict("El usuario esta registrado");
}
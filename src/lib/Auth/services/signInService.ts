import { Usuario } from "../../../types/Usuario";
import { TradicionalSignIn } from "../controllers/clienteCtrl";
import * as usuarioRepository from "../../Usuarios/repositories/usuarioRepository";
import { NotFoundError, UnauthorizedError } from "../../../utils/error";
import { comparePassword } from "../../../utils/hash";

export const signInService = async (data: TradicionalSignIn): Promise<Usuario> => {
    const user = await usuarioRepository.getVerifiedUsuarioWithHashByEmail(data.correo);
    if (!user) throw new NotFoundError("Credenciales invalidas");

    const validPassword = await comparePassword(data.password, user.password_hash);
    if (!validPassword) throw new UnauthorizedError("Credenciales invalidas");

    return user;
}
import { isEmail } from "validator";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../../utils/error";
import { Usuario } from "../../../types/Usuario";
import { getClienteByUsuarioId, getUsuarioWithHashByEmail } from "../repositories/usuarioRepository";
import { comparePassword } from "../../../utils/hash";
import { SignUpEmpresaData } from "../../Auth/controllers/clienteCtrl";

export const personVerificationService = async (data: SignUpEmpresaData): Promise<Usuario | null> => {
    const isFormatValid = isEmail(data.correo);
    if (!isFormatValid)
        throw new BadRequestError();

    const user = await getUsuarioWithHashByEmail(data.correo);
    if (!user) throw new NotFoundError("Usuario no encontrado");

    const validPass = comparePassword(data.password, user.password_hash);
    if (!validPass) throw new UnauthorizedError("Credenciales invalidas");

    const cliente = await getClienteByUsuarioId(user.id);
    if (cliente && cliente.verificado)
        throw new BadRequestError("Usuario ya verificado");

    return cliente;
}

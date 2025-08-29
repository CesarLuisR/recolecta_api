import { RequestHandler } from "express";
import { NotFoundError, UnauthorizedError } from "../../../utils/error";
import { UsuarioRepository } from "../repositories/usuarioRepository";

export const getUsuariosCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { email } = req.query;

        const users = email !== null
            ? await UsuarioRepository.getUsuarioByEmail(email as string)
            : await UsuarioRepository.getUsuarios();

        res.status(200).json({ users });
    } catch (error) {
        next(error);
    }
};

export const getUsuarioByIdCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await UsuarioRepository.findById(Number(id));
        if (!user) throw new NotFoundError("User not found");

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};
export const getMeCtrl: RequestHandler = async (req, res, next) => {
    try {
        if (!req.user)
            throw new UnauthorizedError("No user info found in request");

        const id = req.user.id;
        const user = await UsuarioRepository.findById(id); 
        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
}

export const getClienteByUsuarioIdCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { verificado } = req.query;
        let user;
        if (verificado !== undefined) {
            user = await UsuarioRepository.getClienteByUsuarioIdAndVerificado(
                Number(id),
                verificado === "true"
            );
        } else {
            user = await UsuarioRepository.getClienteByUsuarioId(Number(id));
        }
        if (!user) throw new NotFoundError("Client not found");

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};

export const checkEmailExistsCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { email } = req.params;
        const user = await UsuarioRepository.getUsuarioByEmail(email);
        res.status(200).json({ exists: !!user });
    } catch (error) {
        next(error);
    }
}
// TODO: Arreglar esto
// esta mal planteado, no verified debe literalmnete obtener un usuario con todos sus datos si el formualio es correcto

// entonces deberiamos hacerlo dependiendo del tipo de cliente
export const verifyUsuarioCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;  
        const user = await UsuarioRepository.getClienteByUsuarioIdAndVerificado(Number(id), true);
        if (!user) throw new NotFoundError("User not found or already verified");
        res.status(200).json({ message: "Verification process initiated" });
    } catch (error) {
        next(error);
    }
}
import { RequestHandler } from "express";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../../utils/error";
import { UsuarioRepository } from "../repositories/usuarioRepository";
import { personVerificationService } from "../services/clienteVerificationService";
import isEmail from "validator/lib/isEmail";

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

        if (!isEmail(email)) 
            throw new BadRequestError("Formato de email incorrecto");

        const user = await UsuarioRepository.getUsuarioByEmail(email);
        res.status(200).json({ exists: !!user, user });
    } catch (error) {
        next(error);
    }
}

export const verifyUsuarioIdentityCtrl: RequestHandler = async (req, res, next) => {
    try {
        const data: { correo: string, password: string } = req.body;

        if (!data.correo || typeof data.correo !== "string")
            throw new BadRequestError("Formato invalido");
        if (!data.password || typeof data.password !== "string")
            throw new BadRequestError("Formato invalido");

        const user = await personVerificationService(data);

        res.status(201).json({ message: "Usuario encontrado exitosamente", user });
    } catch (e) {
        next(e);
    }
}
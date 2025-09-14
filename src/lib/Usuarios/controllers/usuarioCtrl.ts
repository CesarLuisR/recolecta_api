import { RequestHandler } from "express";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../../utils/error";
import { getClienteByUsuarioId, getClienteByUsuarioIdAndVerificado, getUsuarioByEmail, UsuarioRepository } from "../repositories/usuarioRepository";
import { SignUpEmpresaData, SignUpPersonaData } from "../../Auth/controllers/clienteCtrl";
import { validateCedulaService } from "../../Auth/services/cedulaService";
import { validateRNCService } from "../../Auth/services/rncService";

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
        res.status(200).json({ exists: !!user, user });
    } catch (error) {
        next(error);
    }
}

export const verifyUsuarioPersonaCtrl: RequestHandler = async (req, res, next) => {
    try {
        const data: SignUpPersonaData = req.body;

        for (const key of Object.keys(data) as Array<keyof SignUpPersonaData>) {
            const value = data[key];
  
            if (key === 'fecha_nacimiento' && value instanceof Date) continue;

            if (!value || typeof value != 'string')
                throw new BadRequestError("Formato invalido");
        }

        if (!validateCedulaService(data.cedula))
            throw new BadRequestError("Cedula invalida");

        const user = await getUsuarioByEmail(data.correo);
        if (!user) throw new NotFoundError("Usuario no encontrado");

        const cliente = await getClienteByUsuarioId(user.id);

        if (cliente && cliente.verificado)
            throw new BadRequestError("Usuario ya verificado");

        res.status(201).json({ message: "Usuario encontrado exitosamente", user });
    } catch (error) {
        next(error);
    }
}

export const verifyUsuarioEmpresaCtrl : RequestHandler = async (req, res, next) => {
    try {
        const data: SignUpEmpresaData = req.body;

        for (const key of Object.keys(data) as Array<keyof SignUpEmpresaData>) {
            const value = data[key];

            if (!value || typeof value != 'string')
                throw new BadRequestError("Formato invalido");
        }

        if (!validateRNCService(data.rnc))
            throw new BadRequestError("RNC invalido");

        const user = await getUsuarioByEmail(data.correo);
        if (!user) throw new NotFoundError("Usuario no encontrado");

        const cliente = await getClienteByUsuarioId(user.id);
        if (cliente && cliente.verificado)
            throw new BadRequestError("Usuario ya verificado");

        res.status(201).json({ message: "Usuario encontrado exitosamente", user });
    } catch (error) {
        next(error);
    }
}
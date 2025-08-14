import e, { RequestHandler } from "express";
import { verifyAccessToken } from "../../utils/token";
import { loadUserService, getUserService } from "../services/userServices";
import config from "../../config";
import { BadRequestError } from "../../utils/error";
import { validateCedulaService } from "../services/cedulaService";
import { emailVerificationService } from "../services/emailVerificationService";

export const load: RequestHandler = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        const payload = verifyAccessToken(token);
        const user = await loadUserService(payload.id);
        res.status(200).json({ user })
    } catch(e: any) {
        next(e);
    }
}

export const getUser: RequestHandler = async (req, res, next) => {
    try {
        const { email } = req.body;
        console.log("Email", req.body);
        const user = await getUserService(email);
        res.status(200).json({ id: user.id });
    } catch(e: any) {
        next(e);
    }
}

export const noVerifiedUser: RequestHandler = async (req, res, next) => {
    try {
        const data = req.body;

        if (!data.nombre || !data.apellido || !data.cedula || !data.email)
            throw new BadRequestError("Se necesitan todos los datos");

        if (typeof data.cedula != "string" || data.cedula.length > 13)
            throw new BadRequestError("Formato de cedula incorrecto");

        if (typeof data.email != "string")
            throw new BadRequestError("Formato de email incorrecto");

        const cedulaValida = validateCedulaService(data.cedula);
        if (!cedulaValida) throw new BadRequestError("Cedula invalida");

        const user = await getUserService(data);
        res.status(200).json({ user })
    } catch(e) {
        next(e);
    }
}

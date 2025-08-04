import { RequestHandler } from "express";
import { LogInData, SignUpData } from "../../types/auth";
import { BadRequestError, ForbiddenError, UnauthorizedError } from "../../utils/error";
import { validateCedulaService } from "../services/cedulaService";
import { getSessionIdService, loginUserService, magicConsumeService, magicLinkService, registerUserService, verifyMagicLinkService } from "../services/authServices";
import config from "../../config";
import { generateAccessToken, generateRefreshToken, TokenPayload, verifyAccessToken, verifyRefreshToken } from "../../utils/token";
import TokenRepository from "../repository/tokenRepository";
import { emailVerificationService } from "../services/emailVerificationService";
import transporter from "../../utils/SMTP";

export const signUp: RequestHandler = async (req, res, next) => {
    try {
        const data: SignUpData = req.body;
        const municipio_slug = req.params.municipio_slug;

        if (!data.nombre || !data.apellido || !data.cedula || !data.email)
            throw new BadRequestError("Se necesitan todos los datos");

        if (typeof data.cedula != "string" || data.cedula.length > 13)
            throw new BadRequestError("Formato de cedula incorrecto");

        if (typeof data.email != "string")
            throw new BadRequestError("Formato de email incorrecto");

        const cedulaValida = validateCedulaService(data.cedula);
        if (!cedulaValida) throw new BadRequestError("Cedula invalida");

        await emailVerificationService(data.email);
        const user = await registerUserService(data, municipio_slug);

        res.status(201).json({ message: "Usuario creado exitosamente", user: user });
    } catch(e: any) {
        next(e);
    }
}

export const magicLink: RequestHandler = async (req, res, next) => {
    try {
        const { user_id, email } = req.body;
        const { id, session_id }= await magicLinkService(user_id);

        const magicLink = `${config.origin}/auth/magic_link/${id}`;

        await transporter.sendMail({
            from: '"RECOLECTA RD" <no-reply@recolectard.com>',
            to: email,
            subject: "Tu enlace mágico para entrar",
            html: `<p>Haz clic <a href="${magicLink}">aquí</a> para entrar. Este enlace expira en 10 minutos.</p>`
        });

        res
            .cookie("session_id", session_id, {
                httpOnly: true,
                secure: config.ENV === "production", 
                sameSite: config.ENV === "production" ? "none" : "lax",
                maxAge: 10 * 60 * 1000, // 10 mins
                path: "/", 
            })
            .status(201)
            .json({ message: "Mensaje enviado correctamente" });
    } catch(e: any) {
        next(e);
    }
}

export const validateMagicLink: RequestHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await verifyMagicLinkService(id);
        res.status(200).json({ data: data });
    } catch(e) {
        next(e);
    }
}

export const getSessionId: RequestHandler = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        // TODO: El error puede estar aqui
        const session_id = await getSessionIdService(id);

        res
            .cookie("session_id", session_id, {
                httpOnly: true,
                secure: config.ENV === "production", 
                sameSite: config.ENV === "production" ? "none" : "lax",
                maxAge: 10 * 60 * 1000, // 10 mins
                path: "/", 
            })
            .status(201)
            .json({ message: "Session establecida correctamente" });
    } catch(e) {
        next(e);
    }
}

export const magicConsume: RequestHandler = async (req, res, next) => {
    try {
        const token = req.cookies.session_id;

        if (!token) 
            throw new UnauthorizedError();

        const id = req.params.id;
        const user = await magicConsumeService(id, token);

        const accessToken = generateAccessToken({ id: user.id, tipo_usuario: user.tipo_usuario });
        const refreshToken = generateRefreshToken({ id: user.id, tipo_usuario: user.tipo_usuario });

        TokenRepository.saveRefreshToken(user.id, refreshToken);

        res
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: config.ENV === "production", 
                sameSite: config.ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: "/", 
            })
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: config.ENV === "production",
                sameSite: config.ENV === "production" ? "none" : "lax",
                maxAge: 15 * 60 * 1000, // 15mins
                path: "/", 
            })
            .status(201)
            .json({ message: "Usuario logeado correctamente", user });
    } catch(e) {
        next(e);
    }
}

export const logIn: RequestHandler = async (req, res, next) => {
    try {
        const data: LogInData = req.body;
        if (!data.email || !data.password) 
            throw new BadRequestError("Se necesitan todos los datos");

        if (typeof data.password != "string" || data.password.length > 30)
            throw new BadRequestError("Clave con formato erroneo");

        const user = await loginUserService(data);

        const accessToken = generateAccessToken({ id: user.id, tipo_usuario: user.tipo_usuario });
        const refreshToken = generateRefreshToken({ id: user.id, tipo_usuario: user.tipo_usuario });

        TokenRepository.saveRefreshToken(user.id, refreshToken);

        res
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: config.ENV === "production", 
                sameSite: config.ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: "/", 
            })
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: config.ENV === "production",
                sameSite: config.ENV === "production" ? "none" : "lax",
                maxAge: 15 * 60 * 1000, // 15mins
                path: "/", 
            })
            .status(201)
            .json({ message: "Usuario logeado correctamente", user });
    } catch(e: any) {
        next(e);
    }
}

export const refreshToken: RequestHandler = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) 
            throw new UnauthorizedError();

        let payload: TokenPayload;
        try {
            payload = verifyRefreshToken(token);
        } catch {
            throw new ForbiddenError();
        }

        const valid = await TokenRepository.isRefreshTokenValid(payload.id, token);
        if (!valid) throw new ForbiddenError();

        const { id, tipo_usuario } = payload;
        const accessToken = generateAccessToken({ id, tipo_usuario });
        const refreshToken = generateRefreshToken({ id, tipo_usuario });

        TokenRepository.revokeToken(token.id, token);
        TokenRepository.saveRefreshToken(payload.id, refreshToken);

        res
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: config.ENV === "production",
                sameSite: config.ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: "/", 
            })
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: config.ENV === "production",
                sameSite: config.ENV === "production" ? "none" : "lax",
                maxAge: 15 * 60 * 1000, // 15mins
                path: "/", 
            })
            .sendStatus(200);
    } catch(e) {
        next(e);
    }
}

export const logOut: RequestHandler = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (token) {
            let payload: TokenPayload;
            try {
                payload = verifyRefreshToken(token);
            } catch {
                res
                    .clearCookie("refreshToken", {
                        httpOnly: true,
                        secure: config.ENV === "production",
                        sameSite: config.ENV === "production" ? "none" : "lax",
                    })
                    .clearCookie("accessToken", {
                        httpOnly: true,
                        secure: config.ENV === "production",
                        sameSite: config.ENV === "production" ? "none" : "lax",
                    })
                    .sendStatus(204);
                return;
            }
            await TokenRepository.revokeToken(payload.id, token);
        }

        res
            .clearCookie("refreshToken", {
                httpOnly: true,
                secure: config.ENV === "production",
                sameSite: config.ENV === "production" ? "none" : "lax",
                path: "/", 
            })
            .clearCookie("accessToken", {
                httpOnly: true,
                secure: config.ENV === "production",
                sameSite: config.ENV === "production" ? "none" : "lax",
                path: "/", 
            })
            .sendStatus(204);
    } catch(e) {
        next(e);
    }
}

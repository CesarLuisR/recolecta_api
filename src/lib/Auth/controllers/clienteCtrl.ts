import { RequestHandler } from "express"
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "../../../utils/error";
import { validateCedulaService } from "../services/cedulaService";
import { validateRNCService } from "../services/rncService";
import { registerClienteEmpresaService, registerClientePersonaService } from "../services/clienteService";
import { signInService } from "../services/signInService";
import { generateAccessToken, generateRefreshToken, TokenPayload, verifyRefreshToken } from "../../../utils/token";
import TokenRepository from "../repositories/tokenRepository";
import config from "../../../config";
import { Usuario } from "../../../types/User";
import { getUsuarioByEmail } from "../../Usuarios/repositories/usuarioRepository";
import { sendWithNodemailer, sendWithSES } from "../services/emailSenderService";
import { consumeUsedMagicLink, magicConsumeService, magicLinkService } from "../services/magicLinkService";
import MagicLinkRepository from "../repositories/magicLinkRepository";

export interface SignUpData {
    correo: string;
    password: string;
    telefono: string;
    direccion: string;
}

export interface SignUpPersonaData extends SignUpData {
    nombre: string;
    apellido: string;
    cedula: string;
    fecha_nacimiento: Date;
}

export interface SignUpEmpresaData extends SignUpData {
    nombre_empresa: string;
    contacto_nombre: string;
    tipo_empresa: string;
    rnc: string;
}

export interface TradicionalSignIn {
    correo: string;
    password: string;
}

export const signUpPersonaCtrl: RequestHandler = async (req, res, next) => {
    try {
        const data: SignUpPersonaData = req.body;
        const municipio_slug = req.params.municipio_slug;

        for (const key of Object.keys(data) as Array<keyof SignUpPersonaData>) {
            const value = data[key];
  
            if (key === 'fecha_nacimiento' && value instanceof Date) continue;

            if (!value || typeof value != 'string')
                throw new BadRequestError("Formato invalido");
        }

        if (!validateCedulaService(data.cedula))
            throw new BadRequestError("Cedula invalida");

        const user = await registerClientePersonaService(data, municipio_slug);

        res.status(201).json({ message: "Usuario creado exitosamente", user });
    } catch (e) {
        next(e);
    }
}

export const signUpEmpresaCtrl: RequestHandler = async (req, res, next) => {
    try {
        const data: SignUpEmpresaData = req.body;
        const municipio_slug = req.params.municipio_slug;

        for (const key of Object.keys(data) as Array<keyof SignUpEmpresaData>) {
            const value = data[key];
  
            if (!value || typeof value != 'string')
                throw new BadRequestError("Formato invalido");
        }

        if (!validateRNCService(data.rnc))
            throw new BadRequestError("RNC invalido");

        const user = await registerClienteEmpresaService(data, municipio_slug);

        res.status(201).json({ message: "Usuario creado exitosamente", user });
    } catch (e) {
        next(e);
    }

}

export const signInCtrl: RequestHandler = async (req, res, next) => {
    try {
        let user: Usuario | null = null;

        if (req.query.tipo === 'tradicional') {
            const data: TradicionalSignIn = req.body;
            if (!data.correo || !data.password)
                throw new BadRequestError("Se necesitan todos los datos");

            user = await signInService(data);
        } else {
            const { correo } = req.body;
            if (!correo) throw new BadRequestError("Se necesita todos los datos");

            user = await getUsuarioByEmail(correo);
            if (!user) throw new NotFoundError("Usuario no encontrado");
        }
        
        const accessToken = generateAccessToken({ id: user.id, tipo_usuario: user.tipo });
        const refreshToken = generateRefreshToken({ id: user.id, tipo_usuario: user.tipo });

        TokenRepository.saveRefreshToken(user.id, refreshToken);

        res
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: config.ENV === "production", 
                sameSite: config.ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: "/", 
            })
            .status(201)
            .json({ message: "Usuario logeado correctamente", user, accessToken });
    } catch (e) {
        next(e);
    }
}

export const signOutCtrl: RequestHandler = async (req, res, next) => {
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
            .sendStatus(204);
    } catch(e) {
        next(e);
    }
}

export const refreshCtrl: RequestHandler = async (req, res, next) => {
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
            .status(200)
            .json({ accessToken })
    } catch(e) {
        next(e);
    }
}

export const sendMagicLinkCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { user_id, email } = req.body;
        const { id, session_id } = await magicLinkService(user_id);

        const magicLink = `${config.origin}/auth/magic-link/${id}`;

        const sendEmail =
            process.env.NODE_ENV === "production" ? sendWithSES : sendWithNodemailer;

        await sendEmail(email, "Tu enlace mágico", `<p>Haz clic <a href="${magicLink}">aquí</a> para entrar. Este enlace expira en 10 minutos.</p>`);

        res.cookie("session_id", session_id, {
                httpOnly: true,
                secure: config.ENV === "production", 
                sameSite: config.ENV === "production" ? "none" : "lax",
                maxAge: 10 * 60 * 1000, // 10 mins
                path: "/", 
            })
            .status(201)
            .json({ message: "Mensaje enviado correctamente" });

    } catch(e) {
        next(e);
    }
}

export const consumeMagicLinkCtrl: RequestHandler = async (req, res, next) => {
    try {
        const consumed = req.query.consumed;
        const id = req.params.id;

        let user: Usuario | null = null;

        if (!consumed) user = await magicConsumeService(id);
        else user = await consumeUsedMagicLink(id);

        const token = req.cookies.session_id;
        const isSessionValid = MagicLinkRepository.isSessionValid(id, token);
        if (!token || !isSessionValid) 
            throw new UnauthorizedError("NO_SESSION");

        const accessToken = generateAccessToken({ id: user.id, tipo_usuario: user.tipo});
        const refreshToken = generateRefreshToken({ id: user.id, tipo_usuario: user.tipo });

        TokenRepository.saveRefreshToken(user.id, refreshToken);

        res
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: config.ENV === "production", 
                sameSite: config.ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: "/", 
            })
            .status(201)
            .json({ message: "Usuario logeado correctamente" , user, accessToken });
    } catch(e) {
        next(e);
    }
}

export const validateMagicLinkCtrl: RequestHandler = async (req, res, next) => {
    try {
        const id = req.params.id;

        const isUsed = await MagicLinkRepository.getUsedLink(id);
        if (!isUsed)
            throw new NotFoundError("Link no encontrado");

        res.status(200).json({ exists: true, verified: true });
    } catch(e) {
        next(e);
    }
}

export const getSessionCtrl: RequestHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        const magicLink = await MagicLinkRepository.getNotExpired(id);
        if (!magicLink) throw new NotFoundError("Este usuario esta creado y no necesita verificacion");

        res
            .cookie("session_id", magicLink.session_id, {
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
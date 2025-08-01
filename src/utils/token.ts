import jwt from "jsonwebtoken";
import config from "../config";

export interface TokenPayload {
    id: number;
    tipo_usuario: string;
}

const JWT_ACCESS_SECRET = config.jwtAccessSecret;
const JWT_REFRESH_SECRET = config.jwtRefreshSecret;

export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export const verifyAccessToken = (token: string): TokenPayload => {
    return jwt.verify(token, JWT_ACCESS_SECRET) as TokenPayload;
}

export const verifyRefreshToken = (token: string): TokenPayload => {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
}
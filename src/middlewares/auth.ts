import { RequestHandler } from "express";
import { TokenPayload, verifyAccessToken } from "../utils/token";
import { UnauthorizedError } from "../utils/error";

export const authenticateToken: RequestHandler = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        next(new UnauthorizedError("Denied access. No token provided"));
        return;
    }

    try {
        const decoded = verifyAccessToken(token) as TokenPayload;
        req.user = decoded;
        next();
    } catch(e) {
        console.error("Error verifying token");
        next(new UnauthorizedError());
    }
}
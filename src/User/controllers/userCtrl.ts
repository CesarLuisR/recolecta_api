import { RequestHandler } from "express";
import { verifyAccessToken } from "../../utils/token";
import { loadUserService, loginUserExistenceService } from "../services/userServices";

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

export const loginUserExistence: RequestHandler = async (req, res, next) => {
    try {
        const { email } = req.body;
        const id = await loginUserExistenceService(email);
        res.status(200).json({ id: id });
    } catch(e: any) {
        next(e);
    }
}
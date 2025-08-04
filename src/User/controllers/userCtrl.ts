import e, { RequestHandler } from "express";
import { verifyAccessToken } from "../../utils/token";
import { loadUserService, getUserService } from "../services/userServices";
import config from "../../config";

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
        const user = await getUserService(email);
        res.status(200).json({ id: user.id });
    } catch(e: any) {
        next(e);
    }
}

export const noVerifiedUser: RequestHandler = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await getUserService(email);
        res.status(200).json({ user })
    } catch(e) {
        next(e);
    }
}

import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth";
import * as userCtrl from "../controllers/userCtrl";

const router = Router();

// TODO: Por aqui hay que hacer un buen refactor y hacer esto mejor
router.post("/load", authenticateToken, userCtrl.load);
router.post("/email/exists", userCtrl.getUser); // devuleve el id 
router.post("/loadNoVerified", userCtrl.noVerifiedUser); // devuelve un usuario

export default router;
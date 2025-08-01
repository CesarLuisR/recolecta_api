import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth";
import * as userCtrl from "../controllers/userCtrl";

const router = Router();

router.post("/load", authenticateToken, userCtrl.load);
router.post("/email/exists", userCtrl.loginUserExistence);

export default router;
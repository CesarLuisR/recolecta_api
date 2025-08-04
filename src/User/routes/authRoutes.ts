import { Router } from "express"
import * as authCtrl from "../controllers/authCtrl"

const router = Router();

router.post("/signup/:municipio_slug", authCtrl.signUp);

router.post("/magic", authCtrl.magicLink);
router.get("/magic/validate/:id", authCtrl.validateMagicLink);
router.post("/magic/consume/:id", authCtrl.magicConsume);
router.get("/session/:id", authCtrl.getSessionId);

router.post("/login", authCtrl.logIn);

router.post("/refresh", authCtrl.refreshToken);

router.post("/logout", authCtrl.logOut);


export default router;
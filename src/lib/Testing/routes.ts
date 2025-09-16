import { Router } from "express";
import * as testCtrl from "./controllers";

const router = Router();

router.post("/reset-db", testCtrl.resetDBCtrl);
router.post("/expire-magic-link/:id", testCtrl.expireMagicLink)
router.post("/use-magic-link/:id", testCtrl.useMagicLink)

export default router;
import { Router } from "express";
import * as clienteCtrl from "../controllers/clienteCtrl";

const router = Router();

router.post("/sign-up/persona/:municipio_slug", clienteCtrl.signUpPersonaCtrl);
router.post("/sign-up/empresa/:municipio_slug", clienteCtrl.signUpEmpresaCtrl);
router.post("/sign-in", clienteCtrl.signInCtrl);
router.post("/sign-out", clienteCtrl.signOutCtrl);
router.post("/refresh", clienteCtrl.refreshCtrl);
router.post("/magic-link", clienteCtrl.sendMagicLinkCtrl);
router.post("/magic-link/:id", clienteCtrl.consumeMagicLinkCtrl);
router.post("/magic-link/:id/validate", clienteCtrl.validateMagicLinkCtrl);
router.get("/magic-link/:id/session", clienteCtrl.getSessionCtrl);

export default router;
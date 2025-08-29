import { Router } from "express";
import * as usuarioCtrl from "../controllers/usuarioCtrl";
import { authenticateToken } from "../../../middlewares/auth";

const router = Router();

router.get("/", authenticateToken, usuarioCtrl.getUsuariosCtrl); 
router.get("/:id", authenticateToken, usuarioCtrl.getUsuarioByIdCtrl);
router.get("/me", authenticateToken, usuarioCtrl.getMeCtrl);
// router.post("/", usuarioCtrl.createUsuarioCtrl);
// router.put("/:id", usuarioCtrl.updateUsuarioCtrl);
// router.delete("/:id", usuarioCtrl.deleteUsuarioCtrl);

router.get("/:id/cliente", authenticateToken, usuarioCtrl.getClienteByUsuarioIdCtrl); 
// router.get("/:id/administrador", usuarioCtrl.getAdministradorByUsuarioIdCtrl);
// router.get("/:id/persona", usuarioCtrl.getPersonaByUsuarioIdCtrl);
// router.get("/:id/empresa", usuarioCtrl.getEmpresaByUsuarioIdCtrl);

router.get("/verifyEmail/:email", usuarioCtrl.checkEmailExistsCtrl);
router.post("/:id/verify-cliente", usuarioCtrl.verifyUsuarioCtrl);
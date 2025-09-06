import { Router } from "express";
import {
    getPublicByMunicipioCtrl,
    getByIdCtrl,
    createRutaCtrl,
    updateRutaCtrl,
    deleteRutaCtrl,
    toggleEstadoCtrl,
    toggleVisibilidadCtrl,
    filterByMunicipioCtrl,
} from "../controllers/rutasCtrl";

const router = Router();

router.get("/municipio/:municipio_slug/public", getPublicByMunicipioCtrl);
router.get("/municipio/:municipio_slug/filter", filterByMunicipioCtrl);
router.get("/:id", getByIdCtrl);
router.post("/", createRutaCtrl);
router.put("/:id", updateRutaCtrl);
router.delete("/:id", deleteRutaCtrl);
router.patch("/:id/toggle-estado", toggleEstadoCtrl);
router.patch("/:id/toggle-visibilidad", toggleVisibilidadCtrl);

export default router;

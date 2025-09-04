import { Router } from "express";
import * as contenedorCtrl from "../controllers/contenedorCtrl";

const router = Router();

router.get("/municipio/:municipio_slug", contenedorCtrl.getPublicByMunicipioCtrl);
router.post("/", contenedorCtrl.createContenedorCtrl);
router.get("/:id", contenedorCtrl.getByIdCtrl);
router.put("/:id", contenedorCtrl.updateContenedorCtrl);
router.delete("/:id", contenedorCtrl.deleteContenedorCtrl);

router.patch("/:id/estado", contenedorCtrl.toggleEstadoCtrl);
router.patch("/:id/visibilidad", contenedorCtrl.toggleVisibilidadCtrl);

// Ejemplo: GET /contenedores/municipio/santo-domingo?tipo=small&estado=activo
router.get("/municipio/:municipio_slug/filter", contenedorCtrl.filterByMunicipioCtrl);
// Obtener contenedores asociados a un servicio (requiere tabla intermedia ServicioContenedor)
router.get("/servicio/:servicio_id", contenedorCtrl.getByServicioIdCtrl);

export default router;

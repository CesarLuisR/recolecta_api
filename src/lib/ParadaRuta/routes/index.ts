import { Router } from "express";
import * as rutaParadaCtrl from "../controllers";

const router = Router();

router.get("/", rutaParadaCtrl.getAllCtrl);    
router.get("/:id", rutaParadaCtrl.getByIdCtrl);
router.post("/", rutaParadaCtrl.createCtrl);   
router.put("/:id", rutaParadaCtrl.updateCtrl); 
router.delete("/:id", rutaParadaCtrl.deleteCtrl);

// Rutas adicionales específicas
router.get("/ruta/:ruta_id", rutaParadaCtrl.getByRutaCtrl);  
// ejemplo: obtener todas las paradas de una ruta en orden

router.get("/ruta/:ruta_id/tipo/:tipo_parada", rutaParadaCtrl.getByRutaAndTipoCtrl);  
// ejemplo: obtener todas las paradas de un tipo dentro de una ruta

export default router;

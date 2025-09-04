import { Router } from "express";
import * as contenedorCtrl from "../controllers/contenedorCtrl";

const router = Router();

/**
 * Público
 */
// Obtener contenedores visibles de un municipio (filtro por query params)
router.get("/municipio/:municipio_slug", contenedorCtrl.getPublicByMunicipioCtrl);

/**
 * CRUD (admin)
 */
// Crear un contenedor
router.post("/", contenedorCtrl.createContenedorCtrl);

// Obtener un contenedor por ID
router.get("/:id", contenedorCtrl.getByIdCtrl);

// Actualizar un contenedor (PUT = reemplazo completo, PATCH = cambios parciales)
router.put("/:id", contenedorCtrl.updateContenedorCtrl);

// Eliminar un contenedor
router.delete("/:id", contenedorCtrl.deleteContenedorCtrl);

/**
 * Acciones específicas
 */
// Cambiar estado (activo/inactivo)
router.patch("/:id/estado", contenedorCtrl.toggleEstadoCtrl);

// Cambiar visibilidad (público/privado)
router.patch("/:id/visibilidad", contenedorCtrl.toggleVisibilidadCtrl);

/**
 * Filtros y búsquedas
 */
// Filtros por query params (más flexible que rutas fijas)
// Ejemplo: GET /contenedores/municipio/santo-domingo?tipo=small&estado=activo
router.get("/municipio/:municipio_slug/filter", contenedorCtrl.filterByMunicipioCtrl);

// Obtener contenedores asociados a un servicio (requiere tabla intermedia ServicioContenedor)
router.get("/servicio/:servicio_id", contenedorCtrl.getByServicioIdCtrl);

export default router;

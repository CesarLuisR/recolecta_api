import { Router } from "express";
import * as contenedorCtrl from "../controllers";

const router = Router();

// Obtener todos los contenedores públicos de un municipio
router.get("/public/:municipio_slug", contenedorCtrl.getPublicByMunicipio);

// Obtener un contenedor por ID
router.get("/:id", contenedorCtrl.getById);

/**
 * Rutas para administradores
 */
// Crear un contenedor nuevo
router.post("/", contenedorCtrl.createContenedor);

// Actualizar un contenedor
router.put("/:id", contenedorCtrl.updateContenedor);

// Eliminar un contenedor
router.delete("/:id", contenedorCtrl.deleteContenedor);

// Listar todos los contenedores de un municipio, con opción de filtrar por públicos o privados
router.get("/municipio/:municipio_slug", contenedorCtrl.getAllByMunicipio);

// Cambiar estado de un contenedor (activo/inactivo)
router.patch("/:id/estado", contenedorCtrl.toggleEstado);

/**
 * Filtros y búsquedas avanzadas
 */
// Buscar contenedores por tipo (small, medium, big) dentro de un municipio
router.get("/municipio/:municipio_slug/tipo/:tipo", contenedorCtrl.getByTipo);

// Obtener contenedores asociados a un servicio específico
router.get("/servicio/:servicio_id", contenedorCtrl.getByServicioId);

export default router;

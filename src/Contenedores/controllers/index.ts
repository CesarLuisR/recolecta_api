import { RequestHandler } from "express";
import { BadRequestError, NotFoundError } from "../../utils/error";
import * as ContenedorRepository from "../repositories/repository";
import { Contenedor } from "../../types/Contenedor";
import AuthRepository from "../../User/repository/authRepository";

/**
 * Obtener todos los contenedores públicos de un municipio
 */
export const getPublicByMunicipio: RequestHandler = async (req, res, next) => {
    try {
        const municipio_id = await AuthRepository.getMunicipiosBySlug(req.params.municipio_slug);
        if (!municipio_id)
            throw new NotFoundError("Municipio no encontrado");

        const contenedores: Contenedor[] = await ContenedorRepository.getContenedoresFiltradosRepo(municipio_id, true);
        res.status(200).json({ contenedores });
    } catch (e) {
        next(e);
    }
};

/**
 * Obtener contenedor por ID
 */
export const getById: RequestHandler = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const contenedor = await ContenedorRepository.getContenedorByIdRepo(id);
        res.status(200).json({ contenedor });
    } catch (e) {
        next(e);
    }
};

/**
 * Crear un contenedor (admin)
 */
export const createContenedor: RequestHandler = async (req, res, next) => {
    try {
        const data: Contenedor = req.body;

        if (!data.direccion || !data.lat || !data.lng || !data.tipo || data.es_publico === undefined)
            throw new BadRequestError("Faltan datos obligatorios");

        const contenedor = await ContenedorRepository.createContenedorRepo(
            data.municipio_id,
            data.direccion,
            data.lat,
            data.lng,
            data.tipo,
            data.es_publico,
            data.estado ?? true
        );
        res.status(201).json({ message: "Contenedor creado", contenedor });
    } catch (e) {
        next(e);
    }
};

/**
 * Actualizar contenedor (admin)
 */
export const updateContenedor: RequestHandler = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const data: Partial<Contenedor> = req.body;

        const contenedor = await ContenedorRepository.updateContenedorRepo(
            id,
            data.direccion!,
            data.lat!,
            data.lng!,
            data.tipo!,
            data.es_publico!,
            data.estado!
        );
        res.status(200).json({ message: "Contenedor actualizado", contenedor });
    } catch (e) {
        next(e);
    }
};

/**
 * Eliminar contenedor (admin)
 */
export const deleteContenedor: RequestHandler = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const deleted = await ContenedorRepository.deleteContenedorRepo(id);
        res.status(200).json({ message: "Contenedor eliminado", deleted });
    } catch (e) {
        next(e);
    }
};

/**
 * Listar contenedores de un municipio (admin), con filtro opcional público/privado
 */
export const getAllByMunicipio: RequestHandler = async (req, res, next) => {
    try {
        const municipio_id = await AuthRepository.getMunicipiosBySlug(req.params.municipio_slug);
        if (!municipio_id)
            throw new NotFoundError("Municipio no encontrado");

        const es_publico = req.query.publico === "true" ? true : req.query.publico === "false" ? false : undefined;

        const contenedores = es_publico !== undefined
            ? await ContenedorRepository.getContenedoresFiltradosRepo(municipio_id, es_publico)
            : await ContenedorRepository.getContenedoresByMunicipioRepo(municipio_id);

        res.status(200).json({ contenedores });
    } catch (e) {
        next(e);
    }
};

/**
 * Cambiar estado activo/inactivo
 */
export const toggleEstado: RequestHandler = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const contenedor = await ContenedorRepository.toggleEstadoRepo(id);
        res.status(200).json({ message: "Estado actualizado", contenedor });
    } catch (e) {
        next(e);
    }
};

/**
 * Filtrar por tipo dentro de un municipio
 */
export const getByTipo: RequestHandler = async (req, res, next) => {
    try {
        const municipio_id = parseInt(req.params.municipio_id);
        const tipo = req.params.tipo as "small" | "medium" | "big";
        const contenedores = await ContenedorRepository.getContenedoresByTipoRepo(municipio_id, tipo);
        res.status(200).json({ contenedores });
    } catch (e) {
        next(e);
    }
};

/**
 * Obtener contenedores asociados a un servicio específico
 */
export const getByServicioId: RequestHandler = async (req, res, next) => {
    try {
        const servicio_id = parseInt(req.params.servicio_id);
        const contenedores = await ContenedorRepository.getContenedoresByServicioIdRepo(servicio_id);
        res.status(200).json({ contenedores });
    } catch (e) {
        next(e);
    }
};

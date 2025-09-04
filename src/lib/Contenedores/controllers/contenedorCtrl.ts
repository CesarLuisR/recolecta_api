import { RequestHandler } from "express";
import { BadRequestError, NotFoundError } from "../../../utils/error";
import { ContenedorRepository } from "../repositories/contenedorRepository";

export const getPublicByMunicipioCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { municipio_slug } = req.params;
        if (!municipio_slug) throw new BadRequestError("Municipio requerido");

        const contenedores = await ContenedorRepository.getPublicByMunicipio(municipio_slug);
        res.status(200).json({ contenedores });
    } catch (error) {
        next(error);
    }
};

export const getByIdCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) throw new BadRequestError("ID requerido");

        const contenedor = await ContenedorRepository.findById(Number(id));
        if (!contenedor) throw new NotFoundError("Contenedor no encontrado");

        res.status(200).json({ contenedor });
    } catch (error) {
        next(error);
    }
};

export const createContenedorCtrl: RequestHandler = async (req, res, next) => {
    try {
        const data = req.body;
        if (!data.codigo || !data.lat || !data.lng || !data.municipio_id) {
            throw new BadRequestError("Datos incompletos");
        }

        const contenedor = await ContenedorRepository.create(data);
        res.status(201).json({ message: "Contenedor creado exitosamente", contenedor });
    } catch (error) {
        next(error);
    }
};

export const updateContenedorCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const contenedor = await ContenedorRepository.update(Number(id), data);
        if (!contenedor) throw new NotFoundError("Contenedor no encontrado");

        res.status(200).json({ message: "Contenedor actualizado", contenedor });
    } catch (error) {
        next(error);
    }
};

export const deleteContenedorCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleted = await ContenedorRepository.delete(Number(id));
        if (!deleted) throw new NotFoundError("Contenedor no encontrado");

        res.status(200).json({ message: "Contenedor eliminado exitosamente" });
    } catch (error) {
        next(error);
    }
};

export const toggleEstadoCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        const contenedor = await ContenedorRepository.toggleEstado(Number(id));
        if (!contenedor) throw new NotFoundError("Contenedor no encontrado");

        res.status(200).json({ message: "Estado actualizado", contenedor });
    } catch (error) {
        next(error);
    }
};

export const toggleVisibilidadCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        const contenedor = await ContenedorRepository.toggleVisibilidad(Number(id));
        if (!contenedor) throw new NotFoundError("Contenedor no encontrado");

        res.status(200).json({ message: "Visibilidad actualizada", contenedor });
    } catch (error) {
        next(error);
    }
};

/**
 * Filtros avanzados dentro de un municipio
 * Ejemplo: GET /contenedores/municipio/santo-domingo/filter?tipo=small&estado=true
 */
export const filterByMunicipioCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { municipio_slug } = req.params;
        const filtros = req.query;

        const contenedores = await ContenedorRepository.filterByMunicipio(municipio_slug, filtros);
        res.status(200).json({ contenedores });
    } catch (error) {
        next(error);
    }
};

/**
 * Obtener contenedores asociados a un servicio
 */
export const getByServicioIdCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { servicio_id } = req.params;

        const contenedores = await ContenedorRepository.getByServicioId(Number(servicio_id));
        res.status(200).json({ contenedores });
    } catch (error) {
        next(error);
    }
};

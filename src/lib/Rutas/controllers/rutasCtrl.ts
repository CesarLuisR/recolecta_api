import { RequestHandler } from "express";
import { BadRequestError, NotFoundError } from "../../../utils/error";
import { RutaRepository } from "../repositories/rutasRepository";
import { createRutaDataValidator, CreateRutaWithParadaI, createRutaWithParadasService } from "../services/rutasService";

export const getPublicByMunicipioCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { municipio_slug } = req.params;
        if (!municipio_slug) throw new BadRequestError("Municipio requerido");

        const rutas = await RutaRepository.getPublicByMunicipio(municipio_slug);
        res.status(200).json({ rutas });
    } catch (error) {
        next(error);
    }
};

export const getByIdCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) throw new BadRequestError("ID requerido");

        const ruta = await RutaRepository.findById(Number(id));
        if (!ruta) throw new NotFoundError("Ruta no encontrada");

        res.status(200).json({ ruta });
    } catch (error) {
        next(error);
    }
};

export const createRutaCtrl: RequestHandler = async (req, res, next) => {
    try {
        const data: CreateRutaWithParadaI = req.body;

        createRutaDataValidator(data);
        await createRutaWithParadasService(data);
        res.status(201).json({ message: "Ruta creada exitosamente", /*ruta*/ });
    } catch (error) {
        next(error);
    }
};

export const updateRutaCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const ruta = await RutaRepository.update(Number(id), data);
        if (!ruta) throw new NotFoundError("Ruta no encontrada");

        res.status(200).json({ message: "Ruta actualizada", ruta });
    } catch (error) {
        next(error);
    }
};

export const deleteRutaCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleted = await RutaRepository.delete(Number(id));
        if (!deleted) throw new NotFoundError("Ruta no encontrada");

        res.status(200).json({ message: "Ruta eliminada exitosamente" });
    } catch (error) {
        next(error);
    }
};

export const toggleEstadoCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        const ruta = await RutaRepository.toggleEstado(Number(id));
        if (!ruta) throw new NotFoundError("Ruta no encontrada");

        res.status(200).json({ message: "Estado de ruta actualizado", ruta });
    } catch (error) {
        next(error);
    }
};

export const toggleVisibilidadCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        const ruta = await RutaRepository.toggleVisibilidad(Number(id));
        if (!ruta) throw new NotFoundError("Ruta no encontrada");

        res.status(200).json({ message: "Visibilidad de ruta actualizada", ruta });
    } catch (error) {
        next(error);
    }
};

//   Ejemplo: GET /rutas/municipio/santo-domingo/filter?activa=true
export const filterByMunicipioCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { municipio_slug } = req.params;
        const filtros = req.query;

        const rutas = await RutaRepository.filterByMunicipio(municipio_slug, filtros);
        res.status(200).json({ rutas });
    } catch (error) {
        next(error);
    }
};

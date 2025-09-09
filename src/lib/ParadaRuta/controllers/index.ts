import { RequestHandler } from "express";
import { BadRequestError, NotFoundError } from "../../../utils/error";
import { RutaParadaRepository } from "../repositories";

export const getAllCtrl: RequestHandler = async (req, res, next) => {
    try {
        const paradas = await RutaParadaRepository.getAll();
        res.status(200).json({ paradas });
    } catch (error) {
        next(error);
    }
};

export const getByIdCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) throw new BadRequestError("ID requerido");

        const parada = await RutaParadaRepository.findById(Number(id));
        if (!parada) throw new NotFoundError("Parada no encontrada");

        res.status(200).json({ parada });
    } catch (error) {
        next(error);
    }
};

export const createCtrl: RequestHandler = async (req, res, next) => {
    try {
        const data = req.body;
        if (!data.ruta_id || !data.tipo_parada || !data.orden) {
            throw new BadRequestError("Datos incompletos");
        }

        const parada = await RutaParadaRepository.create(data);
        res.status(201).json({ message: "Parada creada exitosamente", parada });
    } catch (error) {
        next(error);
    }
};

export const updateCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const parada = await RutaParadaRepository.update(Number(id), data);
        if (!parada) throw new NotFoundError("Parada no encontrada");

        res.status(200).json({ message: "Parada actualizada", parada });
    } catch (error) {
        next(error);
    }
};

export const deleteCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleted = await RutaParadaRepository.delete(Number(id));
        if (!deleted) throw new NotFoundError("Parada no encontrada");

        res.status(200).json({ message: "Parada eliminada exitosamente" });
    } catch (error) {
        next(error);
    }
};

export const getByRutaCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { ruta_id } = req.params;
        if (!ruta_id) throw new BadRequestError("Ruta requerida");

        const paradas = await RutaParadaRepository.getByRuta(Number(ruta_id));
        res.status(200).json({ paradas });
    } catch (error) {
        next(error);
    }
};

export const getByRutaAndTipoCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { ruta_id, tipo_parada } = req.params;
        if (!ruta_id || !tipo_parada) {
            throw new BadRequestError("Ruta y tipo de parada requeridos");
        }

        const paradas = await RutaParadaRepository.getByRutaAndTipo(
            Number(ruta_id),
            tipo_parada
        );
        res.status(200).json({ paradas });
    } catch (error) {
        next(error);
    }
};

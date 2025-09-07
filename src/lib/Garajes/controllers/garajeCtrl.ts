import { RequestHandler } from "express";
import { BadRequestError, NotFoundError } from "../../../utils/error";
import { GarajeRepository } from "../repositories/garajeRepository";
import { getMunicipioBySlug } from "../../Municipios/repositories/municipioRepository";

// TODO: todo esto de los garajes tiene deuda tecnica.

export const getAllCtrl: RequestHandler = async (req, res, next) => {
    try {
        const garajes = await GarajeRepository.getAll();
        res.status(200).json({ garajes });
    } catch (error) {
        next(error);
    }
};

export const getByIdCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) throw new BadRequestError("ID requerido");

        const garaje = await GarajeRepository.findById(Number(id));
        if (!garaje) throw new NotFoundError("Garaje no encontrado");

        res.status(200).json({ garaje });
    } catch (error) {
        next(error);
    }
};

export const createCtrl: RequestHandler = async (req, res, next) => {
    try {
        const data = req.body;
        if (!data.nombre || !data.lat || !data.lng || !data.municipio_id) {
            throw new BadRequestError("Datos incompletos");
        }

        const garaje = await GarajeRepository.create(data);
        res.status(201).json({ message: "Garaje creado exitosamente", garaje });
    } catch (error) {
        next(error);
    }
};

export const updateCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const garaje = await GarajeRepository.update(Number(id), data);
        if (!garaje) throw new NotFoundError("Garaje no encontrado");

        res.status(200).json({ message: "Garaje actualizado", garaje });
    } catch (error) {
        next(error);
    }
};

export const deleteCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleted = await GarajeRepository.delete(Number(id));
        if (!deleted) throw new NotFoundError("Garaje no encontrado");

        res.status(200).json({ message: "Garaje eliminado exitosamente" });
    } catch (error) {
        next(error);
    }
};

export const getByMunicipioCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { municipio_slug } = req.params;
        if (!municipio_slug) throw new BadRequestError("Municipio requerido");

        const municipio = await getMunicipioBySlug(municipio_slug);
        if (!municipio) throw new NotFoundError("Municipio no encontrado");

        const garajes = await GarajeRepository.getByMunicipio(Number(municipio.id));
        res.status(200).json({ garajes });
    } catch (error) {
        next(error);
    }
};

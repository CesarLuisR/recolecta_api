import { pool } from "../../../database";
import { Ruta } from "../../../types/Ruta";
import { BadRequestError } from "../../../utils/error";
import { RutaParadaRepository } from "../../ParadaRuta/repositories";
import { RutaRepository } from "../repositories/rutasRepository";

export interface CreateRutaData {
    codigo: string;
    nombre: string;
    es_publica: boolean;
    activa: boolean;
    ruta_ors: any;
    garaje_id: number;
    municipio_id: number;
}

export interface CreateParadaData {
    ruta_id: number;
    tipo_parada: string;
    lat?: number;
    lng?: number;
    contenedor_id?: number;
    servicio_id?: number;
    garaje_id?: number;
    orden: number;
    tiempo_estimado?: any;
    distancia_desde_inicio?: number;
}

export interface CreateRutaWithParadaI {
    rutaData: CreateRutaData;
    paradaList: CreateParadaData[];
}

export const createRutaDataValidator = (data: CreateRutaWithParadaI) => {
    if (!data?.rutaData) {
        throw new BadRequestError("Faltan los datos de la ruta (rutaData).");
    }

    const { codigo, nombre, municipio_id, garaje_id, ruta_ors } = data.rutaData;

    if (!codigo?.trim()) throw new BadRequestError("El código de la ruta es requerido.");
    if (!nombre?.trim()) throw new BadRequestError("El nombre de la ruta es requerido.");
    if (!municipio_id || isNaN(Number(municipio_id))) {
        throw new BadRequestError("El municipio_id debe ser un número válido.");
    }
    if (!garaje_id || isNaN(Number(garaje_id))) {
        throw new BadRequestError("El garaje_id debe ser un número válido.");
    }
    if (!ruta_ors) throw new BadRequestError("Se requiere la geometría de la ruta (ruta_ors).");

    // --- Validaciones de paradas ---
    if (!Array.isArray(data.paradaList) || data.paradaList.length === 0) {
        throw new BadRequestError("Se requiere al menos una parada en la lista (paradaList).");
    }

    data.paradaList.forEach((p, index) => {
        if (!p.tipo_parada) {
            throw new BadRequestError(`La parada en posición ${index} no tiene tipo_parada.`);
        }

        switch (p.tipo_parada) {
            case "contenedor":
                if (!p.contenedor_id) {
                    throw new BadRequestError(`La parada #${index} es contenedor y requiere contenedor_id.`);
                }
                break;
            case "servicio":
                if (!p.servicio_id) {
                    throw new BadRequestError(`La parada #${index} es servicio y requiere servicio_id.`);
                }
                break;
            case "garaje":
                if (!p.garaje_id) {
                    throw new BadRequestError(`La parada #${index} es garaje y requiere garaje_id.`);
                }
                break;
            case "guia":
                if (p.lat == null || p.lng == null) {
                    throw new BadRequestError(`La parada #${index} es guía y requiere lat/lng.`);
                }
                break;
            default:
                throw new BadRequestError(`El tipo_parada '${p.tipo_parada}' en la parada #${index} no es válido.`);
        }
    });
}

export const createRutaWithParadasService = async (data: CreateRutaWithParadaI) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const ruta: Ruta = await RutaRepository.create(data.rutaData, client);

        let count = 1;
        for (const parada of data.paradaList) {
            parada.ruta_id = ruta.id;
            parada.orden = count++;
            await RutaParadaRepository.create(parada, client);
        }

        await client.query("COMMIT");
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
}

export const updateRutaWithParadasService = async (data: CreateRutaWithParadaI, id: number) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const ruta: Ruta | null = await RutaRepository.update(id, data.rutaData, client);

        if (!ruta)
            throw new Error();

        await RutaParadaRepository.deleteByRutaId(ruta.id);

        let count = 1;
        for (const parada of data.paradaList) {
            parada.ruta_id = ruta.id;
            parada.orden = count++;
            await RutaParadaRepository.create(parada, client);
        }

        await client.query("COMMIT");
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
}
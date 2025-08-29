import { pool } from "../../database";
import * as contenedorQueries from "./model";
import { Contenedor } from "../../types/contenedor";
import { NotFoundError } from "../../utils/error";

export const createContenedorRepo = async (
    municipio_id: number,
    direccion: string,
    lat: number,
    lng: number,
    tipo: "small" | "medium" | "big",
    es_publico: boolean,
    estado: boolean
): Promise<Contenedor> => {
    const { rows } = await pool.query(contenedorQueries.createContenedor, [
        municipio_id, direccion, lat, lng, tipo, es_publico, estado
    ]);

    if (rows.length === 0) throw new Error("No se pudo crear el contenedor");
    return rows[0];
};

export const getContenedorByIdRepo = async (id: number): Promise<Contenedor> => {
    const { rows } = await pool.query(contenedorQueries.getContenedorById, [id]);
    if (rows.length === 0) throw new NotFoundError("Contenedor no encontrado");
    return rows[0];
};

export const getContenedoresByMunicipioRepo = async (municipio_id: number): Promise<Contenedor[]> => {
    const { rows } = await pool.query(contenedorQueries.getContenedoresByMunicipio, [municipio_id]);
    return rows;
};

export const updateContenedorRepo = async (
    id: number,
    direccion: string,
    lat: number,
    lng: number,
    tipo: "small" | "medium" | "big",
    es_publico: boolean,
    estado: boolean
): Promise<Contenedor> => {
    const { rows } = await pool.query(contenedorQueries.updateContenedor, [
        id, direccion, lat, lng, tipo, es_publico, estado
    ]);

    if (rows.length === 0) throw new NotFoundError("Contenedor no encontrado para actualizar");
    return rows[0];
};

export const deleteContenedorRepo = async (id: number): Promise<Contenedor> => {
    const { rows } = await pool.query(contenedorQueries.deleteContenedor, [id]);
    if (rows.length === 0) throw new NotFoundError("Contenedor no encontrado para eliminar");
    return rows[0];
};

export const getContenedoresFiltradosRepo = async (municipio_id: number, es_publico: boolean): Promise<Contenedor[]> => {
    const { rows } = await pool.query(contenedorQueries.getContenedoresFiltrados, [municipio_id, es_publico]);
    return rows;
};

// Cambiar estado activo/inactivo
export const toggleEstadoRepo = async (id: number): Promise<Contenedor> => {
    const { rows } = await pool.query(contenedorQueries.toggleContenedorEstado, [id]);
    if (rows.length === 0) throw new NotFoundError("Contenedor no encontrado para cambiar estado");
    return rows[0];
};

// Filtrar por tipo dentro de un municipio
export const getContenedoresByTipoRepo = async (
    municipio_id: number,
    tipo: "small" | "medium" | "big"
): Promise<Contenedor[]> => {
    const { rows } = await pool.query(contenedorQueries.getContenedoresByTipo, [municipio_id, tipo]);
    return rows;
};

// Obtener contenedores asociados a un servicio específico
export const getContenedoresByServicioIdRepo = async (servicio_id: number): Promise<Contenedor[]> => {
    const { rows } = await pool.query(contenedorQueries.getContenedoresByServicioId, [servicio_id]);
    return rows;
};

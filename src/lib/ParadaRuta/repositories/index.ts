import { PoolClient } from "pg";
import { pool } from "../../../database"; 
import { RutaParada } from "../../../types/RutaParada";
import { CreateParadaData } from "../../Rutas/services/rutasService";

export class RutaParadaRepository {
    static async getAll() {
        const { rows } = await pool.query("SELECT * FROM ruta_parada ORDER BY id ASC");
        return rows as RutaParada[];
    }

    static async findById(id: number) {
        const { rows } = await pool.query("SELECT * FROM ruta_parada WHERE id = $1", [id]);
        return rows[0] as RutaParada || null;
    }

    // TODO: Esto es necesario que devuelva la rutaParada????
    static async create(data: CreateParadaData, client?: PoolClient): Promise<RutaParada> {
        const {
            ruta_id,
            tipo_parada,
            contenedor_id,
            servicio_id,
            garaje_id,
            lat,
            lng,
            orden,
            tiempo_estimado,
            distancia_desde_inicio,
        }: CreateParadaData = data;

        const q = client || pool;

        const { rows } = await q.query(
            `INSERT INTO ruta_parada 
            (ruta_id, tipo_parada, contenedor_id, servicio_id, garaje_id, lat, lng, orden, tiempo_estimado, distancia_desde_inicio)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            RETURNING *`,
            [
                ruta_id,
                tipo_parada,
                contenedor_id || null,
                servicio_id || null,
                garaje_id || null,
                lat || null,
                lng || null,
                orden,
                tiempo_estimado || null,
                distancia_desde_inicio || null,
            ]
        );

        return rows[0] as RutaParada;
    }

    static async update(id: number, data: RutaParada): Promise<RutaParada> {
        const {
            ruta_id,
            tipo_parada,
            contenedor_id,
            servicio_id,
            garaje_id,
            lat,
            lng,
            orden,
            tiempo_estimado,
            distancia_desde_inicio,
        }: RutaParada = data;

        const { rows } = await pool.query(
            `UPDATE ruta_parada SET 
                ruta_id = COALESCE($1, ruta_id),
                tipo_parada = COALESCE($2, tipo_parada),
                contenedor_id = $3,
                servicio_id = $4,
                garaje_id = $5,
                lat = $6,
                lng = $7,
                orden = COALESCE($8, orden),
                tiempo_estimado = $9,
                distancia_desde_inicio = $10
            WHERE id = $11
            RETURNING *`,
            [
                ruta_id || null,
                tipo_parada || null,
                contenedor_id || null,
                servicio_id || null,
                garaje_id || null,
                lat || null,
                lng || null,
                orden || null,
                tiempo_estimado || null,
                distancia_desde_inicio || null,
                id,
            ]
        );

        return rows[0] as RutaParada || null;
    }

    static async delete(id: number) {
        const { rowCount } = await pool.query("DELETE FROM ruta_parada WHERE id = $1", [id]);

        if (rowCount) return rowCount > 0;
    }

    static async deleteByRutaId(rutaId: number, client?: PoolClient) {
        const q = client || pool;
        const { rowCount } = await q.query("DELETE FROM ruta_parada WHERE ruta_id = $1", [rutaId]);
        if (rowCount) return rowCount > 0;
    }

    static async getByRuta(rutaId: number) {
        const { rows } = await pool.query(
            "SELECT * FROM ruta_parada WHERE ruta_id = $1 ORDER BY orden ASC",
            [rutaId]
        );
        return rows as RutaParada[];
    }

    static async getByRutaAndTipo(rutaId: number, tipo: string) {
        const { rows } = await pool.query(
            "SELECT * FROM ruta_parada WHERE ruta_id = $1 AND tipo_parada = $2 ORDER BY orden ASC",
            [rutaId, tipo]
        );
        return rows as RutaParada[];
    }
}

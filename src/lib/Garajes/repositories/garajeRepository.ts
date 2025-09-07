import { pool } from "../../../database";

export interface GarajeData {
    nombre: string;
    direccion?: string;
    lat: number;
    lng: number;
    municipio_id: number;
}

export class GarajeRepository {
    static async getAll() {
        const { rows } = await pool.query("SELECT * FROM Garajes ORDER BY id ASC");
        return rows;
    }

    static async findById(id: number) {
        const { rows } = await pool.query("SELECT * FROM Garajes WHERE id = $1", [id]);
        return rows[0] || null;
    }

    static async create(data: GarajeData) {
        const { nombre, direccion, lat, lng, municipio_id } = data;
        const { rows } = await pool.query(
            `INSERT INTO Garajes (nombre, direccion, lat, lng, municipio_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [nombre, direccion || null, lat, lng, municipio_id]
        );
        return rows[0];
    }

    static async update(id: number, data: Partial<GarajeData>) {
        const existing = await this.findById(id);
        if (!existing) return null;

        const nombre = data.nombre ?? existing.nombre;
        const direccion = data.direccion ?? existing.direccion;
        const lat = data.lat ?? existing.lat;
        const lng = data.lng ?? existing.lng;
        const municipio_id = data.municipio_id ?? existing.municipio_id;

        const { rows } = await pool.query(
            `UPDATE Garajes
       SET nombre = $1, direccion = $2, lat = $3, lng = $4, municipio_id = $5
       WHERE id = $6
       RETURNING *`,
            [nombre, direccion, lat, lng, municipio_id, id]
        );

        return rows[0];
    }

    static async delete(id: number) {
        const { rowCount } = await pool.query("DELETE FROM Garajes WHERE id = $1", [id]);

        if (rowCount) return rowCount > 0;
    }

    static async getByMunicipio(municipio_id: number) {
        const { rows } = await pool.query(
            "SELECT * FROM Garajes WHERE municipio_id = $1 ORDER BY id ASC",
            [municipio_id]
        );
        return rows;
    }
}

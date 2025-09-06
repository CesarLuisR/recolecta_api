import { pool } from "../../../database"; // conexión a PostgreSQL

export const RutaRepository = {
    async getPublicByMunicipio(municipio_slug: string) {
        const query = `
            SELECT 
                r.id, r.codigo, r.nombre, r.es_publica, r.activa,
                r.ruta_ors, r.garaje_id, r.municipio_id
            FROM Rutas r
            JOIN Municipios m ON r.municipio_id = m.id
            WHERE m.slug = $1 AND r.es_publica = TRUE
        `;
        const { rows } = await pool.query(query, [municipio_slug]);
        return rows;
    },

    async findById(id: number) {
        const { rows } = await pool.query(`SELECT * FROM Rutas WHERE id = $1`, [id]);
        return rows[0] || null;
    },

    async create(data: any) {
        const { codigo, nombre, es_publica = false, activa = true, ruta_osrm, garaje_id, municipio_id } = data;

        const query = `
            INSERT INTO Rutas (codigo, nombre, es_publica, activa, ruta_ors, garaje_id, municipio_id)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *
        `;
        const values = [codigo, nombre, es_publica, activa, ruta_osrm || null, garaje_id || null, municipio_id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    async update(id: number, data: any) {
        const fields = Object.keys(data);
        const values = Object.values(data);

        if (fields.length === 0) return null;

        const setQuery = fields.map((field, i) => `${field} = $${i + 1}`).join(", ");
        const query = `UPDATE Rutas SET ${setQuery} WHERE id = $${fields.length + 1} RETURNING *`;

        const { rows } = await pool.query(query, [...values, id]);
        return rows[0] || null;
    },

    async delete(id: number) {
        const data = await pool.query(`DELETE FROM Rutas WHERE id = $1`, [id]);
        if (!data.rowCount) return false;

        return data.rowCount > 0;
    },

    async toggleEstado(id: number) {
        const query = `
            UPDATE Rutas
            SET activa = NOT activa
            WHERE id = $1
            RETURNING *
        `;
        const { rows } = await pool.query(query, [id]);
        return rows[0] || null;
    },

    async toggleVisibilidad(id: number) {
        const query = `
            UPDATE Rutas
            SET es_publica = NOT es_publica
            WHERE id = $1
            RETURNING *
        `;
        const { rows } = await pool.query(query, [id]);
        return rows[0] || null;
    },

    async filterByMunicipio(municipio_slug: string, filtros: any) {
        let query = `
            SELECT r.* 
            FROM Rutas r
            JOIN Municipios m ON r.municipio_id = m.id
            WHERE m.slug = $1
        `;
        const values: any[] = [municipio_slug];
        let i = 2;

        if (filtros.activa !== undefined) {
            query += ` AND r.activa = $${i++}`;
            values.push(filtros.activa === "true");
        }
        if (filtros.es_publica !== undefined) {
            query += ` AND r.es_publica = $${i++}`;
            values.push(filtros.es_publica === "true");
        }
        if (filtros.garaje_id) {
            query += ` AND r.garaje_id = $${i++}`;
            values.push(Number(filtros.garaje_id));
        }

        const { rows } = await pool.query(query, values);
        return rows;
    }
};

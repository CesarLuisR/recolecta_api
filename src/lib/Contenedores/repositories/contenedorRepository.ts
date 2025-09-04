import { pool }from "../../../database"; // Tu conexión a PostgreSQL

export const ContenedorRepository = {
    async getPublicByMunicipio(municipio_slug: string) {
        const query = `
            SELECT 
                c.id, c.codigo, c.lat, c.lng,
                c.ubicacion, c.estado, c.visibilidad, 
                c.capacidad, c.ultima_recoleccion,
                c.proxima_recoleccion, c.municipio_id
            FROM Contenedores c
            JOIN Municipios m ON c.municipio_id = m.id
            WHERE m.slug = $1 AND c.visibilidad = TRUE
        `;
        const { rows } = await pool.query(query, [municipio_slug]);
        return rows;
    },

    async findById(id: number) {
        const { rows } = await pool.query(`SELECT * FROM Contenedores WHERE id = $1`, [id]);
        return rows[0] || null;
    },

    async create(data: any) {
        const { codigo, lat, lng, ubicacion, estado = true, visibilidad = true, capacidad, ultima_recoleccion, proxima_recoleccion, municipio_id } = data;

        const query = `
            INSERT INTO Contenedores (codigo, lat, lng, ubicacion, estado, visibilidad, capacidad, ultima_recoleccion, proxima_recoleccion, municipio_id)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            RETURNING *
        `;
        const values = [codigo, lat, lng, ubicacion || null, estado, visibilidad, capacidad || null, ultima_recoleccion || null, proxima_recoleccion || null, municipio_id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    async update(id: number, data: any) {
        const fields = Object.keys(data);
        const values = Object.values(data);

        if (fields.length === 0) return null;

        const setQuery = fields.map((field, i) => `${field} = $${i + 1}`).join(", ");
        const query = `UPDATE Contenedores SET ${setQuery} WHERE id = $${fields.length + 1} RETURNING *`;

        const { rows } = await pool.query(query, [...values, id]);
        return rows[0] || null;
    },

    async delete(id: number) {
        const data = await pool.query(`DELETE FROM Contenedores WHERE id = $1`, [id]);
        if (!data.rowCount) return false;

        return data.rowCount > 0;
    },

    async toggleEstado(id: number) {
        const query = `
            UPDATE Contenedores
            SET estado = NOT estado
            WHERE id = $1
            RETURNING *
        `;
        const { rows } = await pool.query(query, [id]);
        return rows[0] || null;
    },

    async toggleVisibilidad(id: number) {
        const query = `
            UPDATE Contenedores
            SET visibilidad = NOT visibilidad
            WHERE id = $1
            RETURNING *
        `;
        const { rows } = await pool.query(query, [id]);
        return rows[0] || null;
    },

    async filterByMunicipio(municipio_slug: string, filtros: any) {
        let query = `
            SELECT c.* 
            FROM Contenedores c
            JOIN Municipios m ON c.municipio_id = m.id
            WHERE m.slug = $1
        `;
        const values: any[] = [municipio_slug];
        let i = 2;

        if (filtros.tipo) {
            query += ` AND c.capacidad = $${i++}`;
            values.push(filtros.tipo);
        }
        if (filtros.estado !== undefined) {
            query += ` AND c.estado = $${i++}`;
            values.push(filtros.estado === "true");
        }
        if (filtros.visibilidad !== undefined) {
            query += ` AND c.visibilidad = $${i++}`;
            values.push(filtros.visibilidad === "true");
        }

        const { rows } = await pool.query(query, values);
        return rows;
    },

    async getByServicioId(servicio_id: number) {
        const query = `
            SELECT c.*
            FROM Contenedores c
            JOIN Servicio_Contenedor sc ON c.id = sc.contenedor_id
            WHERE sc.servicio_id = $1
        `;
        const { rows } = await pool.query(query, [servicio_id]);
        return rows;
    }
};

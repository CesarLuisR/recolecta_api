import { Pool } from "pg";
import { pool } from "../../database";
import * as authQueries from "./authModel"
import { NotFoundError } from "../../utils/error";
import { User } from "../../types/Usuario";
import { SignUpData } from "../../lib/Auth/controllers/clienteCtrl";

// CONTEXT: Designed this way thinking in a future hexagonal arch

export default class AuthRepository {
    public client: Pool;
    constructor() {
        this.client = pool;
    }

    static async getMunicipiosBySlug(slug: string): Promise<number | null> {
        const data = await pool.query(authQueries.getMunicipioBySlug, [slug]);

        if (data.rowCount === 0)
            return null;

        return data.rows[0].id;
    }

    static async createUser(data: SignUpData, password_hash: string, municipio_id: number): Promise<User | null> {
        const raw = await pool.query(
            authQueries.createCliente,
            [
                data.nombre, data.apellido, data.correo, password_hash, municipio_id,
                data.tipo, data.identificador, data.tipo_identificador
            ]
        );

        if (raw.rowCount === 0)
            return null;

        return raw.rows[0];
    }


    static async setUserStatus(id: number): Promise<User | null> {
        const data = await pool.query(authQueries.setClienteStatus, [id]);

        if (data.rowCount === 0) return null;

        const user: User = data.rows[0];
        return user;
    }

    static async getUserSession(id: number): Promise<string | null> {
        const data = await pool.query(
            authQueries.getUserSession,
            [id]
        );

        if (data.rowCount === 0) return null;

        return data.rows[0].session_id;
    }
}

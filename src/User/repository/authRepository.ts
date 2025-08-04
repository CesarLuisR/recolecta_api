import { Pool } from "pg";
import { pool } from "../../database";
import * as authQueries from "./authModel"
import { NotFoundError } from "../../utils/error";
import { SignUpData } from "../../types/auth";
import { User } from "../../types/user";

// CONTEXT: Designed this way thinking in a future hexagonal arch

export default class AuthRepository {
    public client: Pool;
    constructor() {
        this.client = pool;
    }

    static async getMunicipiosBySlug(slug: string): Promise<number> {
        const data = await pool.query(authQueries.getMunicipioBySlug, [slug]);

        if (data.rowCount === 0)
            throw new NotFoundError("Municipio not found");

        return data.rows[0].id;
    }

    static async createUser(data: SignUpData, municipio_id: string) {
        const raw = await pool.query(
            authQueries.createUser,
            [data.nombre, data.apellido, data.cedula, data.email, "cliente", municipio_id]
        );

        if (raw.rowCount === 0) 
            throw new Error();

        return raw.rows[0];
    }


    static async setUserStatus(id: number): Promise<User> {
        const data = await pool.query(authQueries.setUserStatus, [id]);

        if (data.rowCount === 0)
            throw new NotFoundError();

        const user: User = data.rows[0];
        return user;
    }

    static async getUserSession(id: number): Promise<string> {
        const data = await pool.query(
            authQueries.getUserSession,
            [id]
        );

        if (data.rowCount === 0)
            throw new NotFoundError("Este usuario esta creado y no necesita verificacion");

        return data.rows[0].session_id;
    }
}
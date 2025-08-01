import { Pool } from "pg";
import { pool } from "../../database";
import * as userQueries from "./userModel";
import { User } from "../../types/user";
import { NotFoundError } from "../../utils/error";

export default class UserRepository {
    public client: Pool;
    constructor() {
        this.client = pool;
    }

    static async getUserByEmail(email: string): Promise<User | null> {
        try {
            const data = await pool.query(
                userQueries.getUserByEmail,
                [email]
            );

            if (data.rowCount === 0)
                return null;

            const user: User = data.rows[0];
            return user;
        } catch(e) {
            throw e;
        }
    }

    static async getUserById(id: number): Promise<User> {
        try {
            const data = await pool.query(
                userQueries.getUserById,
                [id]
            );

            if (data.rowCount === 0)
                throw new NotFoundError("Usuario no encontrado");

            const user: User = data.rows[0];
            return user;
        } catch(e) {
            throw e;
        }
    }
}
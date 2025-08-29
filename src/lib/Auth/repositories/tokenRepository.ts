import { Pool } from "pg";
import { pool } from "../../../database";
import * as tokenQueries from "./tokenModel";
import { addDays } from "date-fns"; 

// Ya explique el por que del formato en el authModel

export default class TokenRepository {
    client: Pool;
    constructor() {
        this.client = pool;
    }

    static async saveRefreshToken(user_id: number, token: string): Promise<void> {
        // Si, esto se pudo haber hecho directo en el postgres
        const expires_at = addDays(new Date(), 7);
        await pool.query(
            tokenQueries.saveRefreshToken, 
            [user_id, token, expires_at]
        );
    }

    static async isRefreshTokenValid(user_id: number, token: string): Promise<Boolean> {
        const result = await pool.query(
            tokenQueries.getValidToken,
            [user_id, token]
        );

        return result.rows.length > 0;
    }

    static async revokeToken(user_id: number, token: string): Promise<void> {
        await pool.query(
            tokenQueries.revokeToken, 
            [user_id, token]
        );
    }
}
import { Pool } from "pg";
import { pool } from "../../database";
import * as magicLinkQueries from "./magicLinkModel";
import { NotFoundError, UnauthorizedError } from "../../utils/error";

// Ya explique el por que del formato en el authModel
export interface MagicLinkI {
    id: string;
    session_id: string;
    user_id: number;
    expires_at: Date;
    used: boolean;
    created_at: Date;
}

export default class MagicLinkRepository {
    client: Pool;
    constructor() {
        this.client = pool;
    }

    static async create(user_id: number): Promise<MagicLinkI | null> {
        const raw = await pool.query(
            magicLinkQueries.save,
            [user_id]
        );

        if (raw.rowCount == 0) 
            return null;

        const data: MagicLinkI = raw.rows[0];
        return data;
    };

    static async getNotExpired(id: string): Promise<MagicLinkI | null> {
        const raw = await pool.query(
            magicLinkQueries.getNotExpired,
            [id]
        );

        if (raw.rowCount === 0)
            return null;

        return raw.rows[0];
    }

    static async getUsedLink(id: string): Promise<boolean>{
        const raw = await pool.query(
            magicLinkQueries.getUsedLink,
            [id]
        );

        if (raw.rowCount == 0) 
            return false;

        return true;
    }

    static async isUsedLink(id: string): Promise<boolean> {
        const raw = await pool.query(
            magicLinkQueries.isUsed,
            [id]
        );

        if (raw.rowCount !== 0)
            return true;

        return false;
    }

    static async isSessionValid(id: string, token: string): Promise<boolean> {
        const raw = await pool.query(
            magicLinkQueries.verifySession,
            [id, token]
        );

        if (raw.rowCount === 0)
            return false;

        return true;
    }

    static async setUsed(id: string) {
        await pool.query(
            magicLinkQueries.makeItUsed,
            [id]
        );
    }
}
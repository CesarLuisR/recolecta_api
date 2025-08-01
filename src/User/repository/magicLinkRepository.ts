import { Pool } from "pg";
import { pool } from "../../database";
import * as magicLinkQueries from "./magicLinkModel";
import { NotFoundError, UnauthorizedError } from "../../utils/error";

// Ya explique el por que del formato en el authModel
export interface MagicLinkI {
    id: string;
    session_id: string;
}

export default class MagicLinkRepository {
    client: Pool;
    constructor() {
        this.client = pool;
    }

    static async create(user_id: number): Promise<MagicLinkI> {
        const raw = await pool.query(
            magicLinkQueries.save,
            [user_id]
        );

        if (raw.rowCount == 0) 
            throw new NotFoundError();

        const data: MagicLinkI = raw.rows[0];
        return data;
    };

    static async getValid(id: string, token: string) {
        console.log("LOS SKJDFLK: ", id, token);
        const raw = await pool.query(
            magicLinkQueries.getValid,
            [id, token]
        );

        if (raw.rowCount == 0) 
            throw new UnauthorizedError();

        return raw.rows[0];
    }

    static async getUsedLink(id: string) {
        const raw = await pool.query(
            magicLinkQueries.getUsedLink,
            [id]
        );

        if (raw.rowCount == 0) 
            throw new UnauthorizedError();
    }

    static async setUsed(id: string) {
        await pool.query(
            magicLinkQueries.makeItUsed,
            [id]
        );
    }
}
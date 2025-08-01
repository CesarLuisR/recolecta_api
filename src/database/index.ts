import { Pool } from "pg";
import config from "../config";

const connectionString = 
    process.env.DB_CONNECTION || 
    `postgresql://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`;

export const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});
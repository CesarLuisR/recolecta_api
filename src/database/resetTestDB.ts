import { pool } from ".";

// Por ahora solo usuarios.
export default async function resetTestDB() {
    await pool.query(`
    TRUNCATE TABLE 
      usuarios
    RESTART IDENTITY CASCADE
  `);
}

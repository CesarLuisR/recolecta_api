import { pool } from ".";

// TODO: Arreglar las consultas aqui
export async function cleanExpiredRefreshTokens() {
    try {
        const query = `
            DELETE FROM refresh_tokens
            WHERE expires_at < NOW();
        `;
        const result = await pool.query(query);
        console.log(`Cleaned ${result.rowCount} expired refresh tokens.`);
    } catch (error) {
        console.error('Error cleaning expired refresh tokens:', error);
    }
}

export async function cleanNotVerifiedUsers() {
    try {
        const query = `
            DELETE FROM usuarios
            WHERE EXISTS (
                SELECT 1
                FROM magic_links
                WHERE magic_links.user_id = usuarios.id
                    AND used = false
                    AND expires_at < NOW()
            );
        `;
        const result = await pool.query(query);
        console.log(`Cleaned ${result.rowCount} expired refresh tokens.`);
    } catch(e) {
        console.error('Error cleaning not verified users:', e);
    }
};

export async function cleanExpiredMagicLinks() {
    try {
        const query = `
            DELETE FROM magic_links
            WHERE expires_at < NOW();
        `;
        const result = await pool.query(query);
        console.log(`Cleaned ${result.rowCount} expired refresh tokens.`);
    } catch(e) {
        console.error('Error cleaning not verified users:', e);
    }
}
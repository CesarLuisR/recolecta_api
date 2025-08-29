export const saveRefreshToken = `
    INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES ($1, $2, $3);
`;

export const getValidToken = `
    SELECT 1 FROM refresh_tokens
    WHERE user_id = $1
        AND token = $2
        AND expires_at > NOW();
`;

export const revokeToken = `
    DELETE FROM refresh_tokens
    WHERE user_id = $1
        AND token = $2;
`;
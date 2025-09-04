export const saveRefreshToken = `
    INSERT INTO refresh_tokens (user_id, token, expira_en)
    VALUES ($1, $2, $3);
`;

export const getValidToken = `
    SELECT 1 FROM refresh_tokens
    WHERE user_id = $1
        AND token = $2
        AND expira_en > NOW();
`;

export const revokeToken = `
    DELETE FROM refresh_tokens
    WHERE user_id = $1
        AND token = $2;
`;
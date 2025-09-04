export const save = `
    INSERT INTO magic_links(user_id, expira_en)
    VALUES ($1, NOW() + INTERVAL '10 minutes')
    RETURNING id, session_id;
`;

export const getNotExpired = `
    SELECT 
        id,
        session_id,
        user_id,
        expira_en,
        used,
        creado_en
    FROM magic_links
    WHERE id = $1
        AND expira_en > NOW()
`;

export const isUsed = `
    SELECT 1 FROM magic_links
    WHERE id = $1 AND used = true
`;

export const verifySession = `
    SELECT 1 FROM magic_links
    WHERE id = $1 AND session_id = $2
`;

export const getUsedLink = `
    SELECT 
        id,
        user_id,
        expira_en,
        used,
        creado_en
    FROM magic_links
    WHERE id = $1
        AND used = true;
`;

export const makeItUsed = `
    UPDATE magic_links
    SET used = true
    WHERE id = $1;
`;
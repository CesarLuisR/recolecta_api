export const getMunicipioBySlug = `
    SELECT id
    FROM municipios
    WHERE slug = $1
`;

export const createUser = `
    INSERT INTO usuarios (
        nombre, 
        apellido, 
        cedula, 
        email,
        tipo_usuario, 
        municipio_id
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING 
        id, tipo_usuario;
`;

export const setUserStatus = `
    UPDATE usuarios
    SET verified = true
    WHERE id = $1
    RETURNING 
        id,
        nombre,
        apellido,
        email,
        cedula,
        password_hash,
        tipo_usuario,
        creado_en,
        municipio_id,
        verified;
`;

export const getUserSession = `
    SELECT session_id
    FROM magic_links
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 1
`;
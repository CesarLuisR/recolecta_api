export const getUserByEmail = `
    SELECT 
        id,
        nombre,
        apellido,
        email,
        cedula,
        password_hash,
        tipo_usuario,
        creado_en,
        municipio_id,
        verified
    FROM usuarios
    WHERE email = $1
`;

export const getUserById = `
    SELECT 
        id,
        nombre,
        apellido,
        email,
        password_hash,
        tipo_usuario,
        creado_en,
        municipio_id,
        verified
    FROM usuarios
    WHERE id = $1
`;

export const getUser = `
    SELECT 
        id,
        nombre,
        apellido,
        email,
        cedula,
        password_hash,
        tipo_usuario,
        creado_en,
        municipio_id,
        verified
    FROM usuarios
    WHERE nombre = $1
        AND apellido = $2
        AND cedula = $3
        AND email = $4
`;
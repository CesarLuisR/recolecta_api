export const getMunicipioBySlug = `
    SELECT id
    FROM Municipios
    WHERE slug = $1
`;

// todo: hacer que devuelva todo???
export const createCliente = `
    BEGIN;
    WITH nuevo_usuario AS (
        INSERT INTO Usuario (nombre, apellido, correo, tipo, password_hash, municipio_id)
        VALUES ($1, $2, $3, 'cliente', $4, $5)
        RETURNING *
    ),
    nuevo_cliente AS (
        INSERT INTO Cliente (usuario_id, tipo_cliente, identificador, tipo_identificador)
        SELECT id, $6, $7, $8 FROM nuevo_usuario
        RETURNING *
    )
    SELECT u.*, c.*
    FROM nuevo_usuario u
    JOIN nuevo_cliente c ON u.id = c.usuario_id;
    COMMIT;
`;

export const setClienteStatus = `
    UPDATE Cliente
    SET Verificado = TRUE
    WHERE Id = $1
    RETURNING 
        Id,
        Nombre,
        Apellido,
        Correo,
        Cedula,
        Contrasena,
        TipoCliente,
        CreadoEn,
        MunicipioId,
        Verificado;
`;

export const getUserSession = `
    SELECT session_id
    FROM magic_links
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 1
`;
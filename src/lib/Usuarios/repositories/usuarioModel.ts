export const getUsuarioByEmailModel = `
    SELECT 
        id, correo, tipo, activo, municipio_id, creado_en
    FROM Usuarios
    WHERE correo = $1
`;

export const getUsuarioWithHashByEmailModel = `
    SELECT 
        id, correo, tipo, activo, municipio_id, creado_en, password_hash
    FROM Usuarios
    WHERE correo = $1
`;

export const getVerifiedUsuarioWithHashByEmailModel = `
    SELECT 
        u.id, u.correo, u.tipo, u.activo, u.municipio_id, u.creado_en, u.password_hash
    FROM Usuarios u
    JOIN Clientes c ON c.usuario_id = u.id
    WHERE u.correo = $1 AND c.verificado = TRUE;
`;

export const getUsuariosModel = `
    SELECT 
        id, correo, tipo, activo, municipio_id, creado_en
    FROM Usuarios
`;

export const getUsuarioByIdModel = `
    SELECT 
        id, correo, tipo, activo, municipio_id, creado_en
    FROM Usuarios
    WHERE id = $1
`;

export const getClienteByUsuarioIdModel = `
    SELECT
        c.id, c.usuario_id, c.telefono, c.direccion, c.verificado,
        u.correo, u.tipo, u.activo, u.municipio_id, u.creado_en
    FROM Clientes c
    JOIN Usuarios u ON c.usuario_id = u.id
    WHERE u.id = $1
`;      

export const getClienteByUsuarioIdAndVerificadoModel = `
    SELECT
        c.id, c.usuario_id, c.telefono, c.direccion, c.verificado,
        u.correo, u.tipo, u.activo, u.municipio_id, u.creado_en
    FROM Clientes c
    JOIN Usuarios u ON c.usuario_id = u.id
    WHERE u.id = $1 AND c.verificado = $2
`;

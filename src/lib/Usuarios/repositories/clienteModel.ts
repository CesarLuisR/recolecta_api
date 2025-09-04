export const createPersonaModel = `
    WITH nuevo_usuario AS (
        INSERT INTO Usuarios(correo, tipo, password_hash, municipio_id)
        VALUES ($1, 'cliente', $2, $3)
        RETURNING *
    ),
    nuevo_cliente AS (
        INSERT INTO Clientes(usuario_id, tipo_cliente, telefono, direccion)
        SELECT id, 'persona', $4, $5 FROM nuevo_usuario
        RETURNING *
    ),
    nueva_persona AS (
        INSERT INTO ClientesPersona(cliente_id, cedula, nombre, apellido, fecha_nacimiento)
        SELECT id, $6, $7, $8, $9 FROM nuevo_cliente
        RETURNING *
    )
    
    SELECT 
        u.id,
        u.correo,
        u.password_hash,
        u.activo,
        u.municipio_id,
        u.creado_en,
        c.telefono,
        c.direccion,
        c.verificado,
        p.cedula,
        p.nombre,
        p.apellido,
        p.fecha_nacimiento
    FROM nuevo_usuario u
    JOIN nuevo_cliente c ON u.id = c.usuario_id
    JOIN nueva_persona p ON c.id = p.cliente_id;
`;

export const createEmpresaModel = `
    WITH nuevo_usuario AS (
        INSERT INTO Usuarios(correo, tipo, password_hash, municipio_id)
        VALUES ($1, 'cliente', $2, $3)
        RETURNING *
    ),
    nuevo_cliente AS (
        INSERT INTO Clientes(usuario_id, tipo_cliente, telefono, direccion)
        SELECT id, 'persona', $4, $5 FROM nuevo_usuario
        RETURNING *
    ),
    nueva_empresa AS (
        INSERT INTO ClientesEmpresa(cliente_id, nombre_empresa, contacto_nombre, tipo_empresa, rnc) 
        SELECT id, $6, $7, $8, $9 FROM nuevo_cliente
        RETURNING *
    )
    
    SELECT 
        u.id,
        u.correo,
        u.password_hash,
        u.activo,
        u.municipio_id,
        u.creado_en,
        c.telefono,
        c.direccion,
        c.verificado,
        e.nombre_empresa,
        e.contacto_nombre,
        e.tipo_empresa,
        e.rnc
    FROM nuevo_usuario u
    JOIN nuevo_cliente c ON u.id = c.usuario_id
    JOIN nueva_empresa e ON c.id = e.cliente_id;
`;

export const setClienteVerificacionModel = `
    WITH cliente_actualizado AS (
        UPDATE Clientes
        SET verificado = TRUE
        WHERE usuario_id = $1
        RETURNING id, usuario_id, telefono, direccion, verificado
    )
    SELECT 
        u.id,
        u.correo,
        u.password_hash,
        u.activo,
        u.municipio_id,
        u.creado_en,
        c.telefono,
        c.direccion,
        c.verificado
    FROM Usuarios u 
    JOIN cliente_actualizado c ON u.id = c.usuario_id;
`;

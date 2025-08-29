export const createContenedor = `
    INSERT INTO Contenedor (
        MunicipioId, 
        Ubicacion, 
        Latitud, 
        Longitud, 
        TipoContenedor, 
        EsPublico, 
        Estado,
        Capacidad,
        RutaId,
        Codigo
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING 
        Id,
        MunicipioId,
        RutaId,
        Codigo,
        TipoContenedor,
        Capacidad,
        Ubicacion,
        Latitud,
        Longitud,
        Estado,
        EsPublico;
`;

export const getContenedorById = `
    SELECT 
        Id,
        MunicipioId,
        RutaId,
        Codigo,
        TipoContenedor,
        Capacidad,
        Ubicacion,
        Latitud,
        Longitud,
        Estado,
        EsPublico
    FROM Contenedor
    WHERE Id = $1;
`;

export const getContenedoresByMunicipio = `
    SELECT 
        Id,
        MunicipioId,
        RutaId,
        Codigo,
        TipoContenedor,
        Capacidad,
        Ubicacion,
        Latitud,
        Longitud,
        Estado,
        EsPublico
    FROM Contenedor
    WHERE MunicipioId = $1;
`;

export const updateContenedor = `
    UPDATE Contenedor
    SET 
        Ubicacion = $2,
        Latitud = $3,
        Longitud = $4,
        TipoContenedor = $5,
        EsPublico = $6,
        Estado = $7,
        Capacidad = $8,
        RutaId = $9,
        Codigo = $10
    WHERE Id = $1
    RETURNING 
        Id,
        MunicipioId,
        RutaId,
        Codigo,
        TipoContenedor,
        Capacidad,
        Ubicacion,
        Latitud,
        Longitud,
        Estado,
        EsPublico;
`;

export const deleteContenedor = `
    DELETE FROM Contenedor
    WHERE Id = $1
    RETURNING 
        Id,
        MunicipioId,
        RutaId,
        Codigo,
        TipoContenedor,
        Capacidad,
        Ubicacion,
        Latitud,
        Longitud,
        Estado,
        EsPublico;
`;

export const getContenedoresFiltrados = `
    SELECT 
        Id,
        MunicipioId,
        RutaId,
        Codigo,
        TipoContenedor,
        Capacidad,
        Ubicacion,
        Latitud,
        Longitud,
        Estado,
        EsPublico
    FROM Contenedor
    WHERE MunicipioId = $1
      AND EsPublico = $2;
`;

export const getContenedoresByTipo = `
    SELECT 
        Id,
        MunicipioId,
        RutaId,
        Codigo,
        TipoContenedor,
        Capacidad,
        Ubicacion,
        Latitud,
        Longitud,
        Estado,
        EsPublico
    FROM Contenedor
    WHERE MunicipioId = $1
      AND TipoContenedor = $2;
`;

export const getContenedoresByServicioId = `
    SELECT 
        c.Id,
        c.MunicipioId,
        c.RutaId,
        c.Codigo,
        c.TipoContenedor,
        c.Capacidad,
        c.Ubicacion,
        c.Latitud,
        c.Longitud,
        c.Estado,
        c.EsPublico
    FROM Contenedor c
    JOIN ParadaRuta p 
      ON p.ContenedorId = c.Id
    WHERE p.ServicioId = $1;
`;

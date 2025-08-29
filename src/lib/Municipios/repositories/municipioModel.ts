export const getMunicipioBySlugModel = `
    SELECT 
        id, nombre, slug, lat, lng, activo
    FROM Municipios
    WHERE slug = $1
`;
import { pool } from "../../../database";
import { Municipio } from "../../../types/Municipio";
import * as municipioQueries from "./municipioModel";

export const getMunicipioBySlug = async (slug: string): Promise<Municipio | null> => {
    const raw = await pool.query(
        municipioQueries.getMunicipioBySlugModel,
        [slug]
    );

    if (raw.rowCount === 0) return null;

    return raw.rows[0];
}
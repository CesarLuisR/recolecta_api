import { pool } from "../../../database"
import { Cliente, Usuario } from "../../../types/Usuario";
import * as usuarioQueries from "./usuarioModel";

export const getUsuarioByEmail = async (email: string) => {
    const data = await pool.query(
        usuarioQueries.getUsuarioByEmailModel,
        [email]
    );

    if (data.rowCount === 0) return null;

    const user: Usuario = data.rows[0];
    return user;
}

export const getUsuarios = async () => {
    const data = await pool.query(usuarioQueries.getUsuariosModel);
    return data.rows as Usuario[];
}

export const findById = async (id: number) => {
    const data = await pool.query(
        usuarioQueries.getUsuarioByIdModel,
        [id]
    );
    if (data.rowCount === 0) return null;

    const user: Usuario = data.rows[0];
    return user;
};

export const getClienteByUsuarioId = async (id: number): Promise<Cliente | null> => {
    const data = await pool.query(usuarioQueries.getClienteByUsuarioIdModel, [id]);
    if (data.rowCount === 0) return null;

    return data.rows[0];
}

export const getClienteByUsuarioIdAndVerificado = async (id: number, verificado: boolean) => {
    const data = await pool.query(usuarioQueries.getClienteByUsuarioIdAndVerificadoModel, [id, verificado]);
    if (data.rowCount === 0) return null;

    return data.rows[0];
}

export const UsuarioRepository = {
    getUsuarioByEmail,
    getUsuarios,
    findById,
    getClienteByUsuarioId,
    getClienteByUsuarioIdAndVerificado
}
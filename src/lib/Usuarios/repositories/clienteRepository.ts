import { pool } from "../../../database";
import { Empresa, Persona, Usuario } from "../../../types/Usuario";
import { SignUpEmpresaData, SignUpPersonaData } from "../../Auth/controllers/clienteCtrl";
import * as clienteQueries from "./clienteModel";

export const createPersona = async (data: SignUpPersonaData, p_hash: string, municipio_id: number): Promise<Persona | null> => {
    const raw = await pool.query(
        clienteQueries.createPersonaModel,
        [
            data.correo, p_hash, municipio_id, // usuario
            data.telefono, data.direccion, // cliente
            data.cedula, data.nombre, data.apellido, data.fecha_nacimiento // persona
        ]
    );

    if (raw.rowCount === 0) return null;

    return raw.rows[0];
};

export const createEmpresa = async (data: SignUpEmpresaData, p_hash: string, municipio_id: number): Promise<Empresa | null> => {
    const raw = await pool.query(
        clienteQueries.createEmpresaModel,
        [
            data.correo, p_hash, municipio_id, // usuario
            data.telefono, data.direccion, // cliente
            data.nombre_empresa, data.contacto_nombre, data.tipo_empresa, data.rnc // empresa
        ]
    );

    if (raw.rowCount === 0) return null;

    return raw.rows[0];
};

export const setClienteVerificacion = async (id: number) => {
    const data = await pool.query(clienteQueries.setClienteVerificacionModel, [id]);

    if (data.rowCount === 0) return null;

    const user: Usuario = data.rows[0];
    return user;
}
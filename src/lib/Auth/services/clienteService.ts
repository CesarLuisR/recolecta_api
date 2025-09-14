import { SignUpEmpresaData, SignUpPersonaData } from "../controllers/clienteCtrl";
import * as municipioRepository from "../../Municipios/repositories/municipioRepository";
import { Conflict, NotFoundError } from "../../../utils/error";
import { emailVerificationService } from "./emailVerificationService";
import { hashPassword } from "../../../utils/hash";
import * as clienteRepository from "../../Usuarios/repositories/clienteRepository";
import { Municipio } from "../../../types/Municipio";
import { Empresa, Persona } from "../../../types/Usuario";

export const registerClientePersonaService = async (data: SignUpPersonaData, municipio_slug: string): Promise<Persona> => {
    try {
        const municipio: Municipio | null = await municipioRepository.getMunicipioBySlug(municipio_slug);
        if (!municipio) throw new NotFoundError("Municipio no encontrado");

        await emailVerificationService(data.correo);

        const password_hash = await hashPassword(data.password);

        const user: Persona | null = await clienteRepository.createPersona(data, password_hash, municipio.id);
        if (!user) throw new NotFoundError("Usuario no encontrado");

        return user;
    } catch (e: any) {
        console.error("Error en el register service", e);

        // En caso de duplicate key (cedula)
        if (e.code === '23505')
            throw new Conflict("Este usuario ya esta registrado");

        throw e;
    }
}

export const registerClienteEmpresaService = async (data: SignUpEmpresaData, municipio_slug: string): Promise<Empresa> => {
    try {
        const municipio: Municipio | null = await municipioRepository.getMunicipioBySlug(municipio_slug);
        if (!municipio) throw new NotFoundError("Municipio no encontrado");

        await emailVerificationService(data.correo);

        const password_hash = await hashPassword(data.password);

        const user: Empresa | null = await clienteRepository.createEmpresa(data, password_hash, municipio.id);
        if (!user) throw new NotFoundError("Usuario no encontrado");

        return user;
    } catch (e: any) {
        console.error("Error en el register service", e);

        // En caso de duplicate key (RNC)
        if (e.code === '23505')
            throw new Conflict("Este usuario ya esta registrado");

        throw e;
    }
}
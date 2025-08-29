export interface Cliente{
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
    municipio_id: number;
    tipo_cliente: string;
    cedula: string;
    rnc: string;
    telefono: string;
}

export interface LogInData {
    email: string;
}
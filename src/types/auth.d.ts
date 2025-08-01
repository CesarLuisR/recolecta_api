export interface SignUpData {
    nombre: string;
    apellido: string;
    cedula: string;
    email: string;
    password: string;
    municipio_id: number;
}

export interface LogInData {
    email: string;
    password: string;
}
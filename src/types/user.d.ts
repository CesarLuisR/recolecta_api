export interface User {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
    email: string;
    password_hash: string;
    tipo_usuario: 'cliente' | 'admin',
    creado_en: Date;
    municipio_id: number;
}
export interface Usuario {
    id: number;
    correo: string;
    password_hash: string;
    activo: boolean;
    municipio_id: number;
    tipo: 'cliente' | 'administrador';
    creado_en: Date;
}

export interface Cliente extends Usuario {
    telefono: string;
    direccion: string;
    verificado: boolean;
}

export interface Persona extends Cliente {
    cedula: string;
    nombre: string;
    apellido: string;
    fecha_nacimiento: Date;
}

export interface Empresa extends Cliente {
    nombre_empresa: string;
    contacto_nombre: string;
    tipo_empresa: 'PYME' | 'grande' | 'mediana' | 'pequeña' | 'institucional',
    rnc: string;
}

export interface Administrador extends Usuario {
    nombre: string;
    apellido: string;
}
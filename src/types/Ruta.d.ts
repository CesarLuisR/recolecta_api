export interface Ruta {
    id: number;
    codigo: string;
    nombre: string;
    es_publica: boolean;
    activa: boolean;
    ruta_ors: any;
    garaje_id: number;
    municipio_id: number;
}
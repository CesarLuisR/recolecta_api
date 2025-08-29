export interface Contenedor {
    id: number;
    municipio_id: number;
    direccion: string;
    lat: number;
    lng: number;
    tipo: "small" | "medium" | "big";
    es_publico: boolean;
    estado: boolean;
    creado_en: Date;
}
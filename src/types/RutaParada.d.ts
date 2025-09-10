export interface RutaParada {
    id: number;
    ruta_id: number;
    tipo_parada: "contenedor" | "servicio" | "garaje" | "guia";
    contenedor_id?: number | null;
    servicio_id?: number | null;
    garaje_id?: number | null;
    lat?: number | null;
    lng?: number | null;
    orden: number;
    tiempo_estimado?: string | null;  // interval en Postgres → string ISO
    distancia_desde_inicio?: number | null;
}

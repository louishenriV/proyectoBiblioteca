//crear interfaz para opcines de busqueda (título, autor, prestado, año)
export interface BuscarOpciones {
    titulo?: string;
    autor?: string;
    anioPublicacion?: number;
    prestado?: boolean;
}

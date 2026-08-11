//Funcion compartida para leer y sanear los query params de paginacion
//(pagina, limite) desde cualquier ruta que los necesite, para no repetir
//esta misma logica en cada endpoint paginado.

export function parsePaginacion(query: Record<string, unknown>) {
    // parseInt puede devolver NaN si el query param no viene o no es un numero valido;
    // el "|| valor" cubre ambos casos cayendo a un default razonable
    const pagina = Math.max(1, parseInt(query.pagina as string) || 1);
    const limite = Math.min(100, Math.max(1, parseInt(query.limite as string) || 20)); // tope de 100 para evitar pedir de mas

    return { pagina, limite };
}

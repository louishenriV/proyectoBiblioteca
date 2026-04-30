export function buscarPorProp<T, K extends keyof T>(
                            // ... = K debe ser una propiedad válida del objeto T.
    lista: T[],
    prop: K,
    valor: T[K]
): T | undefined { //devuelde una propiedad del objeto T o undefined si no encuentra algo valido o nada
    return lista.find(item => item[prop] === valor);
   /*item[prop] accede dinámicamente a la propiedad seleccionada.
    Se compara con el valor.
    .find() devuelve:
    el primer item que coincide
    o undefined si no encuentra nada* */  
}

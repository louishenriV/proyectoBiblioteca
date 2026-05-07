export function buscarPorProp(
// ... = K debe ser una propiedad válida del objeto T.
lista, prop, valor) {
    return lista.find(item => item[prop] === valor);
    /*item[prop] accede dinámicamente a la propiedad seleccionada.
     Se compara con el valor.
     .find() devuelve:
     el primer item que coincide
     o undefined si no encuentra nada* */
}
//# sourceMappingURL=buscarPorProp.js.map
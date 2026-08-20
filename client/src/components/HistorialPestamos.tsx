import {useEffect, useState} from "react";
import { authFetch } from "../api";

type prestamoHistorial = { //Define la forma de cada préstamo que viene de la API.
    id: string;
    fechaPrestamo: string;
    fechaDevolucion: string | null; //puede ser null si el libro aún no ha sido devuelto.
    libro: {
        id: string;
        titulo: string; //libro es un objeto anidado.
    };
}

type Paginacion = {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
}

function HistorialPrestamos() {
    const [historial, setHistorial] = useState<prestamoHistorial[]>([]); //Array vacío que se llenará con los préstamos del historial del usuario.
    const [pagina, setPagina] = useState<number>(1); //en que pagina estamos parados ahorita
    const [paginacion, setPaginacion] = useState<Paginacion | null>(null); //metadata que manda el backend

    useEffect(() => {
        authFetch(`/prestamos/historial?pagina=${pagina}`) //"...especificamente esta página"
        .then(res => res.json())
        .then(data => {
            setHistorial(data.prestamos);
            setPaginacion(data.paginacion);
        })
        .catch(err => console.error("Error:", err));
    }, [pagina]); // se vuelve a pedir cada vez que cambia la pagina
    
    return (
        <div>
            <h1>Historial de Préstamos</h1>
            <table>
                <thead>
                    <tr>
                        <th>Título del libro</th>
                        <th>Fecha de préstamo</th>
                        <th>Fecha de devolución</th>
                    </tr>
                </thead>
                <tbody>
                    {historial.map(prestamo => (
                        <tr key={prestamo.id}>
                            <td>{prestamo.libro.titulo}</td>
                            <td>{new Date(prestamo.fechaPrestamo).toLocaleDateString()}</td>
                            <td>{prestamo.fechaDevolucion ? new Date(prestamo.fechaDevolucion).toLocaleDateString() : "No devuelto"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {paginacion && (
                <div>
                    <button
                        onClick={() => setPagina(p => p - 1)}
                        disabled={pagina <= 1}
                    >
                        Anterior
                    </button>
                    <span> Página {paginacion.pagina} de {paginacion.totalPaginas || 1} ({paginacion.total} préstamos) </span>
                    <button
                        onClick={() => setPagina(p => p + 1)}
                        disabled={pagina >= paginacion.totalPaginas}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}

export default HistorialPrestamos;
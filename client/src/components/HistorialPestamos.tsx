import {useEffect, useState} from "react";
import { API_URL } from "../api";

type prestamoHistorial = { //Define la forma de cada préstamo que viene de la API.
    id: string;
    fechaPrestamo: string;
    fechaDevolucion: string | null; //puede ser null si el libro aún no ha sido devuelto.
    libro: {
        id: string;
        titulo: string; //libro es un objeto anidado.
    };
}

function HistorialPrestamos() {
    const [historial, setHistorial] = useState<prestamoHistorial[]>([]); //Array vacío que se llenará con los préstamos del historial del usuario.
    
    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${API_URL}/prestamos/historial`,  {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setHistorial(data.prestamos);
})
        .catch(err => console.error("Error:", err));
    }, []);
    
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
        </div>
    );
}

export default HistorialPrestamos;

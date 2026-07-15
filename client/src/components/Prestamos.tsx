import {useEffect, useState} from "react";
import { API_URL } from "../api";

type prestamoActivo = { //Define la forma de cada préstamo que viene de la API.
    id: string;
    fechaPrestamo: string;
    libro: {
        id: string;
        titulo: string; //libro es un objeto anidado.
    };
}

function Prestamos() {
    const [prestamos, setPrestamos] = useState<prestamoActivo[]>([]); //Array vacío que se llenará con los préstamos activos del usuario.
    
    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${API_URL}/api/prestamos/activos`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setPrestamos(data.prestamos))
        .catch(err => console.error("Error:", err));
    }, []);

    const handleDevolver = async (prestamoId: string) => {
    const token = localStorage.getItem("token");
    
    await fetch(`/api/prestamos/${prestamoId}/devolver`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
    });
    
    setPrestamos(prestamos.filter(p => p.id !== prestamoId));
};    

    return (
        <div>
            <h1>Préstamos Activos</h1>
            <table>
                <thead>
                    <tr>
                        <th>Título del libro</th>
                        <th>Fecha de préstamo</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {prestamos.map(prestamo => (
                        <tr key={prestamo.id}>
                            <td>{prestamo.libro.titulo}</td>
                            <td>{new Date(prestamo.fechaPrestamo).toLocaleDateString()}</td>
                            <td><button onClick={() => handleDevolver(prestamo.id)}>Devolver</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <a href="/prestamos/historial">Ver historial completo</a>
        </div>
    );

}

export default Prestamos;

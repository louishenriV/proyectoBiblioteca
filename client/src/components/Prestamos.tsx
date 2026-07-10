import {useEffect, useState} from "react";

type prestamoActivo = {
    id: string;
    fechaPrestamo: string;
    libro: {
        id: string;
        titulo: string;
    };
}

function Prestamos() {
    const [prestamos, setPrestamos] = useState<prestamoActivo[]>([]);
    
    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("/api/prestamos/activos", {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setPrestamos(data.prestamos))
        .catch(err => console.error("Error:", err));
    }, []);

    return (
        <div>
            <h1>Préstamos Activos</h1>
            <table>
                <thead>
                    <tr>
                        <th>Título del libro</th>
                        <th>Fecha de préstamo</th>
                    </tr>
                </thead>
                <tbody>
                    {prestamos.map(prestamo => (
                        <tr key={prestamo.id}>
                            <td>{prestamo.libro.titulo}</td>
                            <td>{new Date(prestamo.fechaPrestamo).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}

export default Prestamos;

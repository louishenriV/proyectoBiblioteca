import { useEffect, useState } from "react";

type Libro = {
    id: string;
    titulo: string;
    autor: string;
    anioPublicacion: number;
    editorial?: string;
    edicion?: string;
    isbn?: string;
    prestamos: { id: string }[];
} //defines la forma que tienen los datos que vas a recibir de la API. 

function Acervo() {
    const [libros, setLibros] = useState<Libro[]>([]); //creas un estado que empieza como un array vacío.

    useEffect(() => { //es un hook que se ejecuta cuando el componente se monta por primera vez. 
        const token = localStorage.getItem("token");

        fetch("/api/libros", { //hace la petición GET al backend con el token en el header, igual que lo hacías en Thunder Client.
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setLibros(data))
        .catch(err => console.error("Error:", err));
    }, []);

    const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
    };  
    
    return (
        <div>
            <h1>Acervo</h1>
             <table>
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Año</th>
                    <th>Editorial</th>
                    <th>Edición</th>
                    <th>Disponibilidad</th>
                </tr>
            </thead>
            <tbody>
                {libros.map(libro => (
                    <tr key={libro.id}>
                        <td>{libro.titulo}</td>
                        <td>{libro.autor}</td>
                        <td>{libro.anioPublicacion}</td>
                        <td>{libro.editorial ?? "—"}</td>
                        <td>{libro.edicion ?? "—"}</td>
                        <td>{libro.prestamos.length === 0 ? "Disponible" : "Prestado"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
}

export default Acervo;
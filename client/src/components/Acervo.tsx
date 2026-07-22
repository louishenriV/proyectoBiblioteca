import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../api";

type TokenPayload = {
    id: string;
    email: string;
    rol: string;
}

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

        fetch(`${API_URL}/libros`,  { //hace la petición GET al backend con el token en el header, igual que lo hacías en Thunder Client.
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

    const token = localStorage.getItem("token");
    const rol = token ? jwtDecode<TokenPayload>(token).rol : null;
    
    const handlePrestamo = async (libroId: string) => {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        console.log("LibroId:", libroId);
        console.log("URL:", `${API_URL}/prestamos`);
        
        const response =await fetch(`${API_URL}/prestamos/`, {
            method: "POST",
            headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
            body: JSON.stringify({ libroId })
        });

        if (response.ok) {
            setLibros(libros.map(libro => 
                libro.id === libroId ? { ...libro, prestamos: [{id: "temp"}] } : libro
            ));
        }
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
                    <th>Acción</th>
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
                        <td>{libro.prestamos.length === 0 && (
                            <button onClick={() => handlePrestamo(libro.id)}>Pedir prestado</button>
                         )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <a href="/prestamos">Mis préstamos</a>
        <br />
        {rol === "admin" && <a href="/agregar-libro">Agregar libro</a>}
        <br />
        <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
}

export default Acervo;
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { authFetch } from "../api";

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
    const [busqueda, setBusqueda] = useState<string>(""); //creas un estado para la búsqueda que empieza como un string vacío.
    const [mensaje, setMensaje] = useState<string>("");

    useEffect(() => { //Se ejecuta cada vez que el valor de busqueda cambia, esto manda una petición al backend después de un pequeño retraso.
    const delay = setTimeout(() => {
        if (busqueda.trim() === "") {
            // si está vacío, carga todos los libros
            authFetch("/libros")
            .then(res => res.json())
            .then(data => setLibros(data));
        } else {
            authFetch(`/libros/buscar?q=${busqueda}`)
            .then(res => res.json())
            .then(data => setLibros(data));
        }
    }, 400); // espera 400ms después de que el usuario deje de escribir

    return () => clearTimeout(delay); // cancela el timer si el usuario sigue escribiendo
}, [busqueda]); // el efecto se ejecuta cada vez que busqueda cambia

    const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
    };  

    const token = localStorage.getItem("token");
    const rol = token ? jwtDecode<TokenPayload>(token).rol : null;
    
    const handlePrestamo = async (libroId: string) => {
    setMensaje("");

    const response = await authFetch(`/prestamos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ libroId })
    });

    const data = await response.json();

    if (response.ok) {
        setLibros(libros.map(libro => 
            libro.id === libroId ? { ...libro, prestamos: [{id: "temp"}] } : libro
        ));
    } else {
        setMensaje(data.error || "No se pudo pedir prestado el libro");
    }
};
    return (
        <div>
            <h1>Acervo</h1>
            <input
                type="text"
                placeholder="Buscar por título o autor..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                />
                {mensaje && <p style={{ color: "red" }}>{mensaje}</p>}
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
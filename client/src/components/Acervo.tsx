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

type Paginacion = {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
}

function Acervo() {
    const [libros, setLibros] = useState<Libro[]>([]); //creas un estado que empieza como un array vacío.
    const [busqueda, setBusqueda] = useState<string>(""); //creas un estado para la búsqueda que empieza como un string vacío.
    const [mensaje, setMensaje] = useState<string>(""); //estado para mostrar errores del backend al usuario (ej. libro ya prestado)
    const [pagina, setPagina] = useState<number>(1); //en que pagina estamos parados ahorita
    const [paginacion, setPaginacion] = useState<Paginacion | null>(null); //la metadata que manda el backend (total, totalPaginas, etc)

    useEffect(() => { //Se ejecuta cada vez que busqueda o pagina cambian, esto manda una petición al backend después de un pequeño retraso.
    const delay = setTimeout(() => {
        if (busqueda.trim() === "") {
            // si está vacío, carga todos los libros de la pagina actual
            authFetch(`/libros?pagina=${pagina}`)
            .then(res => res.json())
            .then(data => {
                setLibros(data.libros);
                setPaginacion(data.paginacion);
            });
        } else {
            authFetch(`/libros/buscar?q=${busqueda}&pagina=${pagina}`)
            .then(res => res.json())
            .then(data => {
                setLibros(data.libros);
                setPaginacion(data.paginacion);
            });
        }
    }, 400); // espera 400ms después de que el usuario deje de escribir

    return () => clearTimeout(delay); // cancela el timer si el usuario sigue escribiendo
}, [busqueda, pagina]); // el efecto se ejecuta cada vez que busqueda o pagina cambian

    const handleBusquedaChange = (valor: string) => {
        setBusqueda(valor);
        setPagina(1); // toda busqueda nueva regresa a la primera pagina, para no quedarte "perdido" en una pagina que ya no tiene sentido con el nuevo filtro
    };

    const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
    };  

    const token = localStorage.getItem("token");
    const rol = token ? jwtDecode<TokenPayload>(token).rol : null;
    
    const handlePrestamo = async (libroId: string) => {
        setMensaje(""); //limpiamos cualquier mensaje de error anterior antes de intentar de nuevo

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
                onChange={(e) => handleBusquedaChange(e.target.value)}
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

        {paginacion && (
            <div>
                <button
                    onClick={() => setPagina(p => p - 1)}
                    disabled={pagina <= 1}
                >
                    Anterior
                </button>
                <span> Página {paginacion.pagina} de {paginacion.totalPaginas || 1} ({paginacion.total} libros) </span>
                <button
                    onClick={() => setPagina(p => p + 1)}
                    disabled={pagina >= paginacion.totalPaginas}
                >
                    Siguiente
                </button>
            </div>
        )}

        <a href="/prestamos">Mis préstamos</a>
        <br />
        {rol === "admin" && <a href="/agregar-libro">Agregar libro</a>}
        <br />
        <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
}

export default Acervo;
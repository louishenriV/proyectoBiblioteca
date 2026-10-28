import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { authFetch } from "../api";
import { Link } from "react-router-dom";
import "./Acervo.css";

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
}

type Paginacion = {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
}

function Acervo() {
    const [libros, setLibros] = useState<Libro[]>([]);
    const [busqueda, setBusqueda] = useState<string>("");
    const [mensaje, setMensaje] = useState<string>("");
    const [pagina, setPagina] = useState<number>(1);
    const [paginacion, setPaginacion] = useState<Paginacion | null>(null);
    const [cargando, setCargando] = useState<boolean>(true);

    useEffect(() => {
        const delay = setTimeout(() => {
            setCargando(true);
            const query = busqueda.trim() === ""
                ? `/libros?pagina=${pagina}`
                : `/libros/buscar?q=${encodeURIComponent(busqueda)}&pagina=${pagina}`;

            authFetch(query)
                .then(res => res.json())
                .then(data => {
                    setLibros(Array.isArray(data.libros) ? data.libros : []);
                    setPaginacion(data.paginacion ?? null);
                })
                .catch(() => setMensaje("No se pudo cargar el acervo"))
                .finally(() => setCargando(false));
        }, 400);

        return () => clearTimeout(delay);
    }, [busqueda, pagina]);

    const handleBusquedaChange = (valor: string) => {
        setBusqueda(valor);
        setPagina(1);
    };

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

    const handleEliminar = async (libroId: string) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este libro?")) return;

        const response = await authFetch(`/libros/${libroId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            setLibros(libros.filter(libro => libro.id !== libroId));
        } else {
            const data = await response.json();
            setMensaje(data.mensaje || "No se pudo eliminar el libro");
        }
    };

    const totalLibros = paginacion?.total ?? libros.length;
    const totalPaginas = paginacion?.totalPaginas || 1;

    return (
        <div className="acervo">
            <header className="acervo-top">
                <h1>Acervo</h1>
                <nav className="acervo-nav" aria-label="Navegación del acervo">
                    <Link to="/prestamos">Mis préstamos</Link>
                    {rol === "admin" && <Link to="/agregar-libro">Agregar libro</Link>}
                    <button type="button" className="acervo-btn acervo-btn-ghost" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </nav>
            </header>

            {mensaje && <p className="acervo-alert" role="alert">{mensaje}</p>}

            <section className="acervo-card">
                <div className="acervo-toolbar">
                    <input
                        className="acervo-search"
                        type="search"
                        placeholder="Buscar por título o autor..."
                        value={busqueda}
                        onChange={(e) => handleBusquedaChange(e.target.value)}
                        aria-label="Buscar libros por título o autor"
                    />
                    <span className="acervo-meta">
                        {cargando ? "Cargando…" : `${totalLibros} ${totalLibros === 1 ? "libro" : "libros"}`}
                    </span>
                </div>

                <div className="acervo-table-wrap">
                    <table className="acervo-table">
                        <caption>Catálogo de libros del acervo</caption>
                        <thead>
                            <tr>
                                <th scope="col">Título</th>
                                <th scope="col">Autor</th>
                                <th scope="col">Año</th>
                                <th scope="col">Editorial</th>
                                <th scope="col">Edición</th>
                                <th scope="col">ISBN</th>
                                <th scope="col">Disponibilidad</th>
                                <th scope="col">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!cargando && libros.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="acervo-empty">
                                        {busqueda.trim()
                                            ? "No hay resultados para esa búsqueda."
                                            : "Aún no hay libros en el acervo."}
                                    </td>
                                </tr>
                            )}
                            {libros.map(libro => {
                                const disponible = libro.prestamos.length === 0;
                                return (
                                    <tr key={libro.id}>
                                        <td>{libro.titulo}</td>
                                        <td>{libro.autor}</td>
                                        <td>{libro.anioPublicacion}</td>
                                        <td>{libro.editorial ?? "—"}</td>
                                        <td>{libro.edicion ?? "—"}</td>
                                        <td className="acervo-isbn">{libro.isbn ?? "—"}</td>
                                        <td>
                                            <span className={`acervo-badge ${disponible ? "acervo-badge--ok" : "acervo-badge--off"}`}>
                                                {disponible ? "Disponible" : "Prestado"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="acervo-actions">
                                                {disponible && (
                                                    <button
                                                        type="button"
                                                        className="acervo-btn acervo-btn-primary"
                                                        onClick={() => handlePrestamo(libro.id)}
                                                    >
                                                        Pedir prestado
                                                    </button>
                                                )}
                                                {rol === "admin" && (
                                                    <>
                                                        <Link className="acervo-btn" to={`/editar-libro/${libro.id}`}>
                                                            Editar
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            className="acervo-btn acervo-btn-danger"
                                                            onClick={() => handleEliminar(libro.id)}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {paginacion && (
                    <footer className="acervo-footer">
                        <span className="acervo-meta">
                            Página {paginacion.pagina} de {totalPaginas}
                        </span>
                        <div className="acervo-pager">
                            <button
                                type="button"
                                className="acervo-btn"
                                onClick={() => setPagina(p => p - 1)}
                                disabled={pagina <= 1}
                            >
                                Anterior
                            </button>
                            <button
                                type="button"
                                className="acervo-btn"
                                onClick={() => setPagina(p => p + 1)}
                                disabled={pagina >= totalPaginas}
                            >
                                Siguiente
                            </button>
                        </div>
                    </footer>
                )}
            </section>
        </div>
    );
}

export default Acervo;

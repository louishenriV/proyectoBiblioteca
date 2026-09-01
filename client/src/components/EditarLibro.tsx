import { useState } from "react";
import { authFetch } from "../api";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function EditarLibro() {
    const { id } = useParams(); //Esto te da el ID del libro que viene en la URL
    const [titulo, setTitulo] = useState(""); //Los estados comienzan vacíos o en cero. 
    const [autor, setAutor] = useState("");
    const [anioPublicacion, setAnioPublicacion] = useState(0); //comienza en cero porque es un número.
    const [editorial, setEditorial] = useState("");
    const [edicion, setEdicion] = useState("");
    const [isbn, setIsbn] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
    authFetch(`/libros/${id}`)
    .then(res => res.json())
    .then(data => {
        setTitulo(data.titulo);
        setAutor(data.autor);
        setAnioPublicacion(data.anioPublicacion);
        setEditorial(data.editorial ?? "");
        setEdicion(data.edicion ?? "");
        setIsbn(data.isbn ?? "");
    })
    .catch(err => console.error("Error:", err));
    }, [id]);
    
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await authFetch(`/libros/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, autor, anioPublicacion: Number(anioPublicacion), editorial, edicion, isbn })
    });

    const data = await response.json();

    if (response.ok) {
        setMensaje("Libro editado exitosamente");
        setTitulo(data.libro.titulo || "");
        setAutor(data.libro.autor || "");
        setAnioPublicacion(data.libro.anioPublicacion || 0);
        setEditorial(data.libro.editorial || "");
        setEdicion(data.libro.edicion || "");
        setIsbn(data.libro.isbn || "");
    } else {
        setMensaje(data.mensaje || "Error al editar libro");
    }
};
    return (
        <div>
            <h2>Editar Libro</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)} 
                /><br /> 
                <input
                    type="text"
                    placeholder="Autor"
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                /><br />
                <input
                    type="number"
                    placeholder="Año de Publicación"
                    value={anioPublicacion}
                    onChange={(e) => setAnioPublicacion(Number(e.target.value))}
                /><br />
                <input
                    type="text"
                    placeholder="Editorial"
                    value={editorial}
                    onChange={(e) => setEditorial(e.target.value)}
                /><br />
                <input
                    type="text"
                    placeholder="Edición"
                    value={edicion}
                    onChange={(e) => setEdicion(e.target.value)}
                /><br />
                <input
                    type="text"
                    placeholder="ISBN"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                /><br />                                        
                <button type="submit">Guardar cambios</button>
            </form>
            {mensaje && <p>{mensaje}</p>}
        </div>
    );  //cuando el usuario escriba algo en este input, toma el valor actual del input (e.target.value) y actualiza el estado con él
}
export default EditarLibro;
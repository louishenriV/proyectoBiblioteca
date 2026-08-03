import { useState } from "react";
import { authFetch } from "../api";

function AgregarLibro() {
    const [titulo, setTitulo] = useState(""); //Los estados comienzan vacíos o en cero. 
    const [autor, setAutor] = useState("");
    const [anioPublicacion, setAnioPublicacion] = useState(0); //comienza en cero porque es un número.
    const [editorial, setEditorial] = useState("");
    const [edicion, setEdicion] = useState("");
    const [isbn, setIsbn] = useState("");
    const [mensaje, setMensaje] = useState("");
    
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await authFetch("/libros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, autor, anioPublicacion: Number(anioPublicacion), editorial, edicion, isbn })
    });

    const data = await response.json();

    if (response.ok) {
        setMensaje("Libro agregado exitosamente");
        setTitulo("");
        setAutor("");
        setAnioPublicacion(0);
        setEditorial("");
        setEdicion("");
        setIsbn("");
    } else {
        setMensaje(data.mensaje || "Error al agregar libro");
    }
};
    return (
        <div>
            <h2>Agregar Libro</h2>
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
                <button type="submit">Agregar Libro</button>
            </form>
            {mensaje && <p>{mensaje}</p>}
        </div>
    );  //cuando el usuario escriba algo en este input, toma el valor actual del input (e.target.value) y actualiza el estado con él
}
export default AgregarLibro;
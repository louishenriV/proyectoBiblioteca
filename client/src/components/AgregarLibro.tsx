import { useState } from "react";
import { API_URL } from "../api";

function AgregarLibro() {
    const [titulo, setTitulo] = useState(""); //Los estados comienzan vacíos o en cero. 
    const [autor, setAutor] = useState("");
    const [anioPublicacion, setAnioPublicacion] = useState(0); //comienza en cero porque es un número.
    const [editorial, setEditorial] = useState("");
    const [edicion, setEdicion] = useState("");
    const [isbn, setIsbn] = useState("");
    const [mensaje, setMensaje] = useState("");
    
    const handleSubmit = async (e: React.FormEvent) => { //es el evento de envío del formulario.
        e.preventDefault();
        const token = localStorage.getItem("token");
        
        const response = await fetch(`${API_URL}/libros`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ titulo, autor, anioPublicacion: Number(anioPublicacion), editorial, edicion, isbn })
        }); //manda el libro al backend para que lo agregue a la base de datos. Se manda en formato JSON y se manda el token para que el backend sepa que es un usuario autorizado.
        
        if (response.ok) {
            setMensaje("Libro agregado exitosamente"); //limpia el formulario después de agregar el libro exitosamente. Esto es para que el usuario pueda agregar otro libro sin tener que borrar los campos manualmente.
            setTitulo("");
            setAutor("");
            setAnioPublicacion(0);
            setEditorial("");
            setEdicion("");
            setIsbn("");
        } else {
            setMensaje("Error al agregar libro");
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
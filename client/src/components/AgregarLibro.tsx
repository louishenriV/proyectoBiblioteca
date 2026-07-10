import { useState } from "react";

function AgregarLibro() {
    const [titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");
    const [anioPublicacion, setAnioPublicacion] = useState(0);
    const [editorial, setEditorial] = useState("");
    const [edicion, setEdicion] = useState("");
    const [isbn, setIsbn] = useState("");
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        
        const response = await fetch("/api/libros", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ titulo, autor, anioPublicacion: Number(anioPublicacion), editorial, edicion, isbn })
        });
        
        if (response.ok) {
            console.log("Libro agregado exitosamente");
            setTitulo("");
            setAutor("");
            setAnioPublicacion(0);
            setEditorial("");
            setEdicion("");
            setIsbn("");
        } else {
            console.log("Error al agregar libro");
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
        </div>
    );  
}
export default AgregarLibro;
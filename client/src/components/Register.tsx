import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";


function Register() {
  
  const navigate = useNavigate(); //hook para redirigir a otra página después de iniciar sesión
  
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState(""); //crea un estado para guardar lo que el usuario escribe en cada campo.
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState(""); //estado para manejar errores de inicio de sesión

    const handleSubmit = async (e: React.FormEvent) => { //aquí es donde vamos a conectar la API.
    e.preventDefault(); // evita que el formulario recargue la página al enviarse
    try {
        const response = await fetch(`${API_URL}/auth/registro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            setMensaje("Registro exitoso");
            navigate("/login"); //redirige a la página de inicio de sesión después de registrarse
        } else {
          setMensaje(data.mensaje || "Error al registrarse");
      }
    } catch (error) {
        setMensaje("Error de conexión:");
    }
  };
  
  return (
    <div>
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)} //cada vez que el usuario escribe algo, actualiza el estado con el valor actual del input.
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Registrarse</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}  

export default Register;
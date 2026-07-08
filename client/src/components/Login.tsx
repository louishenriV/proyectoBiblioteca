import { useState } from "react"; //manejar datos que cambian, en este caso, lo que el usuario escribe en los campos de email y contraseña.
import { useNavigate } from "react-router-dom"; //redirigir entre páginas después de iniciar sesión.


type LoginProps = { //es como un parametro de una función normal, pero se le llama prop para componentes.
    onLogin: () => void;
}

function Login({ onLogin }: LoginProps) {
    const navigate = useNavigate(); //hook para redirigir a otra página después de iniciar sesión
  const [email, setEmail] = useState(""); //crea un estado para guardar lo que el usuario escribe en cada campo.
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => { //aquí es donde vamos a conectar la API.
    e.preventDefault(); // evita que el formulario recargue la página al enviarse
    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem("token", data.token);
            console.log("Token guardado");
            onLogin(); // llama a la función onLogin para actualizar el estado del token en App
            navigate("/"); //redirige a la página principal después de iniciar sesión
        } else {
            console.log("Error:", data.mensaje);
        }
    } catch (error) {
        console.log("Error de conexión:", error);
    }
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} //cada vez que el usuario escribe algo, actualiza el estado con el valor actual del input.
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
        <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
      </form>
    </div>
  );
}

export default Login;
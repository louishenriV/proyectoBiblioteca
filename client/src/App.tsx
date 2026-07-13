import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import Acervo from "./components/Acervo"
import Register from "./components/Register"
import Prestamos from "./components/Prestamos"
import AgregarLibro from "./components/AgregarLibro"
import {jwtDecode} from "jwt-decode"

type TokenPayload = {
    id: string;
    email: string;
    rol: string;
} /*Le dices a TypeScript qué datos viven dentro del token JWT 
  — los mismos que guardamos en el payload cuando generamos el token en el backend.*/

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  //Lee el token del localStorage al cargar. Cuando el usuario hace login, 
  //setToken se actualiza y React re-renderiza para mostrar las rutas correctas.

    const rol = token ? jwtDecode<TokenPayload>(token).rol : null;
  /**Si hay token, lo decodifica y extrae el rol. 
   * Si no hay token, el rol es null. jwtDecode no verifica la firma del token — solo lo lee. 
   * La verificación real ocurre en el backend.
   */
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setToken(localStorage.getItem("token"))} />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={token ? <Acervo /> : <Navigate to="/login" />} />
        <Route path="/prestamos" element={token ? <Prestamos /> : <Navigate to="/login" />} />
        <Route path="/agregar-libro" element={token && rol === "admin" ? <AgregarLibro /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
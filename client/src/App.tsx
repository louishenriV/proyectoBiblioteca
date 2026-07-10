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
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

    const rol = token ? jwtDecode<TokenPayload>(token).rol : null;

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
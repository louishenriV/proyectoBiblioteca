import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import Acervo from "./components/Acervo"
import Register from "./components/Register"
import Prestamos from "./components/Prestamos"

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setToken(localStorage.getItem("token"))} />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={token ? <Acervo /> : <Navigate to="/login" />} />
        <Route path="/prestamos" element={token ? <Prestamos /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
export const API_URL = import.meta.env.VITE_API_URL || "";

//Hace fetch agregando automáticamente el token del usuario, y si el backend
//responde 401 (token inválido o expirado), limpia la sesión y redirige a /login
//en vez de dejar la pantalla en un estado roto o silenciosamente vacío.
export async function authFetch(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
    });

    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Sesión expirada");
    }

    return response;
}
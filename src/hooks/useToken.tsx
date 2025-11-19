import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: number;
  username: string;
  nombre: string;
  email: string;
  menus: {
    id_menu: number;
    description: string;
    path: string;
    icon: string;
    id_padre: number;
  }[];
  authenticated: boolean;
  expira?: number;
}

export const useToken = () => {
  const [tokenData, setTokenData] = useState<JwtPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkToken = () => {
    try {
      const cookies = new Cookies();
      const jwtToken = cookies.get("jwt");

      if (!jwtToken) {
        setError("No se encontró la cookie jwt");
        setTokenData(null);
        return;
      }

      const decodedToken = jwtDecode<JwtPayload>(jwtToken);

      // 🔍 Verifica expiración (si tiene exp)
      if (decodedToken.expira && Date.now() >= decodedToken.expira * 1000) {
        console.log("El token ha expirado");
        cookies.remove("jwt"); // Elimina cookie vencida
        setTokenData(null);
        return;
      }else {
        console.log("El token no exira",decodedToken.expira);
      }
      if (decodedToken.expira !== undefined && Date.now() < decodedToken.expira * 1000) {
        console.log("El token expira en", new Date(decodedToken.expira * 1000).toLocaleString());
      }

      setTokenData(decodedToken);
      setError(null);
      console.log("Token decodificado:", decodedToken);
    } catch (err) {
      setError("Error al decodificar el token: " + (err as Error).message);
      setTokenData(null);
    }
  };

  // Puedes revisar el token al montar el componente
  useEffect(() => {
    checkToken();
  }, []);

  return { tokenData, error, checkToken };
};
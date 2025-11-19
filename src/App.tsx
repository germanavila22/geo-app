import { useGeo } from './hooks/useGeoContext'
import { useEffect,useState } from 'react';

import type { Usuario } from './Types/Index';


import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";

import { DashboardLayout } from './components/Dashboard';
import DashBoardInicial from "./pages/DashBoardInicial";
import { Login } from './pages/Login';
import { Clientes } from './pages/Clientes';
import { Ventas } from './pages/Ventas';
import CollarPlan from './pages/CollarPlan';
import { Logueo } from './pages/Logueo';
import Collarppl from './pages/Collarppl';
import Survey from './pages/Survey';
import Perforacion from './pages/Perforacion';
import Caratula from './pages/Caratula';
import './App.css'
//import { useToken } from './hooks/useToken';
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

function App() {
  //const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  

const{state,dispatch}=useGeo()

///todo lo relacionado con el token
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
  //const [tokenData, setTokenData] = useState<JwtPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkToken = () => {
    const initiusuarusuario: Usuario = {
          idusuario: 0,
          nombre: "",
          username: "",
          email: ""
        };
    try {
      const cookies = new Cookies();
      const jwtToken = cookies.get("jwt");

      if (!jwtToken) {
        setError("No se encontró la cookie jwt");
        //setTokenData(null);
       // console.log("No se encontró la cookie jwt");
        dispatch({ type: 'loguser', payload: { esUsuario: false,usuario:initiusuarusuario} });
        //window.location.href = '/login'; // Redirigir a la página de inicio de sesión
        return;

      }else{

      const decodedToken = jwtDecode<JwtPayload>(jwtToken);

      // 🔍 Verifica expiración (si tiene exp)
      if( (decodedToken.expira && Date.now() >= decodedToken.expira * 1000) ){
       // console.log("El token ha expirado o no se encontró el token");
        cookies.remove("jwt"); // Elimina cookie vencida
       // setTokenData(null);
                   
            dispatch({ type: 'loguser', payload: { esUsuario: false,usuario:initiusuarusuario} });
            window.location.href = '/login'; // Redirigir a la página de inicio de sesión


        return;
      }else {
        //console.log("El token no exira",decodedToken.expira);
      }
      if (decodedToken.expira !== undefined && Date.now() < decodedToken.expira * 1000) {
       // console.log("El token expira en", new Date(decodedToken.expira * 1000).toLocaleString());
      }
    }
    //  setTokenData(decodedToken);
      //setError(null);
      //console.log("Token decodificado:", decodedToken);
    } catch (err) {
      setError("Error al decodificar el token: " + (err as Error).message);
    //  setTokenData(null);
    }
   // console.log("Token verificado",error)
  };
setTimeout(() => {
  checkToken();
 // console.log("Revisando token cada 60 segundos");
}, 10000);


////fin de token
      

  useEffect(()=>{
    localStorage.setItem('esUsuario',JSON.stringify(state.esUsuario));///guardo el valdidaor del usuario
    localStorage.setItem('Usuario', JSON.stringify(state.usuario)); ///guardo los datos del usuario
    localStorage.setItem('Menu', JSON.stringify(state.menu));///guardo el menu del menu

  },[state])

  return (
    <>
          <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route element={<PrivateRoute isAuthenticated={state.esUsuario} />}>
        <Route element={<DashboardLayout/>}>        
          <Route path="/home" element={<DashBoardInicial />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/ventas" element={<Ventas />} />          
          <Route path="/collar" element={<Collarppl />} />
          <Route path="/logueo" element={<Logueo />} />
          <Route path="/collarplan" element={<CollarPlan />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/perforacion" element={<Perforacion />} />
          <Route path="/caratula" element={<Caratula />} />
          
        </Route>
      </Route>

      {/* Ruta 404 */}
      <Route path="*" element={<DashboardLayout />} />
    </Routes>
    </>
  )
}

export default App

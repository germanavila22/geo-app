import { useGeo } from './hooks/useGeoContext'
import { useEffect } from 'react';

import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";

import { DashboardLayout } from './components/Dashboard';
import DashBoardInicial from "./pages/DashBoardInicial";
import { Login } from './pages/Login';
import { Clientes } from './pages/Clientes';
import { Compras } from './pages/Compras';
import { Ventas } from './pages/Ventas';
import CollarPlan from './pages/CollarPlan';
import Logueo from './pages/Logueo';
import Collarppl from './pages/Collarppl';
import './App.css'



function App() {
  //const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  

  const{state}=useGeo()
  console.log(state)
  
  useEffect(()=>{
    localStorage.setItem('esUsuario',state.esUsuario.toString());///guardo el valdidaor del usuario
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
          <Route path="/compras" element={<Compras />} />
          <Route path="/collar" element={<Collarppl />} />
          <Route path="/logueo" element={<Logueo />} />
          <Route path="/collarplan" element={<CollarPlan />} />
          
        </Route>
      </Route>

      {/* Ruta 404 */}
      <Route path="*" element={<DashboardLayout />} />
    </Routes>
    </>
  )
}

export default App

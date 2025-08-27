// components/DashboardLayout.tsx
import { useEffect,useState } from "react";
import axios from "axios";

import { Outlet } from "react-router-dom";
import { useGeo } from "../hooks/useGeoContext";
import MenuPpal from './MenuPPal';

import type { Usuario } from "../Types/Index";
import {AutocompleteSearch} from './Autocompletesearch';

import '../App.css'
import { FiSettings } from 'react-icons/fi';

import { VscSearchFuzzy } from 'react-icons/vsc';
import { HiUser } from 'react-icons/hi2';
import { LuLogOut } from 'react-icons/lu';


export const DashboardLayout = () => {
  const{state,dispatch}=useGeo()
  const[Cadena,setCadena]=useState('')
  type CollarData ={
		id_collar :number
		holeid:     string
		depth:number
		east        :number    
		north           :number
		rl              :number
		id_proyecto     :number
		nombre_proyecto :string
    dip:number
    azimuth:number
	}
const [datacollares,setdatacollares]=useState<CollarData[]>([])
/*  const sampleData = [
  { id_collar: 'COL001', holeid: 'HOLE_A1', depth: 15.5 },
  { id_collar: 'COL002', holeid: 'HOLE_A2', depth: 22.3 },
  { id_collar: 'COL003', holeid: 'HOLE_B1', depth: 18.7 },
  { id_collar: 'COL004', holeid: 'HOLE_B2', depth: 31.2 },
  { id_collar: 'COL005', holeid: 'HOLE_C1', depth: 12.8 },
  { id_collar: 'COL006', holeid: 'HOLE_C2', depth: 25.9 },
  { id_collar: 'COL007', holeid: 'HOLE_D1', depth: 19.4 },
  { id_collar: 'COL008', holeid: 'HOLE_D2', depth: 28.6 },
  { id_collar: 'COL009', holeid: 'HOLE_E1', depth: 16.3 },
  { id_collar: 'COL010', holeid: 'HOLE_E2', depth: 33.1 },
];*/
  const salir = () => {
    const initiusuarusuario: Usuario = {
      idusuario: 0,
      nombre: "",
      username: "",
      email: ""
    };
    dispatch({ type: 'loguser', payload: { esUsuario: false,usuario:initiusuarusuario} });
    window.location.href = '/login'; // Redirigir a la página de inicio de sesión
  };
const handleRecordSelect = (record: any) => {
    console.log('Registro seleccionado:', record);
    dispatch({type:'holeid',
                    payload:{
                        holeid:{
                            id_collar:record.id_collar,
                            holeid:record.holeid,
                            depth:record.depth,                            
                        }
                        
                    }}
                  )
    // Aquí puedes manejar la selección del registro
  };
  const handleSearchChange = (searchTerm: string) => {
    //console.log('Término de búsqueda:', searchTerm);
    setCadena(searchTerm)
    // Aquí puedes hacer la consulta a tu base de datos
    // Por ejemplo:
    // fetchCollaresFromDatabase(searchTerm).then(results => {
    //   setSampleData(results);
    // });
  };
////codigfo para buscar el barreno
useEffect(() => {
    if (Cadena.trim() === '') return; // Evita búsquedas vacías

   // console.log("la cadena", Cadena);
    axios.post('http://localhost:3000/vercollares', `Cadena=${Cadena}`)
        .then(response => {
        //console.log("busqueda:", response.data.mensaje);
        if(response.data.collardata!=null){
          //console.log("busqueda:", response.data.collardata);
          setdatacollares(response.data.collardata)
        }
        else{
            setdatacollares([])
        }
        
        ///setdatacollares(response.data.collardata)
        //console.log(datacollares)
        // aquí puedes actualizar el state con los datos si es necesario
        })
        .catch(error => {
        console.error("Error al guardar los datos:", error);
        });
    }, [Cadena]);
///fin de buscar el barreno

  return (
        <>
    <div className="flex h-screen ">
      {/* Sidebar */}
      <MenuPpal menuItems={state.menu} />

      {/* Main content */}
      <div className="flex-1 flex flex-col ">
        {/* Topbar */}
        <header className="flex flex-row justify-between items-start px-4 py-3 bg-gradient-to-br from-[#D61B26]  to-[#E83F32] shadow-md shadow-gray-600 h-40">
          {/* Left: Logo + usuario */}
          <div className="flex items-center gap-4">
           <HiUser size={30} className='text-white'/>
            <span className="font-semibold text-white text-2xl ">{state.usuario?.nombre}</span>
          </div>

          {/* Center: campo de búsqueda */}
          <div className="flex-1 mx-6 p-1  ">
             <div className="relative max-w-xs w-full transition-all duration-300 ease-in-out">
              <AutocompleteSearch 
              data={datacollares}
              onSelect={handleRecordSelect}
              onChange={handleSearchChange}
              placeholder="Buscar por ID Collar, Hole ID o Depth..."
            />
            </div>
          </div>
          <div className="mb-8">
          
            
            
          
        </div>
          {/* Right: iconos */}
          <div className="flex items-center gap-4 text-gray-300  text-xl">
            <VscSearchFuzzy className="cursor-pointer hover:text-white" title="Búsqueda avanzada"size={25} />
            <FiSettings className="cursor-pointer hover:text-white" title="Configuración" size={25}/>
            <LuLogOut className="cursor-pointer hover:text-white" title="Configuración" size={25} onClick={salir}/>
          </div>
        </header>

        {/* Contenido principal */}

      {/* Contenido principal */}
      <main className="overflow-hidden  w-full  -mt-15 flex items-start justify-center h-screen  " >
        <div id="DivPpl"  className='w-[95%] h-full   bg-white overflow-y-auto p-10 '>

        <Outlet /> {/* Aquí se renderizan las páginas */}
        </div>
      </main>
     </div>
    </div>
    </>
  );
};
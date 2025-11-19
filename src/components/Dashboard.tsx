// components/DashboardLayout.tsx
import { useEffect,useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

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
import { TbMapPinX } from 'react-icons/tb';

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
    tipo_survey:string
	}
const [datacollares,setdatacollares]=useState<CollarData[]>([])

  const salir = () => {
    const initiusuarusuario: Usuario = {
      idusuario: 0,
      nombre: "",
      username: "",
      email: ""
    };
     const cookies = new Cookies();     
     cookies.remove("jwt"); 
    dispatch({ type: 'loguser', payload: { esUsuario: false,usuario:initiusuarusuario} });
    window.location.href = '/login'; // Redirigir a la página de inicio de sesión
  };
  const quitarholeid=()=>{
    dispatch({type:'holeid',payload:{holeid:{
      id_collar: 0,
      holeid: "", 
      depth: 0,
      east: 0,
      north: 0,
      rl: 0,
      id_proyecto: 0,
      dip: 0,
      azimuth: 0,
      proyecto: "",
      tipo_survey: ""
    }}})
  }
const handleRecordSelect = (record: any) => {
    console.log('Registro seleccionado:', record);
    dispatch({type:'holeid',
                    payload:{
                        holeid:{
                          id_collar: record.id_collar,
                          holeid: record.holeid,
                          depth: record.depth,
                          east: record.east,
                          north: record.north,
                          rl: record.rl,
                          id_proyecto: record.id_proyecto,
                          dip: record.dip,
                          azimuth: record.azimuth,
                          proyecto: record.nombre_proyecto,
                          tipo_survey: record.tipo_survey
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
////codigo para buscar el barreno
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
    <div className="flex h-screen  bg-violet-50">
      {/* Sidebar */}
      <MenuPpal menuItems={state.menu} />

      {/* Main content */}
      <div className="flex-1 flex flex-col ">
        {/* Topbar */}
        <header className="flex flex-row justify-between items-start px-4 py-3 bg-gradient-to-br from-[#D61B26]  to-[#E83F32] shadow-md shadow-gray-600 h-40">
          {/* Left: Logo + usuario */}
          <div className="flex items-center p-1">
           <HiUser size={30} className='text-white'/>
            <span className="MontserratLight  text-white text-3xl ">{state.usuario?.nombre}</span>
          </div>

          {/* Center: campo de búsqueda */}
          <div className="flex-1 mx-6 p-1 flex justify-start">
             <div className="relative max-w-xs w-full transition-all duration-300 ease-in-out">
              <AutocompleteSearch 
              data={datacollares}
              onSelect={handleRecordSelect}
              onChange={handleSearchChange}              
              placeholder="Buscar nombre de holeid..."
            />
            
            </div >
            <div className="flex items-center">
              
              <span className=" text-white text-2xl flex items-center gap-2 MontserratLight">
                {state.holeid?.holeid && (
                  <>
                    {state.holeid.holeid}
                    <TbMapPinX
                      className="cursor-pointer text-gray-200 hover:text-white"
                      title="Quitar seleccion de barreno"
                      size={25}
                      onClick={quitarholeid}
                    />
                  </>
                )}
              </span>
            </div>
          </div>
          
          <div className="mb-8"> </div>
          {/* Right: iconos */}
          <div className="flex items-center gap-4 text-gray-300  text-xl">
            <VscSearchFuzzy className="cursor-pointer hover:text-white" title="Búsqueda avanzada"size={25} />
            <FiSettings className="cursor-pointer hover:text-white" title="Configuración" size={25}/>
            <LuLogOut className="cursor-pointer hover:text-white" title="Configuración" size={25} onClick={salir}/>
          </div>
        </header>

        {/* Contenido principal */}

      {/* Contenido principal */}
      <main className="overflow-hidden  w-full  -mt-15 flex items-start justify-center h-screen " >
        <div id="DivPpl"  className='w-[95%] h-full overflow-y-auto p-0 '>

        <Outlet /> {/* Aquí se renderizan las páginas */}
        </div>
      </main>
     </div>
    </div>
    </>
  );
};
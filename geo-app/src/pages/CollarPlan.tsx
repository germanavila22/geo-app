import { useEffect, useState } from 'react';
import Datatable from 'react-data-table-component';

import { useGeo } from "../hooks/useGeoContext";

import axios from "axios";
import { Toaster, toast } from 'sonner';

import {formatFecha,formatFechayymmdd} from '../components/FormatFecha';
import { LuPlus } from 'react-icons/lu';
import { VscSave } from 'react-icons/vsc';
import {FaExclamationTriangle} from 'react-icons/fa';
import { FaClock } from 'react-icons/fa';


export default function CollarPlan() {
    const {state}= useGeo()
    const[actualizar,setActualizar]=useState(true)
    /*todo lo de los proyectos*/   
    type Tproyectos ={
        id_proyecto: number;
        nombre_proyecto: String;
    }

    const[Stproyectos,setStproyectos]=useState<Tproyectos[]>([])
    //console.log("para el usuario",state.state.usuario.idusuario)
    //console.log("los proyectos", Stproyectos)
    const obtenerproyectos = async () => {
        if (!state.usuario || typeof state.usuario.idusuario === "undefined") {
            console.error("Usuario no definido, no se puede obtener proyectos.");
            return;
        }
        axios.post('http://localhost:3000/proyecto_descripcion', `id_usuario=${state.usuario.idusuario}`)
            .then(response => {
                //console.log("Datos guardados exitosamente:", response.data.proyectos);
                setStproyectos(response.data.proyectos)
                // Aquí podrías manejar la respuesta del servidor, como mostrar un mensaje de éxito
            })
            .catch(error => {
                console.error("Error al guardar los datos:", error);
                // Aquí podrías manejar el error, como mostrar un mensaje de error
            });
    };
    useEffect(() => {
    obtenerproyectos();
    }, []);
    type TypeCollarplan = {
        id_collar: number;
        holeid_plan?: string;
        id_proyecto?: number;
        nombre_proyecto?: string;
        id_grid?: number;
        east: number;
        north: number;
        rl: number;
        dip: number;
        dipstring?: string;
        azimuth: number;
        depth_plan: number;
        plan_inicio?: string;
        plan_fin?: string;
        id_usuario?: number;
    }
    ////DATOS DEL COLLAR PLANEADO
    const[collarform,setCollarform] = useState<TypeCollarplan>({
        id_collar: 0,
        holeid_plan: '',
        id_proyecto: 0,
        nombre_proyecto: '',
        id_grid: 0,
        east: 0,
        north: 0,
        rl: 0,
        dip:0,
        dipstring: '',
        azimuth: 0,
        depth_plan: 0,
        plan_inicio: '',
        plan_fin: '',
        id_usuario: state.usuario?.idusuario || 0, // Asegurarse de que el id_usuario esté definido
        });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newValue = ['east', 'north', 'rl', 'depth_plan',  'azimuth', "id_proyecto"].includes(name)
        ? parseFloat(value) || 0
        : value;
        setCollarform((prev: TypeCollarplan) => ({
            ...prev,
            [name]: newValue,
        }));
        ///si el valor es dipstring convertir a numero
        if(name==="dipstring"){
            const usuarioValidoRegex = /^[0-9@.-]+$/;
            if(!usuarioValidoRegex.test(value) ){
               toast.error("Caracter invalido",{description: "El valor de Inclinación no es válido.", position: 'top-center', duration: 4000,});
               setCollarform((prev: TypeCollarplan) => ({
                    ...prev,
                    dipstring: "",
                }));
               return
            }
            const dipValue = parseFloat(value);
            if(!isNaN(dipValue)){
                setCollarform((prev: TypeCollarplan) => ({
                    ...prev,
                    dip: dipValue,
                }));
            }
        }
        ///console.log("cambio collar", collarform);
    };
    const guardarcollar = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log("guardando collar", actualizar);
        axios.post('http://localhost:3000/collarplan', collarform)
            .then(response => {
                //console.log("Datos guardados exitosamente:", response.data.mensaje);
                //console.log("el nuevo id ",response.data.id_collar)
                setCollarform((prev: TypeCollarplan) => ({
                ...prev,
                id_collar: response.data.id_collar,
            }));
        toast.success("Datos del collar guardados correctamente",{description: "El collar ha sido guardado exitosamente.", position: 'top-center', duration: 4000,});
            // Aquí podrías manejar la respuesta del servidor, como mostrar un mensaje de éxito
        })
        .catch(error => {
            //console.error("Error al guardar los datos:", error);
            toast.error("Error",{description: "Hubo un error al guardar los datos."+error,icon: <LuPlus size={20}/>, position: 'top-center', duration: 4000,}); // Aquí podrías manejar el error, como mostrar un mensaje de error
        });
        setActualizar(!actualizar);
        
    };
    /////buscar el collar
/////propiedades de la tabla
    interface IColumn {
        name: string;
        selector?: (row: TypeCollarplan) => any;
        sortable: boolean;
        cell?: (row: TypeCollarplan) => React.ReactNode;
        ignoreRowClick?: boolean;
        
       
    }

    const columnas: IColumn[] = [
          {
    name: "Estado",
    cell: (row) => {
      const fechaRegistro = new Date(row.plan_inicio || "");
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // ignorar horas

      return fechaRegistro <= hoy ? (
        <span className="text-red-600 flex items-center gap-1">
          <FaExclamationTriangle /> 
        </span>
      ) : (
        <span className="text-green-600 flex items-center gap-1">
          <FaClock />
        </span>
      );
    },
    sortable: true,
  },
        {
            name: 'Holeid',
            selector: (row: TypeCollarplan) => row.holeid_plan,
            sortable: true,
        },
        {
            name: 'Proyecto',
            selector: (row: TypeCollarplan) => row.nombre_proyecto,
            sortable: true,
        },
        {
            name: 'Este',
            selector: (row: TypeCollarplan) => row.east,
            sortable: true,
        },
        {
            name: 'Norte',
            selector: (row: TypeCollarplan) => row.north,
            sortable: true,
        },
        {
            name: 'RL',
            selector: (row: TypeCollarplan) => row.rl,
            sortable: true,
        },
        {
            name: 'Profundidad Planeada',
            selector: (row: TypeCollarplan) => row.depth_plan,
            sortable: true,
        },
        {
            name: 'Inclinación',
            sortable: true,
            selector: (row: TypeCollarplan) => row.dip,
        },
        {
            name: 'Azimut',
            sortable: true,
            selector: (row: TypeCollarplan) => row.azimuth,
        },
        {
            name: 'Inicio Planeado',
            selector: (row: TypeCollarplan) => formatFecha(row.plan_inicio || ""),
            sortable: true,
        },
        {
            name: 'Fin Planeado',
            selector: (row: TypeCollarplan) =>formatFecha (row.plan_fin || ""),
            sortable: true,
        },
          {
              name: "Acciones",
              cell: (row) => (
                  <div className="flex gap-3">
                      <button
                          onClick={() => handleEditar(row)}
                          className="text-blue-500 hover:text-blue-700"
                      >
                          ✏️
                      </button>
                      <button
                          onClick={() => handleBorrar(row)}
                          className="text-red-500 hover:text-red-700"
                      >
                          🗑️
                      </button>
                  </div>
              ),
              ignoreRowClick: true,
              
             
              sortable: false
          },
        
    ];
    /*
    const datos = [
        {
            id_collar: 1,
            holeid_plan: 'H001',
            id_proyecto: 1,
            east: 100.0,
            north: 200.0,
            rl: 300.0,
            dip: 45.0,
            azimuth: 90.0,
            depth_plan: 500.0,
            plan_inicio: '2023-01-01',
            plan_fin: '2023-01-10',
        },
        {
            id_collar: 2,
            holeid_plan: 'H002',
            id_proyecto: 2,
            east: 150.0,
            north: 250.0,
            rl: 350.0,
            dip: 30.0,
            azimuth: 120.0,
            depth_plan: 600.0,
            plan_inicio: '2023-02-01',
            plan_fin: '2023-02-10',
        },
    ];/*/
const [collarregistros, setcollarregistros] = useState<TypeCollarplan[]>([]);
useEffect(() => {   
    axios.post('http://localhost:3000/vercollaresplan', `Estatus=0`)
        .then(response => {
        //console.log("busqueda:", response.data.mensaje);
        if(response.data.collardata!=null){
            setcollarregistros(response.data.collardata)
        }
        else{
            setcollarregistros([])
        }
        })
        .catch(error => {
        console.error("Error al guardar los datos:", error);
        });
    }, [actualizar]);
const handleEditar = (row: TypeCollarplan) => {
    setCollarform({
        id_collar: row.id_collar,
        holeid_plan: row.holeid_plan || '',
        id_proyecto: row.id_proyecto || 0,
        nombre_proyecto: row.nombre_proyecto || '',
        id_grid: row.id_grid || 0,
        east: row.east,
        north: row.north,
        rl: row.rl,
        dip: row.dip,
        dipstring: row.dip.toString(),
        azimuth: row.azimuth,
        depth_plan: row.depth_plan,
        plan_inicio:formatFechayymmdd(row.plan_inicio || ""),
        plan_fin: formatFechayymmdd(row.plan_fin || ""),
        id_usuario: state.usuario?.idusuario || 0, // Asegurarse de que el id_usuario esté definido
    });
   
}
const handleBorrar = (row: TypeCollarplan) => {
  console.log("Borrar collar", row);
  // Aquí podrías lanzar un confirm() o abrir modal
};
  return (
    <>
    <Toaster/>
        <div className="shadow-md rounded-2xl fondo-claro">

            <div className="flex items-start justify-between p-5 rounded-t-2xl ">
                <h3 className="text-3xl font-semibold obsidian">
                    Barreno {collarform.holeid_plan ? `  ${collarform.holeid_plan}` : ''}
                </h3>                
            </div>
            <hr className='my-2 h-px border-0 bg-gradient-to-r from-transparent via-gray-400 to-transparent'></hr>
            <div className="p-6 space-y-6 rounded-b-2xl fondo-claro">
                <form action="#">
                    <div className="grid grid-cols-12 md:grid-cols-6 lg:grid-cols-12 sm:grid-cols-2 gap-6">
                        <div className="col-span-3 ">
                            <label htmlFor="holeid" className="text-sm font-medium text-gray-700 block mb-2">Holeid</label>
                            <input type="text" name="holeid_plan" id="holeid_plan" value={collarform.holeid_plan} onChange={handleChange}
                            className="w-full border-b-1 border-gray-400 focus:border-red-600 focus:border-b-2 outline-none transition duration-500 pt-2.5 pb-2.5 pl-1.5 uppercase" placeholder="Holeid" />
                        </div>
                        <div className="col-span-3 ">
                            <label htmlFor="id_proyecto" className="text-sm font-medium text-gray-700 block mb-2">Poyecto</label>
                            <select name="id_proyecto"id="id_proyecto" onChange={handleChange} value={collarform.id_proyecto}
                            className="w-full border-b-1 border-gray-400 focus:border-red-600 focus:border-b-2 outline-none transition duration-500 pt-2.5 pb-2.5 pl-1.5">
                                <option>Seleccione</option>
                                {Stproyectos.map((proyecto) => (
                                    <option key={proyecto.id_proyecto} value={proyecto.id_proyecto}>
                                    {proyecto.nombre_proyecto}
                                    </option>
                                ))}
                            </select>
                    </div> 
                     <div className="col-span-2 ">
                            <label htmlFor="east" className="text-sm font-medium text-gray-700 block mb-2">Este</label>
                            <input type="number" name="east" id="east" value={collarform.east} onChange={handleChange}
                            className="w-full border-b-1 border-gray-400 focus:border-red-600 focus:border-b-2 outline-none transition duration-500 pt-2.5 pb-2.5 pl-1.5" placeholder="Apple Imac 27”" />
                        </div>
                        <div className="col-span-2 ">
                            <label htmlFor="north" className="text-sm font-medium text-gray-700 block mb-2">Norte</label>
                            <input type="number" name="north" id="north" value={collarform.north} onChange={handleChange}
                            className="w-full border-b-1 border-gray-400 focus:border-red-600 focus:border-b-2 outline-none transition duration-500 pt-2.5 pb-2.5 pl-1.5" placeholder="Apple Imac 27”" />
                        </div>                                               
                        <div className="col-span-2 ">
                            <label htmlFor="rl" className="text-sm font-medium text-gray-700 block mb-2">Elevacion</label>
                            <input type="number" name="rl" id="rl" value={collarform.rl} onChange={handleChange}
                            className="w-full border-b-1 border-gray-400 focus:border-red-600 focus:border-b-2 outline-none transition duration-500 pt-2.5 pb-2.5 pl-1.5" placeholder="Apple Imac 27”" />
                        </div> 
                        <div className="col-span-3 ">
                            <label htmlFor="depth" className="text-sm font-medium text-gray-700 block mb-2">Profundidad Planeada</label>
                            <input type="number" name="depth_plan" id="depth_plan" value={collarform.depth_plan} onChange={handleChange}
                            className="w-full border-b-1 border-gray-400 focus:border-red-600 focus:border-b-2 outline-none transition duration-500 pt-2.5 pb-2.5 pl-1.5" placeholder="Apple Imac 27”" />   
                        </div>
                        <div className="col-span-2 ">
                            <label htmlFor="dipstr" className="text-sm font-medium text-gray-700 block mb-2">Inclinación</label>
                            <input type="text" name="dipstring" id="dipstring" value={collarform.dipstring} onChange={handleChange} 
                            className="w-full border-b-1 border-gray-400 focus:border-red-600 focus:border-b-2 outline-none transition duration-500 pt-2.5 pb-2.5 pl-1.5" placeholder="Inclinacion" />
                        </div>
                        <div className="col-span-2 ">
                            <label htmlFor="azimuth" className="text-sm font-medium text-gray-700 block mb-2">Azimut</label>
                            <input type="number" name="azimuth" id="azimuth" value={collarform.azimuth} onChange={handleChange}
                            min={0} max={360}
                            className="w-full border-b-1 border-gray-400 focus:border-red-600 focus:border-b-2 outline-none transition duration-500 pt-2.5 pb-2.5 pl-1.5" placeholder="Apple Imac 27”" />
                        </div>
                        <div className="col-span-2 ">
                            <label htmlFor="plan_inicio" className="text-sm font-medium text-gray-700 block mb-2">Inicio Planeado</label>
                            <input type="date" name="plan_inicio" id="plan_inicio" value={collarform.plan_inicio} onChange={handleChange}
                            className="w-full border-b-1 border-gray-400 focus:border-red-600 focus:border-b-2 outline-none transition duration-500 pt-2.5 pb-2.5 pl-1.5" />
                        </div>
                        <div className="col-span-2 ">
                            <label htmlFor="plan_fin" className="text-sm font-medium text-gray-700 block mb-2">Fin Planeado</label>
                            <input type="date" name="plan_fin" id="plan_fin" value={collarform.plan_fin} onChange={handleChange}
                            className="w-full border-b-1 border-gray-400 focus:border-red-600 focus:border-b-2 outline-none transition duration-500 pt-2.5 pb-2.5 pl-1.5" />
                        </div>
                        
                    </div>
                    <div className="grid grid-cols-12 md:grid-cols-6 lg:grid-cols-6 sm:grid-cols-2 gap-6 pt-5"> 
                        <div className="col-span-1 ">
                            <button className="bg-blue-600 w-full p-2   text-white rounded-2xl flex items-center gap-1 text-center justify-center" onClick={guardarcollar}>
                            {collarform.id_collar? 
                                (
                                    <>Guardar <VscSave size={20} /></>

                                ):(
                                <>Nuevo <LuPlus size={25}/></>)
                            } </button>   
                        </div>
                    </div>
                    

                </form>
            </div>
            <div><Datatable columns={columnas} data={collarregistros} 
             pagination
        paginationPerPage={100} // registros por página
        paginationRowsPerPageOptions={[50,75,100,500]} // opciones de filas
        highlightOnHover
        striped/></div>
        </div>
    </>
  )
}

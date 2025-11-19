
import { useState,useEffect } from "react";
import type { TypeCollardos } from "../Types/Index";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useGeo } from "../hooks/useGeoContext";
import { LuPlus } from 'react-icons/lu';
import { VscSave } from 'react-icons/vsc';
import { FiEdit3 } from 'react-icons/fi';
import { FiTrash2 } from 'react-icons/fi';

const Collarppl = () => {
    const navigate = useNavigate();
    const {state,dispatch}= useGeo()
    const [Cadena, setCadena]=useState("")

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
/*fin de poner los proyectos */
    const[collarform,setCollarform] = useState<TypeCollardos>({
        id_collar: 0,
        holeid: '',
        id_proyecto: 0,
        east: 0,
        north: 0,
        rl: 0,
        depth: 0,
        dip: 0,
        azimuth: 0,        
    });

    useEffect(() => {
    }, [collarform]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newValue = ['east', 'north', 'rl', 'depth', 'dip', 'azimuth', "id_proyecto"].includes(name)
        ? parseFloat(value) || 0
        : value;
        setCollarform((prev: TypeCollardos) => ({
            ...prev,
            [name]: newValue,
        }));
    };
    const guardarcollar = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // Aquí podrías enviar los datos a un servidor o realizar alguna acción
        //console.log("Datos del collar guardados:", collarform);
        axios.post('http://localhost:3000/collarmanager', collarform)
        .then(response => {
            console.log("Datos guardados exitosamente:", response.data.mensaje);
            console.log("el nuevo id ",response.data.id_collar)
            setCollarform((prev: TypeCollardos) => ({
            ...prev,
            id_collar: response.data.id_collar,
        }));
            // Aquí podrías manejar la respuesta del servidor, como mostrar un mensaje de éxito
        })
        .catch(error => {
            console.error("Error al guardar los datos:", error);
            // Aquí podrías manejar el error, como mostrar un mensaje de error
        });
        setCadena(Cadena + "%")///le agrego un caracter para que cambie y se ejecute el useefect
    };
    /////buscar el collar

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

useEffect(() => {
    if (Cadena.trim() === '') return; // Evita búsquedas vacías

    console.log("la cadena", Cadena);
    axios.post('http://localhost:3000/vercollares', `Cadena=${Cadena}`)
        .then(response => {
        //console.log("busqueda:", response.data.mensaje);
        if(response.data.collardata!=null){
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

    const buscacollar = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCadena(e.target.value);
        if (e.target.value === "") {
            setdatacollares([]); // Limpia resultados si el campo está vacío
            return;
        }
    }; 
    ////fin de buscar el collar
    ///poner la informacion del collar en los campos
    const editcollar = (collar: CollarData) => {
        setCollarform({
            id_collar: collar.id_collar,
            holeid: collar.holeid,
            id_proyecto: collar.id_proyecto,
            east: collar.east,
            north: collar.north,
            rl: collar.rl,
            depth: collar.depth,
            dip: collar.dip, 
            azimuth: collar.azimuth 
        });
        console.log("diste clic", collar);
    }
    ///fin de poner la informacion en los campos

    const editgeologia=(collar:CollarData)=>{
        //console.log("vamos a editar geologia",collar)
        dispatch({type:'holeid',
                    payload:{
                        holeid:{
                            id_collar:collar.id_collar,
                            holeid:collar.holeid,
                            depth:collar.depth,                            
                        }
                        
                    }}
                  )
                  navigate('/logueo'); 
    }
  return (
    <>
        <div className="shadow-md rounded-2xl fondo-claro">

            <div className="flex items-start justify-between p-5 rounded-t-2xl ">
                <h3 className="text-3xl font-semibold obsidian">
                    Barreno {collarform.holeid ? `  ${collarform.holeid}` : ''}
                </h3>                
            </div>
            <hr className='my-2 h-px border-0 bg-gradient-to-r from-transparent via-gray-400 to-transparent'></hr>
            <div className="p-6 space-y-6 rounded-b-2xl fondo-claro">
                <form action="#">
                    <div className="grid  md:grid-cols-2 lg:grid-cols-12 sm:grid-cols-2 gap-6">
                        <div className="lg:col-span-3 md:col-span-6 sm:col-span-12">
                            <label htmlFor="holeid" className="text-sm font-medium text-gray-700 block mb-2">Holeid</label>
                            <input type="text" name="holeid" id="holeid" value={collarform.holeid} onChange={handleChange}
                            className="w-full border-b-1 border-gray-400 focus:border-red-600 focus:border-b-2 outline-none transition duration-500 pt-2.5 pb-2.5 pl-1.5 uppercase" placeholder="Holeid" />
                        </div> 
                        <div className="lg:col-span-3 md:col-span-6 sm:col-span-12">
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
                       <div className="lg:col-span-3 md:col-span-6 sm:col-span-12">
                            <label htmlFor="east" className="text-sm font-medium text-gray-700 block mb-2">Este</label>
                            <input type="number" name="east" id="east" value={collarform.east} onChange={handleChange}
                            className="w-full border-b-1 border-gray-400 focus:border-red-600 focus:border-b-2 outline-none transition duration-500 pt-2.5 pb-2.5 pl-1.5" placeholder="Apple Imac 27”" />
                        </div>
                       <div className="lg:col-span-3 md:col-span-6 sm:col-span-12">
                            <label htmlFor="north" className="text-sm font-medium text-gray-700 block mb-2">Norte</label>
                            <input type="number" name="north" id="north" value={collarform.north} onChange={handleChange}
                            className="w-full border-b-1 border-gray-400 focus:border-red-600 focus:border-b-2 outline-none transition duration-500 pt-2.5 pb-2.5 pl-1.5" placeholder="Apple Imac 27”" />
                        </div>                                               
                       <div className="lg:col-span-3 md:col-span-6 sm:col-span-12">
                            <label htmlFor="rl" className="text-sm font-medium text-gray-700 block mb-2">Elevacion</label>
                            <input type="number" name="rl" id="rl" value={collarform.rl} onChange={handleChange}
                            className="w-full border-b-1 border-gray-400 focus:border-red-600 focus:border-b-2 outline-none transition duration-500 pt-2.5 pb-2.5 pl-1.5" placeholder="Apple Imac 27”" />
                        </div>
                        <div className="lg:col-span-3 md:col-span-6 sm:col-span-12">
                            <label htmlFor="deth" className="text-sm font-medium text-gray-700 block mb-2">Depth</label>
                            <input type="number" name="depth" id="depth" value={collarform.depth} onChange={handleChange}
                            className="w-full border-b-1 border-gray-400 focus:border-red-600 focus:border-b-2 outline-none transition duration-500 pt-2.5 pb-2.5 pl-1.5" placeholder="Apple Imac 27”" />
                        </div>
                        <div className="lg:col-span-3 md:col-span-6 sm:col-span-12">
                            <label htmlFor="dip" className="text-sm font-medium text-gray-700 block mb-2">Dip</label>
                            <input type="number" name="dip" id="dip" value={collarform.dip} onChange={handleChange}
                            className="w-full border-b-1 border-gray-400 focus:border-red-600 focus:border-b-2 outline-none transition duration-500 pt-2.5 pb-2.5 pl-1.5" />
                        </div>
                         <div className="lg:col-span-3 md:col-span-6 sm:col-span-12">
                            <label htmlFor="azimuth" className="text-sm font-medium text-gray-700 block mb-2">Azimuth</label>
                            <input type="number" name="azimuth" id="azimuth" value={collarform.azimuth} onChange={handleChange}
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
            <div className="">
                <div className="p-4">
                    <h2 className="text-xl  mb-4">Búsqueda de Collares</h2>
                    <input
                        type="text"
                        placeholder="Buscar por holeid..."
                        onChange={buscacollar}
                        autoComplete='off'
                        className="w-lg border-b-1 border-gray-400 focus:border-red-600 focus:border-b-2 outline-none transition duration-500 pt-2.5 pb-2.5 pl-1.5" 
                    />

                    <div className="max-h-[calc(100vh-64px)] overflow-y-auto mt-2">
                        
                        
                        {datacollares.length > 0 ? (
                            <table className="w-full table-auto text-m text-left text-gray-800">
                                <thead className="dark-navy text-lx text-gray-50 p-5 sticky top-[0px] bg-white shadow z-10">
                                <tr>
                                    <th className="px-4 py-2">HoleID</th>
                                    <th className="px-4 py-2">East</th>
                                    <th className="px-4 py-2">North</th>
                                    <th className="px-4 py-2">Rl</th>
                                    <th className="px-4 py-2">Depth</th>
                                    <th className="px-4 py-2">Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {datacollares.map((col, idx) => (
                                    <tr key={idx} className="odd:bg-white even:bg-gray-100 border-b border-gray-100">
                                        <td className="px-4 py-2">{col.holeid}</td>
                                        <td className="px-4 py-2">{col.east}</td>
                                        <td className="px-4 py-2">{col.north}</td>
                                        <td className="px-4 py-2">{col.rl}</td>
                                        <td className="px-4 py-2">{col.depth}</td>
                                        <td className="px-4 py-2">
                                            <button className="bg-green-500 text-white p-2 rounded-full mr-2" onClick={() => editcollar(col)}><FiEdit3 size={20}/></button>
                                            <button className="bg-red-500 text-white p-2  rounded-full" onClick={()=>editgeologia(col)}><FiTrash2 size={20}/></button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            ) : (
                            <p className="text-center text-gray-400 mt-4">No se encontraron resultados.</p>
                            )}
                        
                    </div>
                </div>
            </div>
            

        </div>
    </>
  );
};

export default Collarppl;



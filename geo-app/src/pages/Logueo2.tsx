import {  useState,useEffect,useMemo } from 'react';
import axios from "axios";
import AutocompleteSimple from '../components/Autocomplete';
import { useGeo } from '../hooks/useGeoContext';

import { FiEdit3 } from 'react-icons/fi';

const datos = {
  litologia: [
    { id_opcion: 1, descripcion: 'Caliza' },
    { id_opcion: 2, descripcion: 'Arcilla' },
  ],
  estructura: [
    { id_opcion: 1, descripcion: 'Fractura' },
    { id_opcion: 2, descripcion: 'Pliegue' },
  ],
  zona: [
    { id_opcion: 1, descripcion: 'Norte' },
    { id_opcion: 2, descripcion: 'Sur' },
  ],
 
};

type Registro = {
  id_geology: number | null;
  id_collar: number | null;
  geolfrom: number;
  geolto: number;  
  id_lithology: number | null;
  id_structure: number | null;
  id_zone: number | null;
  geo_comments: string | null;
};

const Logueo2 = () => {
 const {state}=useGeo()
 const[actualizar,setActualizar]=useState(false)
 const [esvalido, setEsValido] = useState(false);
 const [registro, setRegistro] = useState<Registro>({
    id_geology: null,
    id_collar: state.holeid.id_collar,  
    geolfrom:0,
    geolto:0,  
    id_lithology: null,
    id_structure: null,
    id_zone: null,
    geo_comments:null,  
  });
  const [lista, setLista] = useState<Registro[]>([]);
  
  useMemo(() => {
    setRegistro((prev) => ({
      ...prev,
      id_collar: state.holeid.id_collar,
    }));
  }, [state.holeid.id_collar]);
  
  const handleChange = (name: string, value: number | string | null) => {
    setRegistro((prev) => ({ ...prev, [name]: value }));
    //console.log("cambio", name, value, registro);
  };

  /* Simula clic en un registro cargado desde backend
  const cargarRegistro = (e:React.FormEvent)=>{
          e.preventDefault() 
    setRegistro({
      geolfrom:0.0,
      geolto:3.05,
      id_registro: 5,
      litologia: 2,
      estructura: 10,
      zona: 101,
      min_py:1,
    });
  };*/

 
  const guardarLog=(e:React.FormEvent)=>{
    e.preventDefault()
   setActualizar(false)
    console.log("guardar", registro);
    axios.post('http://localhost:3000/geologymanager', registro)
      .then(response => {
        
        console.log("respuesta", response.data);
        if (response.data.success) {
          setLista([]);
          reinicia();
          setActualizar(true)
        } else {
          console.error("Error al guardar los datos:", response.data.mensaje);          
          setActualizar(true)
        }
      })
      .catch(error => {
        console.error("Error al guardar los datos:", error);
      });
      
    
  }
////useEffect para validar el registro
  useEffect(() => {
    //valido si hay collar
    
      
    if (registro.id_collar === null || registro.id_collar <= 0) {
      console.error("no hay collar")
      setEsValido(false);
      return;
    }
    if (registro.geolfrom === null || registro.geolto === null) {
      setEsValido(false);
      return;
    }
    const intervalo=registro.geolto-registro.geolfrom
    if(intervalo<=0){
      setEsValido(false)
      console.error("el intervalo debe ser mayor que 0")
      return
    }
    
    if(registro.id_lithology==null || registro.id_lithology==0){
      setEsValido(false)      
      return
    }
    if(lista.length>0){
      console.log("validando lista",lista)
      for (let i=0;i<lista.length;i++){
        const item=lista[i]
        if(registro.id_geology==item.id_geology){
          //console.log("no eval",registro)
        }
        else{
          if((item.geolfrom<=registro.geolfrom && registro.geolto<=item.geolto)||
            (registro.geolfrom<=item.geolfrom && item.geolto<=registro.geolto)
            
            )
          {
            setEsValido(false)
            console.error("hay gap entre ",item.geolfrom, " a ", item.geolto, " nuevo ", registro.geolfrom, " a ", registro.geolto)
            return;
          }
          else{
            console.log("bien")
            setEsValido(true)
          }
        }
      }
      
   }
   console.log("bien")
    setEsValido(true)
    
  }, [registro,actualizar]);

  ////fin de useEffect para validar el registro
////busco la informacion del logueo
useEffect(() => {
    if (state.holeid.id_collar<=0){
      setLista([])
      return;
    } // Evita búsquedas vacías

    
    axios.post('http://localhost:3000/vergeology', `id_collar=${state.holeid.id_collar}`)
        .then(response => {
        //console.log("busqueda:", response.data.message);
        if(response.data.geologydata!=null){
            //console.log("la data",response.data.geologydata)
            setLista(response.data.geologydata)
        }
        else{
          console.log("no trajo nada",state.holeid.id_collar)
            setLista([])
        }
        
        ///setdatacollares(response.data.collardata)
        //console.log(datacollares)
        // aquí puedes actualizar el state con los datos si es necesario
        })
        .catch(error => {
        console.error("Error al guardar los datos:", error);
        });
        console.log(lista)
    }, [state.holeid.id_collar,actualizar]);

    
    ////fin de buscar el collar
///fin de buscar la informacion del logueo
    
////editar geology

    const editgeology = (geology: Registro) => {
        setRegistro({
            id_collar: geology.id_collar,
            id_geology: geology.id_geology,
            geolfrom: geology.geolfrom,
            geolto:geology.geolto,
            id_lithology:geology.id_lithology,
            id_structure:geology.id_structure,
            id_zone:geology.id_zone,
            geo_comments: geology.geo_comments            
        });
        //console.log("diste clic", geology);
    }
///fin de editar collar
////reiniciar registro
    const reinicia = () => {
        setRegistro({
            id_geology: null,
            id_collar: state.holeid.id_collar,  
            geolfrom: 0,
            geolto: 0,  
            id_lithology: 0,
            id_structure: 0,
            id_zone: 0,
            geo_comments: null,
        });
    }
return(
    <>
    <div className="p-4 space-y-4 bg-gray-50 h-full">
      {state.holeid.holeid}{" - "}{state.holeid.id_collar}{" - Profundidad: "}{state.holeid.depth}{" m --"}{state.holeid.tipo_survey }{state.holeid.id_proyecto}
      <form onSubmit={guardarLog}>
    
        <input
          id="geolfrom"
          name="geolfrom"
          type="number"
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
          placeholder="Inicio"        
          onChange={(e) => handleChange(e.target.name, e.target.value === '' ? null : Number(e.target.value))}
          value={registro.geolfrom || 0}
        />
        <input
          id="geolto"
          name="geolto"
          type="number"
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
          placeholder="Inicio"        
          onChange={(e) => handleChange(e.target.name, e.target.value === '' ? null : Number(e.target.value))}
          value={registro.geolto||0}
          autoComplete='FALSE'
        />
        <AutocompleteSimple
          name="id_lithology"
          value={registro.id_lithology}
          onChange={handleChange}
          opciones={datos.litologia}
          placeholder="Buscar litología"
          
        />

        <AutocompleteSimple
          name="id_structure"
          value={registro.id_structure}
          onChange={handleChange}
          opciones={datos.estructura}
          placeholder="Buscar estructura"
        />

        <AutocompleteSimple
          name="id_zone"
          value={registro.id_zone}
          onChange={handleChange}
          opciones={datos.zona}
          placeholder="Buscar zona"
        />
        <input
          id="geo_comments"
          name="geo_comments"
          type="text"
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
          placeholder="Comentarios"        
          onChange={(e) => handleChange(e.target.name, e.target.value === '' ? null : e.target.value)}
          value={registro.geo_comments || ""}
        />
       
        <input
          type="submit"
          className="w-1/4  py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 transition duration-300 disabled:bg-gray-500"                  
          value="Guardar"
          disabled={!esvalido}
        />
        <input
          type="button"
          className="w-1/4  py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 transition duration-300 disabled:bg-gray-500"                  
          value="Nuevo"
          onClick={reinicia}
        />       
      </form>
       <div>
      <div className="list-group">
        <table>
          <tbody>
              {lista.map((col, idx) => (
                  <tr key={idx} className="odd:bg-white even:bg-gray-100 border-b border-gray-100">
                      <td className="px-4 py-2">{col.geolfrom}</td>
                      <td className="px-4 py-2">{col.geolto}</td>
                      <td className="px-4 py-2">{col.id_lithology}</td>
                      <td className="px-4 py-2">{col.id_structure}</td>
                      <td className="px-4 py-2">{col.id_zone}</td>
                      <td className="px-4 py-2">{col.geo_comments}</td>
                      <td className="px-4 py-2">
                        <button className="bg-green-500 text-white p-2 rounded-full mr-2" onClick={() => editgeology(col)}><FiEdit3 size={20}/></button>  
                      </td>
                  </tr>
              ))}
          </tbody>
        </table>       
      </div>
    </div>
    </div>
   
    </>
  );
}

export default Logueo2;

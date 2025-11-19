import { useGeo } from '../hooks/useGeoContext';

import { Catalogo } from '../components/Catalogo';
import{TituloForm,Tituloerrores} from '../components/TituloForms';
import AutocompleteSimple from '../components/Autocomplete';
import { ObtenerGaps } from '../components/Gaps';
import {
  DynamicFormGrid,
  type FieldConfig,
    type RecordData,
    type ActionConfig,
    type ActionFunctions,
}from "../components/Dynamic-form-grid"

import { Modal,Tooltip,Empty,notification  } from "antd";




import { BsSave } from 'react-icons/bs';
import { BsPlusLg } from 'react-icons/bs';
import { BsXLg } from 'react-icons/bs';
import { BsExclamationLg } from 'react-icons/bs';
import { BsCheckLg } from 'react-icons/bs';
import { AiOutlineInfo } from 'react-icons/ai';



import axios from "axios";
import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from "react"
////type para los registros de geologia
type Registro = {
  id_geology: number ;
  id_collar: number | null;
  geolfrom: string;
  geolto: string;  
  id_lithology: string | null;
  id_structure: number | null;
  id_zone: number | null;
  geo_comments: string | null;
};
export type Gapgeo = {
  inicio: number;
  fin: number;
};
///type para el formulario
type GeologicalRecord = {
  id_geology: number
  id_collar: number
  geolfrom: string
  geolto: string
  id_lithology: number
  id_structure: number
  id_zone: number
  geo_comments: string
}
////type Registro = {
  



export const Logueo = () => {
 const [actualizar,setActualizar]=useState(false)   
 const {state}=useGeo()
 const [geologia, setGeologia] = useState<Registro[]>([]);///arreglo para guardar todos los registros de geologia del collar
 // Define the Gap type if not already imported
 // type Gap = { from: number; to: number; [key: string]: any }; // <-- adjust as needed
  
  const [geogaps, setGeogaps] = useState<Gapgeo[]>([]);///arreglo para guardar los gaps encontrados

///
// saco todos los catalogos del componente catalogo
var cat_litologia=Catalogo( "lithology")
const opciones_lith = cat_litologia.catalogo.map(item => ({
  id_opcion: item.id,
  descripcion: item.nombre
}));
var cat_estructura=Catalogo( "structure")
const opciones_struct = cat_estructura.catalogo.map(item => ({
  id_opcion: item.id,
  descripcion: item.nombre
}));
var cat_zona=Catalogo( "zone")
const opciones_zona = cat_zona.catalogo.map(item => ({
  id_opcion: item.id,
  descripcion: item.nombre
}));


  const [formData, setFormData] = useState<GeologicalRecord>({
    id_collar: state.holeid.id_collar, 
    id_geology: 0,
     geolfrom: "" ,
     geolto: "",
     id_lithology: 0,
     id_structure: 0,
     id_zone: 0,
     geo_comments: "",
   })
 /*Codigo para el modal */
      const [isModalOpen, setIsModalOpen] = useState(false);

      const showModal = () => {
        setFormData({
          id_collar: state.holeid.id_collar,
          id_geology:0,
          geolfrom: "",
          geolto: "",
          id_lithology: 0,
          id_structure: 0,
          id_zone: 0,
          geo_comments: "",
        })
        setIsModalOpen(true);
        
      };

      const handleOk = () => {
        setIsModalOpen(false);
      };

      const handleCancel = () => {
        setIsModalOpen(false);
      };
/*Fin codigo modal*/

/*codigo para la notificacion */

type TipoNotificacion = 'exito' | 'alerta' | 'error' | 'info';

const [api, contextHolder] = notification.useNotification();
const openNotification = (mensaje:string, tipo: TipoNotificacion) => {
  const iconos = {
    exito: <BsCheckLg size={30} color="green" />,
    alerta: <BsExclamationLg size={30} color="orange" />,
    error: <BsXLg size={30} color="red" />,
    info: <AiOutlineInfo size={30} color="blue" />
  };
    api.open({
      message: 'Notificacion',
      description: mensaje,
      className: 'custom-class',
      placement: 'top',
      icon: iconos[tipo],
      style: {
        width: 600,
      },
    });
  };
/*fin de codigo para notificacion */

/*codigo que genera las referencias */
  const geolfromRef = useRef<HTMLInputElement>(null)
  const geoltoRef = useRef<HTMLInputElement>(null)
  const litologiaRef = useRef<HTMLInputElement>(null)
  const estructuraRef = useRef<HTMLInputElement>(null)
  const zonaRef = useRef<HTMLInputElement>(null)
  const comentarioRef = useRef<HTMLTextAreaElement>(null)
/*Fin codigo referencias*/
/*codigo para brincar entre los campos con enter o con tab */
const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, currentField: string) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault()
      
      switch (currentField) {
        case "geolfrom":
          geoltoRef.current?.focus()
          break
        case "geolto":
          litologiaRef.current?.focus()
          break
        case "litologia":
          estructuraRef.current?.focus()
          break
        case "estructura":
          zonaRef.current?.focus()
          break
        case "zona":
          comentarioRef.current?.focus()
          break
        case "comentario":
          saveRecord()
          break
      }
    }
  }
/*fin de codigo para brincar entre codigos */


/*Codigo para guardar el formulario*/
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()    
  }
/*Fin codigo guardar formulario*/

/*guardo el registro */
const saveRecord = () => {

    ///primero valido los campos obligatorios


  if (Number(formData.geolfrom) == 0 && Number(formData.geolto) <= 0) {
    openNotification("Falta alguno de los valores necesarios", "error");
    return;
  }

  if (Number(formData.geolfrom) >= Number(formData.geolto)) {
    openNotification("El valor de 'Geol From' debe ser menor que el de 'Geol To'", "error");
    return;
  }

  for (const geo_item of geologia) {
    if (geo_item.id_geology != formData.id_geology) {
      if (geo_item.geolfrom === formData.geolfrom) {
        openNotification("Error inicio", "error");
        return;
      }
      if (geo_item.geolto === formData.geolto) {
        openNotification("Error final", "error");
        return;
      }
      if (
        Number(formData.geolto) > Number( geo_item.geolfrom) &&
        Number(formData.geolto) < Number(geo_item.geolto)
      ) {
        openNotification("Error overlap final"+formData.geolfrom+ " "+ geo_item.geolfrom+ " "+ geo_item.geolto + " " +formData.geolto, "error");
        return;
      }
      if (
        formData.geolfrom < geo_item.geolfrom &&
        formData.geolto > geo_item.geolto
      ) {
        openNotification("Error overlap en medio", "error");
        return;
      }
      if (
        formData.geolfrom >= geo_item.geolfrom &&
        formData.geolfrom < geo_item.geolto
      ) {
        openNotification(
          `Error overlap inicio ${formData.id_geology} vs ${geo_item.id_geology}`,
          "error"
        );
        return;
      }
    }
  }

     guardarRegistroEnBD  ();    
    ////si es nuevo solo actualizo el estado para que recargue los registros
    if(formData.id_geology==0){
      //console.log("es nuevo")
      setFormData({
        id_collar: state.holeid.id_collar,
        id_geology:0,
        geolfrom: formData.geolto,
        geolto: "",
        id_lithology: 0,
        id_structure: 0,
        id_zone: 0,
        geo_comments: "",
      })
       geoltoRef.current?.focus()

    }
    else{
      console.log("es actualizacion")
    }
    
}
/*fin de guardar el registro */

///funcion para guardar en la base de datos el registro

///fin de funcion guardar registro
const guardarRegistroEnBD = () => {
  setActualizar(false)
    console.log("guardar", formData);
    const dataToSend = {
    ...formData,
    id_collar: Number(formData.id_collar),
    id_geology: Number(formData.id_geology),
    geolfrom: Number(formData.geolfrom),
    geolto: Number(formData.geolto),
    id_lithology: Number(formData.id_lithology),
    id_structure: Number(formData.id_structure),
    id_zone: Number(formData.id_zone),
  };

    axios.post('http://localhost:3000/geologymanager', dataToSend)
      .then(response => {
        
        console.log("respuesta", response.data);
        if (response.data.success) {
          setGeologia([]);
          setinitialrecord([]);          
          setActualizar(true)
          setGeogaps([])
          openNotification("Registro guardado con exito", "exito"
        );
        } else {
          console.error("Error al guardar los datos:", response.data.mensaje);          
          setActualizar(true)
        }
      })
      .catch(error => {
        console.error("Error al guardar los datos:", error);
      });
     
};
/*Codigo para manejar el enter y cambiar de campo*/
  const handleChange = (field: keyof GeologicalRecord, value:  number | string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  const handleChangeau = (name: string, value: number | string | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    //console.log("cambio", name, value, registro);
  };
/* */

/*Si existe el holeid busco los registros de geologia*/  
//busco la informacion del logueo
useEffect(() => {
    if (state.holeid.id_collar<=0){
      setGeologia([])
      setinitialrecord([])
      setGeogaps([])
      return;
    } // Evita búsquedas vacías

    
    axios.post('http://localhost:3000/vergeology', `id_collar=${state.holeid.id_collar}`)
        .then(response => {
        //console.log("busqueda:", response.data.message);
        if(response.data.geologydata!=null){
            console.log("la data",response.data.geologydata)
            setGeologia(response.data.geologydata)
            setinitialrecord(response.data.geologydata)
            setGeogaps(ObtenerGaps(response.data.geologydata,state.holeid.depth))
        }
        else{
          console.log("no trajo nada",state.holeid.id_collar)
            setGeologia([])
            setinitialrecord([])
            setGeogaps([])
        }
        
        ///setdatacollares(response.data.collardata)
        //console.log(datacollares)
        // aquí puedes actualizar el state con los datos si es necesario
        })
        .catch(error => {
        console.error("Error al guardar los datos:", error);
        });
        console.log("datos de geologia",geologia)
        console.log("datos de geologia asd asd",initialRecords)
        ///ver los

        //busco los gaps
       
        
    }, [state.holeid.id_collar, actualizar]);    
////fin de buscar el collar

/*configuracion del grid */
 const fieldConfig: FieldConfig[] = [
    {
      id: "geolfrom",
      label: "Inicio",
      type: "text",
      required: true,
    },
    {
      id: "geolto",
      label: "fin",
      type: "text",
      required: true,
    },
   
  
    {
      id: "id_lithology",
      label: "Litologia barreno",
      type: "select",
      required: false,
      options:opciones_lith,
    },
    {
      id: "id_structure",
      label: "Estructura",
      type: "select",
      required: false,
      options: opciones_struct,
    },
    {
      id: "id_zone",
      label: "Zona",
      type: "select",
      required: false,
      options:opciones_zona,
    },

  ]

  // Datos iniciales (pueden estar vacíos o pre-poblados)
  const [initialRecords,setinitialrecord]=useState<RecordData[]>([])
 

  const actions: ActionConfig[] = [
    {
      nombreFuncion: "guardar",
      icono: "BsCheckLg",
      texto: "",
      texto_ayuda: "Guarda los cambios realizados en este registro",
      color: "primary",
    },
    {
      nombreFuncion: "ver",
      icono: "BsPencil",
      texto: "",
      texto_ayuda: "Muestra todos los valores del registro",
      color: "secondary",
    },
    {
      nombreFuncion: "eliminar",
      icono: "BsXLg",
      texto: "",
      texto_ayuda: "Elimina permanentemente este registro",
      color: "danger",
    },
  ]

  const actionFunctions: ActionFunctions = {
    guardar: (record: RecordData) => {
      //console.log("Guardando registro:", record)
      //alert(`Registro guardado:\n${JSON.stringify(record, null, 2)}`)
      ///valido el record
      if(!record.geolfrom || !record.geolto){
        alert("Los campos de inicio y fin son obligatorios.")
        return
      }
      if(Number(record.geolfrom) >= Number(record.geolto)){
        alert("El valor de 'Inicio' debe ser menor que el valor de 'Fin'.")
        return
      }
setActualizar(false)
    console.log("guardar", record);
    const dataToSend = {
    ...record,
    id_collar: Number(record.id_collar),
    id_geology: Number(record.id_geology),
    geolfrom: Number(record.geolfrom),
    geolto: Number(record.geolto),
    id_lithology: Number(record.id_lithology),
    id_structure: Number(record.id_structure),
    id_zone: Number(record.id_zone),
  };

    axios.post('http://localhost:3000/geologymanager', dataToSend)
      .then(response => {
        
        console.log("respuesta", response.data);
        if (response.data.success) {
          setGeologia([]);
          setinitialrecord([]);          
          setActualizar(true)
          setGeogaps([])
          openNotification("Registro guardado con exito", "exito"
        );
        } else {
          console.error("Error al guardar los datos:", response.data.mensaje);          
          setActualizar(true)
        }
      })
      .catch(error => {
        console.error("Error al guardar los datos:", error);
      });
      
    },
    ver: (record: RecordData) => {
      Object.entries(record)
        .map(([key, value]) =>setFormData((prev) => ({ ...prev, [key]: value })))
        
        
        console.log("Mostrando registro:", FormData)
        setIsModalOpen(true);

        //alert(`Valores del registro:\n\n${valores}`)
    },
    eliminar: (record: RecordData) => {
      if (confirm("¿Estás seguro de eliminar este registro?")) {
        console.log("Eliminando registro:", record)
        alert("Registro eliminado (simulado)")
      }
    },
  }

 /* const handleSave = (records: RecordData[]) => {
    console.log("Datos guardados:", records)
  }*/
    return(
        <>
        {contextHolder}
        <div className="p-4 space-y-4 bg-gray-50 h-full">
          {state.holeid.id_collar ===0?
              <div className="MontserratSemiBold w-full pl-2 flex flex-col sm:flex-row  gap-4  justify-center items-center" >
                 Debes seleccionar un collar para ver o agregar registros geológicos.
                </div>
          :                    
            <div className="w-full pl-2 flex flex-col sm:flex-row  gap-4 items-center justify-between">
              
              <div className="flex flex-col sm:flex-row  gap-4 items-center">
                
                  <TituloForm titulo="Geología" holeid={state.holeid.holeid} proyecto={state.holeid.proyecto} depth={state.holeid.depth} azimuth={state.holeid.azimuth} dip={state.holeid.dip}/>
                  <div className="flex flex-col space-y-1">
                    <Tooltip placement="right" title={"Agregar registro litologico" } arrow>
                      <button
                            onClick={showModal}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold p-3 rounded-full flex items-center "
                          >
                            <BsPlusLg size={35} />
                        </button>
                    </Tooltip>
                    
                  </div>
              </div>
              <div className="flex flex-col sm:flex-row  gap-4 items-center">
                <Tituloerrores registros={geologia.length} gaps={geogaps}/>
               
              </div>
            </div>
          }
      <Modal
       title="Captura de Registro Geologico"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}        
        width={"75%"}
        footer={null}
        style={{top:'10%',left:'7%'}}        
      >
 <form onSubmit={handleSubmit} className="space-y-4">
          {/* Geol From y Geol To */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <label htmlFor="geolfrom" className="text-sm font-medium text-foreground">
                  Geol From
                </label>
              </div>
              <input
                ref={geolfromRef}
                type="number"
                id="geolfrom"
                value={formData.geolfrom}
                onChange={(e) => handleChange("geolfrom", e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, "geolfrom")}
                className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <div>
                <label htmlFor="geolto" className="text-sm font-medium text-foreground">
                  Geol To
                </label>
              </div>
              <input
                ref={geoltoRef}
                type="number"
                id="geolto"
                value={formData.geolto}
                onChange={(e) => handleChange("geolto", e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, "geolto")}
                className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Litología */}
          <div className="space-y-2">
            <div>
              <label htmlFor="litologia" className="text-sm font-medium text-foreground">
                Litología
              </label>
            </div>
            <AutocompleteSimple
              
              name="id_lithology"
              value={formData.id_lithology}
              onChange={handleChangeau}
              onKeyDown={(e) => handleKeyDown(e, "litologia")}
              ref={litologiaRef}
              opciones={opciones_lith}
              placeholder="Buscar litología"
                           
            />
           {/* <input
              ref={litologiaRef}
              type="text"
              id="litologia"
              value={formData.id_lithology}
              onChange={(e) => handleChange("id_lithology", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "litologia")}
              className="w-full px-4 py-2.5 bg-background border border-gray-400  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              placeholder="Ej: Arcilla, Arena, Grava"
            />*/}
          </div>

          {/* Estructura */}
          <div className="space-y-2">
            <div>
              <label htmlFor="estructura" className="text-sm font-medium text-foreground">
                Estructura
              </label>
            </div>
              <AutocompleteSimple              
                name="id_structure"
                value={formData.id_structure}
                onChange={handleChangeau}
                onKeyDown={(e) => handleKeyDown(e, "id_structure")}
                ref={estructuraRef}
                opciones={opciones_struct}
                placeholder="Buscar structura"                             
              />
            {/*
            <input
              ref={estructuraRef}
              type="text"
              id="estructura"
              value={formData.id_structure}
              onChange={(e) => handleChange("id_structure", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "estructura")}
              className="w-full px-4 py-2.5 bg-background border border-gray-400  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              placeholder="Descripción de la estructura"
            />*/}
          </div>

          {/* Zona */}
          <div className="space-y-2">
            <div>
              <label htmlFor="zona" className="text-sm font-medium text-foreground">
                Zona
              </label>
            </div>
            <AutocompleteSimple              
                name="id_zone"
                value={formData.id_zone}
                onChange={handleChangeau}
                onKeyDown={(e) => handleKeyDown(e, "id_zone")}
                ref={zonaRef}
                opciones={opciones_zona}
                placeholder="Buscar zona"                             
              />
           {/*  <input
              ref={zonaRef}
              type="text"
              id="zona"
              value={formData.id_zone}
              onChange={(e) => handleChange("id_zone", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "zona")}
              className="w-full px-4 py-2.5 bg-background border border-gray-400  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              placeholder="Zona geográfica"
            />
            */}
          </div>

          {/* Comentario */}
          <div className="space-y-2">
            <div className=""><label htmlFor="comentario" className="text-sm font-medium text-foreground p-x">
              Comentario
            </label>
            </div>
            <textarea
              ref={comentarioRef}
              id="comentario"
              rows={4}
              value={formData.geo_comments}
              onChange={(e) => handleChange("geo_comments", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "comentario")}
              className="w-full px-4 py-2.5 bg-background border border-gray-400  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
              placeholder="Observaciones adicionales..."
            />
          </div>

         

          {/* Botones */}
          <div className="w-full pl-2 flex flex-col sm:flex-row  gap-4 items-center justify-end ">
            
            <button
              type="button"
              onClick={() => { saveRecord()}}
              className={"MontserratReg flex items-center w-1/8 justify-center gap-2 pt-2 pb-1 rounded-md  text-white text-lg MontserratReg transition-colors duration-300 bg-blue-600 hover:bg-blue-800 "}>
                    Guardar <BsSave size={20} />
              </button>
            <button
              className={"flex items-center w-1/8 justify-center gap-2 pt-2 pb-1 rounded-md  text-white text-lg MontserratReg transition-colors duration-300 bg-red-600 hover:bg-red-800 "}
              type="button"
              onClick={() => {
                setFormData({
                  id_collar: state.holeid.id_collar,
                  id_geology:0,
                  geolfrom: "",
                  geolto: "",
                  id_lithology: 0,
                  id_structure: 0,
                  id_zone: 0,
                  geo_comments: "",
                },)
                handleOk();
                geolfromRef.current?.focus()
                
              }}
              
            >
              Cancelar<BsXLg size={22}/>
            </button>
          </div>
        </form>
      </Modal>


      <hr className='my-2 h-px border-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent'></hr>

      {initialRecords.length==0?
            <Empty description="No hay registros geológicos disponibles" className="mt-10"/>
         :
          <DynamicFormGrid
          config={fieldConfig}
          initialRecords={initialRecords}
          actions={actions}
          actionFunctions={actionFunctions}
          //onSave={handleSave}
        />
         }      
      
    
              
                
            
    </div>    
    </>
    )
}


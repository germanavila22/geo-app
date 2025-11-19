import  { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';

import{TituloForm,Tituloerrores} from '../components/TituloForms';

import {
  DynamicFormGrid,
  type FieldConfig,
    type RecordData,
    type ActionConfig,
    type ActionFunctions,
}from "../components/Dynamic-form-grid"

import { BsSave } from 'react-icons/bs';
import { BsPlusLg } from 'react-icons/bs';
import { BsXLg } from 'react-icons/bs';
import { BsExclamationLg } from 'react-icons/bs';
import { BsCheckLg } from 'react-icons/bs';
import { AiOutlineInfo } from 'react-icons/ai';

import { Modal,Tooltip,Empty,notification  } from "antd";

import { useGeo, } from '../hooks/useGeoContext';
import axios from 'axios';

const Survey = () => {
    const {state}= useGeo()
    const [actualizar, setActualizar] = useState(false);
    const [survey, setSurvey] = useState<FormData[]>([])
    interface FormData {
        id_survey: number;
        id_collar: number;
        depth: string;
        dip: string;
        azimuth: string;
        id_type: string;
        fecha: string;
        estatus: string;
        comentarios: string;
    }
    const getCurrentDate = () => {
        const today = new Date()
        return today.toISOString().split("T")[0]
    }

    const [formData, setFormData] = useState<FormData>({
        id_collar:state.holeid.id_collar,
        id_survey: 0,
        depth: '',
        dip: '',
        azimuth: '',
        id_type: '',
        fecha: getCurrentDate(),
        estatus: '',
        comentarios: '',
    })

/* jalo catalogo de tipos de azimyh*/
const opciones_type=[
    {id_opcion:1, descripcion:"Magnetico"},
    {id_opcion:2, descripcion:"Solar"},
    {id_opcion:3, descripcion:"Grid Norte"},
]

    /*Codigo para guardar el formulario*/
      const handleSubmit = (e: FormEvent) => {
        e.preventDefault()    
      }
    /*Fin codigo guardar formulario*/
    const handleChange = (field: keyof FormData, value:  number | string | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

     /*Codigo para el modal */
      const [isModalOpen, setIsModalOpen] = useState(false);

      const showModal = () => {
        setFormData((prev) => ({
            ...prev,
            id_collar: state.holeid.id_collar, 
            id_survey: 0,
            depth: '',
            dip: '',
            azimuth: '',
            id_type: '',
            fecha: getCurrentDate(),
            estatus: '',
            comentarios: '',
        })); 
        setIsModalOpen(true);
            
        };

        const handleOk = () => {
            setIsModalOpen(false);
        };

        const handleCancel = () => {
            setIsModalOpen(false);
        };
    /*Fin codigo modal*/
    /*Codigo para las notificaciones */
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
    


    /*codigo para brincar entre los campos con enter o con tab */
    const depthRef = useRef<HTMLInputElement>(null)
    const azRef = useRef<HTMLInputElement>(null)
    const dipRef = useRef<HTMLInputElement>(null)
    const typeRef = useRef<HTMLSelectElement>(null)
    const fechaRef = useRef<HTMLInputElement>(null)
    const comentarioRef = useRef<HTMLInputElement>(null)


    
     const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, currentField: string) => {
        if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault()
          
          switch (currentField) {
            case "depth":
              azRef.current?.focus()
              break
            case "azimuth":
              dipRef.current?.focus()
              break
            case "dip":
              typeRef.current?.focus()
              break
            case "id_type":
              fechaRef.current?.focus()
              break
            case "fecha":
              comentarioRef.current?.focus()
              break
            case "comentarios":
              saveRecord()
            break
          }
        }
      }
      /*fin de codigo para brincar entre codigos */
    /* */
    //busco la informacion del logueo
useEffect(() => {
    
    if (state.holeid.id_collar<=0){
      setSurvey([])
      setinitialrecord([])
      return;
    } // Evita búsquedas vacías

    
    axios.post('http://localhost:3000/Surveyview', `id_collar=${state.holeid.id_collar}`)
        .then(response => {
        //console.log("busqueda:", response.data.message);
        if(response.data.surveydata!=null){
            console.log("la data",response.data.surveydata)
            setSurvey(response.data.surveydata)
            setinitialrecord(response.data.surveydata)
                       
        }
        else{
          console.log("no trajo nada",state.holeid.id_collar)
            setSurvey([])
            setinitialrecord([])
            
        }                
        // aquí puedes actualizar el state con los datos si es necesario
        })
        .catch(error => {
        console.error("Error al guardar los datos:", error);
        });
        console.log("datos de geologia",survey)
        //console.log("datos de geologia asd asd",initialRecords)
        ///ver los

        //busco los gaps
       
        
    }, [state.holeid.id_collar, actualizar]);    
    ////fin de buscar el collar

    /*codigo para guardar survey*/  
    const saveRecord = () => {
        setActualizar(true)
        console.log("Guardando registro...", formData)
        const dataToSend = {
            ...formData,
            id_collar: Number(formData.id_collar),
            id_survey: Number(formData.id_survey),
            depth: parseFloat(formData.depth),
            dip: parseFloat(formData.dip),
            azimuth: parseFloat(formData.azimuth),
            id_type: parseInt(formData.id_type),
            estatus: parseInt(formData.estatus),
            fecha: formData.fecha,
            comentarios: formData.comentarios,
        };

    axios.post('http://localhost:3000/surveymanager', dataToSend)
      .then(response => {
        
        console.log("respuesta", response.data);
        if (response.data.success) {
         
          setActualizar(true)
         
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
      ///si el id del survey es mayor a 0 es una actualizacion
      if(formData.id_survey>0){
        setIsModalOpen(false);
      }
      /*reinicio los valores  */
        setFormData({
            id_collar: state.holeid.id_collar,
            id_survey: 0,
            depth: '',
            dip: '',
            azimuth: '',
            id_type: '',
            fecha: getCurrentDate(),
            estatus: '',
            comentarios: '',
        },)        
        depthRef.current?.focus()
        setActualizar(false)
    }

    /*fin codigo guardar survey*/
/**codigo para generar el grid */
    /*configuracion del grid */
    const fieldConfig: FieldConfig[] = [
    {
      id: "depth",
      label: "Profundidad",
      type: "text",
      required: true,
    },
    {
      id: "azimuth",
      label: "Azimuth",
      type: "text",
      required: true,
    },
   
  
    {
      id: "dip",
      label: "Dip",
      type: "text",
      required: false,
      
    },
    {
      id: "id_type",
      label: "Tipo de azimuth",
      type: "select",
      required: false,
      options: opciones_type,
    }
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

          setinitialrecord([]);          
          setActualizar(true)
          
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
      const formattedRecord: any = {};

        Object.entries(record as any).forEach(([key, value]: [string, any]) => {
            if (value instanceof Date) {
            // Si ya es un objeto Date
            formattedRecord[key] = value.toISOString().split("T")[0];
            } else if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}/)) {
            // Si es un string con formato de fecha "YYYY-MM-DD"
            formattedRecord[key] = value.split("T")[0];
            } else {
            formattedRecord[key] = value;
            }
        });

        // Actualizamos todo el formulario en una sola llamada
        setFormData((prev) => ({
            ...prev,
            ...formattedRecord,
        }));
        
        
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
    /*fin generar el grid */
    return (
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
                
                  <TituloForm titulo="Survey" holeid={state.holeid.holeid} proyecto={state.holeid.proyecto} depth={state.holeid.depth} azimuth={state.holeid.azimuth} dip={state.holeid.dip}/>
                  <div className="flex flex-col space-y-1">
                    <Tooltip placement="right" title={"Agregar registro de survey" } arrow>
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
                <Tituloerrores registros={survey.length} gaps={[]} />
               
              </div>
            </div>
          }

          <Modal
       title="Captura de registro de survey"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}        
        width={"75%"}
        footer={null}
        style={{top:'10%',left:'7%'}}        
        >
        <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                    <div>
                        <label htmlFor="depth" className="text-sm font-medium text-foreground">
                        Profunidad
                        </label>
                    </div>
                    <input
                        ref={depthRef}
                        type="number"
                        id="depth"
                        value={formData.depth}
                        onChange={(e) => handleChange("depth", e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, "depth")}
                        className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                        placeholder="0.00"/>
                </div>
                <div className="space-y-2">
                    <div>
                        <label htmlFor="azimuth" className="text-sm font-medium text-foreground">
                        Azimuth
                        </label>
                    </div>
                    <input
                        ref={azRef}
                        type="number"
                        id="azimuth"
                        min={0}
                        max={360}
                        value={formData.azimuth}
                        onChange={(e) => handleChange("azimuth", e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, "azimuth")}
                        className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                        placeholder="0.00"/>
                </div>
                <div className="space-y-2">
                    <div>
                        <label htmlFor="dip" className="text-sm font-medium text-foreground">
                        Dip
                        </label>
                    </div>
                    <input
                        ref={dipRef}
                        type="number"
                        id="dip"
                        value={formData.dip}
                        onChange={(e) => handleChange("dip", e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, "dip")}
                        className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                        placeholder="0.00"/>
                </div>
                <div className="space-y-2">
                    <div>
                        <label htmlFor="id_type" className="text-sm font-medium text-foreground">
                        Tipo
                        </label>
                    </div>
                    <select
                        ref={typeRef}
                        
                        id="id_type"
                        value={formData.id_type}
                        onChange={(e) => handleChange("id_type", e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, "id_type")}
                        className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                       >
                        <option value="">Selecciona un tipo</option>
                        <option value="1">Magnetico</option>
                        <option value="2">Solar</option>
                        <option value="3">Grid Norte</option>
                    </select>
                </div>                
            </div>
            <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                    <div>
                        <label htmlFor="fecha" className="text-sm font-medium text-foreground">
                        Fecha
                        </label>
                    </div>
                    <input
                        ref={fechaRef}
                        type="date"
                        id="fecha"
                        value={formData.fecha}
                        onChange={(e) => handleChange("fecha", e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, "fecha")}
                        className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                        placeholder=""/>
                </div>
                <div className="space-y-2 col-span-3">
                    <div>
                        <label htmlFor="comentarios" className="text-sm font-medium text-foreground">
                        Comentario
                        </label>
                    </div>
                    <input
                        ref={comentarioRef}
                        type="text"
                        id="comentario"
                        value={formData.comentarios}
                        onChange={(e) => handleChange("comentarios", e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, "comentarios")}
                        className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                        placeholder="Ponga su comentario"/>
                </div>
                 
            </div>
            {/* Botones */}
          <div className="w-full pl-2 flex flex-col sm:flex-row  gap-4 items-center justify-end ">
            
            <button
              type="button"
              onClick={() => { saveRecord()}}
              className={"MontserratReg flex items-center w-1/6 justify-center gap-2 pt-2 pb-1 rounded-md  text-white text-lg MontserratReg transition-colors duration-300 bg-blue-600 hover:bg-blue-800 "}>
                    Guardar <BsSave size={20} />
              </button>
            <button
              className={"flex items-center w-1/6 justify-center gap-2 pt-2 pb-1 rounded-md  text-white text-lg MontserratReg transition-colors duration-300 bg-red-600 hover:bg-red-800 "}
              onClick={() => {
                setFormData({
                  id_collar: state.holeid.id_collar,
                    id_survey: 0,
                    depth: '',
                    dip: '',
                    azimuth: '',
                    id_type: '',
                    fecha: getCurrentDate(),
                    estatus: '',
                    comentarios: '',
                },)
                handleOk();
                depthRef.current?.focus()
                
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
    );
}
export default Survey;


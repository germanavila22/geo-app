import {  useEffect, useRef, useState,type FormEvent, type KeyboardEvent } from 'react';

import { useGeo, } from '../hooks/useGeoContext';

import{TituloForm,Tituloerrores} from '../components/TituloForms';
import {
  DynamicFormGrid,
  type FieldConfig,
    type RecordData,
    type ActionConfig,
    type ActionFunctions,
}from "../components/Dynamic-form-grid"
import { ObtenerGaps } from '../components/Gaps';

import { Modal,Tooltip,Empty,notification,Switch } from "antd";

import { BsPlusLg } from "react-icons/bs";
import { BsSave } from 'react-icons/bs';
import { BsXLg } from 'react-icons/bs';
import { BsExclamationLg } from 'react-icons/bs';
import { BsCheckLg } from 'react-icons/bs';
import { AiOutlineInfo } from 'react-icons/ai';
import axios from 'axios';


const Perforacion = () => {
    const { state } = useGeo();
    const [diameter, setDiameter] = useState<FormData[]>([])
    const [actualizar, setActualizar] = useState(false);
    interface FormData {
        id_diameter: number;
        id_collar: number;
        id_type: number;
        inicio:string;
        final:string;
        fecha_inicio: string;
        fecha_final: string;
        id_usuario?: number;
        id_maquina: number;
        turno: number;
        comentarios: string;
        estatus: number;
        terminado:boolean
    }
    type Gapgeo = {
      inicio: number;
      fin: number;
    };
   const getCurrentDate = () => {
        const today = new Date()
        return today.toISOString().split("T")[0]
    }

    const [formData, setFormData] = useState<FormData>({
        id_diameter: 0,
        id_collar: state.holeid.id_collar,
        id_type: 0,
        inicio: '',
        final: '',        
        fecha_inicio: getCurrentDate(),
        fecha_final: getCurrentDate(),
        id_usuario: state.usuario?.idusuario ?? 0,
        id_maquina: 0,
        turno: 0,
        comentarios: '',
        estatus: 1,
        terminado:false
    })
    const [geogaps, setGeogaps] = useState<Gapgeo[]>([]);///arreglo para guardar los gaps encontrados

    /*Codigo para el modal */
        const [isModalOpen, setIsModalOpen] = useState(false);    
        const showModal = () => {
          setFormData((prev) => ({ ...prev,  id_diameter: 0,
              id_collar: state.holeid.id_collar,
              id_type: 0,
              inicio: '',
              final: '',        
              fecha_inicio: getCurrentDate(),
              fecha_final: getCurrentDate(),
              id_usuario: state.usuario?.idusuario ?? 0,
              id_maquina: 0,
              turno: 0,
              comentarios: '',
              estatus: 1,
              terminado:false
          }))
          setIsModalOpen(true);
          setTimeout(() => {
          inicioref.current?.focus()           
          //alert('Recuerda que puedes navegar entre los campos utilizando la tecla Enter o Tab')  
          }, 500);
          
        };    
        const handleOk = () => {
          setIsModalOpen(false);
        };    
        const handleCancel = () => {
          setIsModalOpen(false);
        };
    /*Fin codigo modal*/
    /**codigo para poner las referencias  */
      /*codigo para brincar entre los campos con enter o con tab */
        const inicioref = useRef<HTMLInputElement>(null)
        const finalref = useRef<HTMLInputElement>(null)
        const id_typeref = useRef<HTMLSelectElement>(null)
        const fecha_inicioref = useRef<HTMLInputElement>(null)
        const fecha_finalref = useRef<HTMLInputElement>(null)
        const turnoref = useRef<HTMLSelectElement>(null)
        const id_maquinaref = useRef<HTMLSelectElement>(null)
        const comentariosref = useRef<HTMLInputElement>(null)
        /*fin de codigo brincar entre campos */
         const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, currentField: string) => {
                if (e.key === "Enter" || e.key === "Tab") {
                  e.preventDefault()
                  
                  switch (currentField) {
                    case "inicio":
                      finalref.current?.focus()
                      break
                    case "final":
                      id_typeref.current?.focus()
                      break
                    case "id_type":
                      fecha_inicioref.current?.focus()
                      break
                    case "fecha_inicio":
                      fecha_finalref.current?.focus()
                      break
                    case "fecha_final":
                      turnoref.current?.focus()
                      break
                    case "turno":
                      id_maquinaref.current?.focus()
                      break
                      case "id_maquina":
                      comentariosref.current?.focus()
                      break
                    case "comentarios":
                      saveRecord()
                    break
                  }
                }
              }
    


    /*Codigo para guardar el formulario*/
      const handleSubmit = (e: FormEvent) => {
        e.preventDefault()    
      }
    /*Fin codigo guardar formulario*/
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

    /*empiezo a guargar los valores del formulario */
    const handleChange = (field: keyof FormData, value:  number | string | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }
    const guardaterminado = (checked:boolean) => {
        setFormData((prev) => ({ ...prev, terminado: checked }))
        console.log("valor de terminado",checked)
    }
    /*fin de guardar los valores del formulario */
 


    const   saveRecord = () => {
        console.log('Guardando registro:', formData);
        // Aquí puedes agregar la lógica para enviar los datos al servidor o procesarlos según sea necesario.
         const dataToSend = {
          ...formData,
          id_diameter: Number(formData.id_diameter),
          id_type: Number(formData.id_type),
          inicio: Number(formData.inicio),
          final: Number(formData.final),
          fecha_inicio: String(formData.fecha_inicio),
          fecha_final: String(formData.fecha_final),
          id_usuario: Number(formData.id_usuario),
          id_maquina: Number(formData.id_maquina),
          estaus: Number(formData.estatus),
          turno: Number(formData.turno),
          id_collar: Number(formData.id_collar),
          comentarios: String(formData.comentarios),
          terminado: Boolean(formData.terminado)
        };
      axios.post('http://localhost:3000/diametermanager', dataToSend)
      .then(response => {
        
        console.log("respuesta", response.data);
        if (response.data.success) {

          //setinitialrecord([]);          
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
      setActualizar(false)
        //openNotification('Registro guardado exitosamente.', 'exito');
    }
    /*Fin de guardar el registro */
  
  /**Busco la informacion del reporte de perforacion */
  useEffect(() => {
    
    if (state.holeid.id_collar<=0){
      setDiameter([])
      setGeogaps([])
      setinitialrecord([])
      return;
    } // Evita búsquedas vacías

    
    axios.post('http://localhost:3000/diameterview', `id_collar=${state.holeid.id_collar}`)
        .then(response => {
        //console.log("busqueda:", response.data.message);
        if(response.data.diameterdata!=null){
            console.log("la data",response.data.diameterdata)
            setDiameter(response.data.diameterdata)
            setinitialrecord(response.data.diameterdata)
            const registros = response.data.diameterdata.map((item: { inicio: number; final: number; }) => ({
              geolfrom: item.inicio,
              geolto: item.final,
            }));
           
            setGeogaps(ObtenerGaps(registros as any, state.holeid.depth))
                       
        }
        else{
          console.log("no trajo nada",state.holeid.id_collar)
            setDiameter([])
            setinitialrecord([])
            setGeogaps([])
            
        }                
        // aquí puedes actualizar el state con los datos si es necesario
        })
        .catch(error => {
        console.error("Error al guardar los datos:", error);
        });
        console.log("datos de geologia",diameter)
        //console.log("datos de geologia asd asd",initialRecords)
        ///ver los

        //busco los gaps
       
        
    }, [state.holeid.id_collar, actualizar]);    
    ////fin de buscar el collar
    
    
    /**codigo para generar el grid */
    /*configuracion del grid */
    const fieldConfig: FieldConfig[] = [
    {
      id: "inicio",
      label: "Inicio",
      type: "text",
      required: true,
    },
    {
      id: "final",
      label: "Final",
      type: "text",
      required: true,
    },
   
  
    {
      id: "id_type",
      label: "Tipo de barrenacion",
      type: "text",
      required: false,
      
    },
    {
      id: "fecha_inicio",
      label: "Fecha inicio",
      type: "date",
      required: false,      
    },
    {
      id: "fecha_final",
      label: "Fecha final",
      type: "date",
      required: false,      
    },
    {
      id: "turno",
      label: "turno",
      type: "select",
      required: false,      
      options: [
        { id_opcion: 1, descripcion: "Turno 1" },
        { id_opcion: 2, descripcion: "Turno 2" },
        { id_opcion: 3, descripcion: "Turno 3" },
      ],
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
                 Debes seleccionar un collar para ver o agregar registros en el repore de Perforacion.
                </div>
          :                    
            <div className="w-full pl-2 flex flex-col sm:flex-row  gap-4 items-center justify-between">
              
              <div className="flex flex-col sm:flex-row  gap-4 items-center">
                
                  <TituloForm titulo="Diametros" holeid={state.holeid.holeid} proyecto={state.holeid.proyecto} depth={state.holeid.depth} azimuth={state.holeid.azimuth} dip={state.holeid.dip}/>
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
                <Tituloerrores registros={diameter.length} gaps={geogaps} />
               
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
            <div className="grid  gap-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <div>
                            <label htmlFor="incio" className="text-sm font-medium text-foreground">
                           Inicio
                            </label>
                        </div>
                        <div>
                            <input
                                ref={inicioref}
                                type="number"
                                id="inicio"
                                value={formData.inicio}
                                className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                                placeholder="0.00"
                                onChange={(e) => handleChange("inicio", e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, "inicio")}
                                />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div>
                            <label htmlFor="final" className="text-sm font-medium text-foreground">
                           Final
                            </label>
                        </div>
                        <div>
                            <input
                                ref={finalref}
                                type="number"
                                id="final"
                                value={formData.final}
                                className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                                placeholder="0.00" 
                                onChange={(e) => handleChange("final", e.target.value)}  
                                onKeyDown={(e) => handleKeyDown(e, "final")}
                                />
                                
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div>
                            <label htmlFor="geolfrom" className="text-sm font-medium text-foreground">
                           Tipo
                            </label>
                        </div>
                        <div>
                            <select
                                ref={id_typeref}
                                id="id_type"
                                className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                                value={formData.id_type}
                                onChange={(e) => handleChange("id_type", e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, "id_type")}>
                                <option value="">Selecciona un tipo</option>
                                <option value="1">Tipo 1</option>
                                <option value="2">Tipo 2</option>
                                <option value="3">Tipo 3</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <div>
                            <label htmlFor="fecha_inicio" className="text-sm font-medium text-foreground">
                           Fecha inicio
                            </label>
                        </div>
                        <div>
                            <input
                                ref={fecha_inicioref}
                                type="date"
                                id="fecha_inicio"
                                value={formData.fecha_inicio}
                                className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                                onChange={(e) => handleChange("fecha_inicio", e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, "fecha_inicio")}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div>
                            <label htmlFor="fecha_final" className="text-sm font-medium text-foreground">
                           Fecha final
                            </label>
                        </div>
                        <div>
                            <input
                                ref={fecha_finalref}
                                type="date"
                                id="fecha_final"
                                value={formData.fecha_final}
                                className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                                placeholder="0.00"
                                onChange={(e) => handleChange("fecha_final", e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, "fecha_final")}
                                />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div>
                            <label htmlFor="id_turno" className="text-sm font-medium text-foreground">
                           Turno
                            </label>
                        </div>
                        <div>
                            <select                                
                                ref={turnoref}
                                id="id_turno"
                                value={formData.turno}
                                className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                                onChange={(e) => handleChange("turno", e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, "turno")}>
                                <option value="">Selecciona un turno</option>
                                <option value="1">Turno 1</option>
                                <option value="2">Turno 2</option>
                                <option value="3">Turno 3</option>
                            </select>   
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <div>
                            <label htmlFor="geolfrom" className="text-sm font-medium text-foreground">
                           Maquina
                            </label>
                        </div>
                        <div>
                            <select
                                ref={id_maquinaref}
                                id="geolfrom"
                                value={formData.id_maquina}
                                className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                                onChange={(e) => handleChange("id_maquina", e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, "id_maquina")}
                                >
                                <option value="">Selecciona una maquina</option>
                                <option value="1">Maquina 1</option>
                                <option value="2">Maquina 2</option>
                                <option value="3">Maquina 3</option>
                            </select>   
                        </div>
                        
                    </div>
                    <div className="space-y-2 col-span-2">
                        <div>
                            <label htmlFor="comentarios" className="text-sm font-medium text-foreground">
                           Comentarios
                            </label>
                        </div>
                        <div>
                            <input
                                ref={comentariosref}
                                type="text"
                                id="comentarios"
                                value={formData.comentarios}
                                className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                                placeholder="Pon aqui tus comentarios"   
                                onChange={(e) => handleChange("comentarios", e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, "comentarios")}
                                />
                        </div>
                    </div>
                    
                </div>   
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className='p-1.5'><Switch value={formData.terminado} onChange={guardaterminado} id='terminado'/><label htmlFor="terminado" className="text-sm font-medium text-foreground p-1.5">
                           Terminar barreno
                            </label></div>
              <div className="w-full pl-2 flex flex-col sm:flex-row  gap-4 items-center justify-end ">            
                  <button
                      type="button"
                      onClick={() => {saveRecord()} }
                      className={"MontserratReg flex items-center w-1/3 justify-center gap-2 pt-2 pb-1 rounded-md  text-white text-lg MontserratReg transition-colors duration-300 bg-blue-600 hover:bg-blue-800 "}>
                      Guardar <BsSave size={20} />
                  </button>
                  <button
                      className={"flex items-center w-1/3 justify-center gap-2 pt-2 pb-1 rounded-md  text-white text-lg MontserratReg transition-colors duration-300 bg-red-600 hover:bg-red-800 "}
                      onClick={handleCancel}>
                      Cancelar<BsXLg size={22}/>
                  </button>
              </div>
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
export default Perforacion;
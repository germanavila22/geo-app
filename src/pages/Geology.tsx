

import { Modal,Tooltip } from "antd";

import { Empty } from 'antd';


import { BsSave } from 'react-icons/bs';
import { BsPlusLg } from 'react-icons/bs';
import { BsXLg } from 'react-icons/bs';

import {TituloForm,Tituloerrores} from './TituloForms';
import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from "react"

type GeologicalRecord = {
  id: number
  geolfrom: string
  geolto: string
  litologia: string
  estructura: string
  zona: string
  comentario: string
}


const Geology = () => {
  /**logica */
 const [formData, setFormData] = useState<GeologicalRecord>({
    id: 0,
    geolfrom: "",
    geolto: "",
    litologia: "",
    estructura: "",
    zona: "",
    comentario: "",
  })

  const [records, setRecords] = useState<GeologicalRecord[]>([])

  const geolfromRef = useRef<HTMLInputElement>(null)

  const geoltoRef = useRef<HTMLInputElement>(null)
  const litologiaRef = useRef<HTMLInputElement>(null)
  const estructuraRef = useRef<HTMLInputElement>(null)
  const zonaRef = useRef<HTMLInputElement>(null)
  const comentarioRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    geolfromRef.current?.focus()
  }, [])

  const saveRecord = () => {
    const newRecord = { ...formData }
    setRecords([...records, newRecord])

    // Reset del formulario manteniendo geolto como nuevo geolfrom
    setFormData({
      id:0,
      geolfrom: formData.geolto,
      geolto: "",
      litologia: "",
      estructura: "",
      zona: "",
      comentario: "",
    })

    // Focus en geolfrom
    geolfromRef.current?.focus()

    console.log("[v0] Registro guardado:", newRecord)
  }

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

  const handleChange = (field: keyof GeologicalRecord, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if(valida()){
    saveRecord()
    }else{
      console.log("Error de validacion")
    }
  }
/* */
  const valida = () => {
    // Aquí puedes agregar la lógica de validación
    ///recorro el objeto formData y verifico que ningun campo este vacio
    let esvalido=true
    datos.forEach((registro)=>{
      ///primero comparo los inicios
      if(registro.inicio===parseFloat(formData.geolfrom)){
        console.log("Error: El inicio ya existe en otro registro", registro.inicio)
        esvalido=false
        return false
      }
      if(registro.fin===parseFloat(formData.geolto)){
        console.log("Error: El fin ya existe en otro registro", registro.fin)
        esvalido=false
        return false
      }
      if(parseFloat(formData.geolfrom)>=registro.inicio && parseFloat(formData.geolfrom)<registro.fin ){
        console.log("Error: El inicio se solapa con otro registro", registro.inicio,registro.fin)
        esvalido=false
        return false
      }
      if(parseFloat(formData.geolto)>registro.inicio && parseFloat(formData.geolto)<registro.fin ){
        console.log("Error: El final se solapa con otro registro", registro.inicio,registro.fin)
        esvalido=false
        return false
      }else{
        console.log("No hay solapamiento con el registro", registro.inicio,"->",formData.geolfrom,"   ",registro.fin,"->",formData.geolto)
      }
    })
    console.log("Validando datos del formulario...", formData)
    return esvalido
  }
  type geotechnicalData = {
    id:number;
    inicio: number;
    fin: number;
    recuperacion: number;
    rqd: number;
    comentarios: string;
  };

  const [geotechdata, setGeotechdata] = useState<geotechnicalData>({
    id:0,
    inicio: 0,
    fin: 0,
    recuperacion: 0,
    rqd: 0,
    comentarios: "",
  });
  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeotechdata({
      ...geotechdata,
      [name]: name === "inicio" || name === "fin" || name === "recuperacion" || name === "rqd" ? parseFloat(value) : value,
    });
  }
  const guardadata = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('guardo ',geotechdata);
    datos.push(geotechdata); // Agrega los datos al array
    setGeotechdata({
      id:0,
      inicio: 0,
      fin: geotechdata.fin, // Incrementa el fin para el siguiente registro
      recuperacion: 0,
      rqd: 0,
      comentarios: "",
    }); // Resetea el formulario
    // Aquí podrías agregar la lógica para guardar los datos, por ejemplo enviarlos a una API o almacenarlos en el estado
  };
  const datos = [
    { id:1,inicio: 0, fin: 1.5, recuperacion: 1.48, rqd: 90.12, comentarios: "Roca sana" },
    { id:2,inicio: 1.5, fin: 3.0, recuperacion: 2.95, rqd: 85.45, comentarios: "Fracturas menores" },
    { id:3,inicio: 3.0, fin: 4.5, recuperacion: 4.50, rqd: 92.00, comentarios: "Muestra intacta" },    
    { id:4,inicio: 5, fin: 5.5, recuperacion: 1.48, rqd: 90.12, comentarios: "Roca sana" },    
    { id:5,inicio: 5.5, fin: 6.5, recuperacion: 1.48, rqd: 90.12, comentarios: "Roca sana" },    
  ];


      const [isModalOpen, setIsModalOpen] = useState(false);

      const showModal = () => {
        setIsModalOpen(true);
      };

      const handleOk = () => {
        setIsModalOpen(false);
      };

      const handleCancel = () => {
        setIsModalOpen(false);
      };
    return (
    <>
   
      <div className="w-full h-full rounded-t-md">
            
        <div className="w-full pl-2 flex flex-col sm:flex-row  gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row  gap-4 items-center">
                <TituloForm titulo="Geología" holeid="BD-2025-002" proyecto={"Concheño"} depth={500} azimuth={350} dip={-75}/>
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
              <Tituloerrores registros={10} gaps={[{inicio:10,fin:15},{inicio:50,fin:55}]}/>
              
            </div>
          </div>


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
                type="text"
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
                type="text"
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
            <input
              ref={litologiaRef}
              type="text"
              id="litologia"
              value={formData.litologia}
              onChange={(e) => handleChange("litologia", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "litologia")}
              className="w-full px-4 py-2.5 bg-background border border-gray-400  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              placeholder="Ej: Arcilla, Arena, Grava"
            />
          </div>

          {/* Estructura */}
          <div className="space-y-2">
            <div>
              <label htmlFor="estructura" className="text-sm font-medium text-foreground">
                Estructura
              </label>
            </div>
            <input
              ref={estructuraRef}
              type="text"
              id="estructura"
              value={formData.estructura}
              onChange={(e) => handleChange("estructura", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "estructura")}
              className="w-full px-4 py-2.5 bg-background border border-gray-400  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              placeholder="Descripción de la estructura"
            />
          </div>

          {/* Zona */}
          <div className="space-y-2">
            <div>
              <label htmlFor="zona" className="text-sm font-medium text-foreground">
                Zona
              </label>
            </div>
            <input
              ref={zonaRef}
              type="text"
              id="zona"
              value={formData.zona}
              onChange={(e) => handleChange("zona", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "zona")}
              className="w-full px-4 py-2.5 bg-background border border-gray-400  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              placeholder="Zona geográfica"
            />
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
              value={formData.comentario}
              onChange={(e) => handleChange("comentario", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "comentario")}
              className="w-full px-4 py-2.5 bg-background border border-gray-400  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
              placeholder="Observaciones adicionales..."
            />
          </div>

         

          {/* Botones */}
          <div className="w-full pl-2 flex flex-col sm:flex-row  gap-4 items-center justify-end ">
            
            <button
              type="button"
              className={"flex items-center w-1/8 justify-center gap-2 pt-2 pb-1 rounded-md  text-white text-lg MontserratReg transition-colors duration-300 bg-blue-600 hover:bg-blue-800 "}>
                    Guardar <BsSave size={20} />
              </button>
            <button
              className={"flex items-center w-1/8 justify-center gap-2 pt-2 pb-1 rounded-md  text-white text-lg MontserratReg transition-colors duration-300 bg-red-600 hover:bg-red-800 "}
              type="button"
              onClick={() => {
                setFormData({
                  id:0,
                  geolfrom: "",
                  geolto: "",
                  litologia: "",
                  estructura: "",
                  zona: "",
                  comentario: "",
                },)
                handleOk();
                //geolfromRef.current?.focus()
                
              }}
              
            >
              Cancelar<BsXLg size={22}/>
            </button>
          </div>
        </form>
      </Modal>


      <hr className='my-2 h-px border-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent'></hr>

            
      
    
              <Empty description="No hay registros geológicos disponibles" className="mt-10"/>
                
            
    </div>    
    </>
    )
}
export default Geology;    

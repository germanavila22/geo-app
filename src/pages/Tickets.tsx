import { useCallback, useEffect,  useState, type FormEvent } from "react";

import { BsPlusLg,BsTicketPerforated, BsSave } from "react-icons/bs";
import { CheckCircle, Ticket } from "lucide-react";

import { Modal,Progress } from "antd";
import { useGeo, } from '../hooks/useGeoContext';
import axios from 'axios';

import {TicketCard} from "../components/DivTickets";

import TicketTitulo from "../components/TicketTitulo";

interface TicketSeguimiento{
        id_seguimiento:number;
        id_ticket:number;
        id_usuario:number;
        avance:string;
        fecha:string;
        horas:number;
        comentarios:string;

}
interface TicketSeguimientotabla{
        id_seguimiento:number;
        id_ticket:number;
        id_usuario:number;
        username:string;        
        fecha:string;
        fecha_catpura:string,
        avance:number;
        horas:number;
        comentarios:string;
        estatus:number
}

interface Ticket {
         id_ticket: number;
		 id_creador: number;
		 fecha_creacion: string;
		 fecha_termino: string;
		 fecha_inicio:string;
		 fecha_final:string;
		 horas_programadas :string;
		 estatus:number;
		 id_proyecto: number;
		 nombre_proyecto:string;
		 id_solicitante: number;
		 nombre_solicitante:string;
		 id_tarea :number;
		 nom_tarea :string;
		 tarea :string;
		 comentarios :string;
		 prioridad :number;		 
		 id_usuario :number;
         avance:number;
}
const getCurrentDate = () => {
        const today = new Date()
        return today.toISOString().split("T")[0]
}

const Tickets = () => {
  const {state}= useGeo()
  const[actualizar,setActualizar]=useState(false)///variable para actualizar las vistas
  const [ticketdata, setTicketsdata]=useState<Ticket[]>([])//muestra todos los ticket que tiene el usuario
  const [ticketseguimiento,setTicketseguimiento] =useState<Ticket>()///es el ticket para mostrar al darle click en los items de la pagina principal
  const [seguimiento,setSeguimiento]=useState<TicketSeguimiento>()///guarda la informacion para agregar seguimiento
  const [tickettabla,setTickettabla]=useState<TicketSeguimientotabla[]>([])//es la informacion del seguimiento para mostrar

  const[avancetotal,setAvancetotal]=useState(0)
  const[horastotal,setHorastotal]=useState(0)

  const [ticket, setTicket]=useState<Ticket>()
  //const [tickets, setTickets] = useState<TicketItem[]>(initialTickets);

    const handleSubmit = (e: FormEvent) => {
            e.preventDefault()    
    }
    /**codigo para poner el icono */
    
  /**Codigo para administrar tickets */
    const handleChangeTicket = (field: keyof Ticket, value:  number | string | null) => {
        setTicket((prev) => prev ? { ...prev, [field]: value } : prev)
        console.log("miticket",ticket)
    }
    const saveTicket = () => {
               
        setActualizar(false)
        console.log("el sgui",ticket)
        
            const dataToSend = {
                ...seguimiento,
                id_ticket: 0,
                id_usuario:Number(ticket?.id_usuario),
                id_creador:Number(ticket?.id_usuario),
                prioridad: Number(ticket?.prioridad),
                id_proyecto:Number(ticket?.id_proyecto),
                id_solicitante:Number(ticket?.id_solicitante),
                id_tarea:Number(ticket?.id_tarea),
                tarea:ticket?.tarea,
                fecha_inicio:ticket?.fecha_inicio,
                fecha_final:ticket?.fecha_final,
                horas_programadas:Number(ticket?.horas_programadas),
                comentarios:ticket?.comentarios
            };

        axios.post('http://localhost:3000/ticketmanager', dataToSend)
        .then(response => {
            
            console.log("respuesta", response.data);
            if (response.data.success) {
            
            setActualizar(true)
            
            //openNotification("Registro guardado con exito", "exito");
            
            } else {
            console.error("Error al guardar los datos:", response.data.mensaje);          
            setActualizar(true)
            }
        })
        .catch(error => {
            console.error("Error al guardar los datos:", error);
        });

    }
  /* Función que se ejecuta al hacer click en un ticket. */
const handleTicketClick = useCallback((id: number) => {
    setActualizar(false)
    const ticketEncontrado = ticketdata.find(
        (ticket) => ticket.id_ticket === id
    );
    if (ticketEncontrado) {
        setTicketseguimiento(ticketEncontrado);
        console.log("Ticket cargado para seguimiento:", ticketEncontrado);
        setSeguimiento({
            id_seguimiento:0,
            id_ticket: ticketEncontrado.id_ticket,
            id_usuario: state.usuario?.idusuario ?? 0,
            avance: "",
            fecha: getCurrentDate(),
            horas: 0,
            comentarios: ""
        });
        verseguimiento(ticketEncontrado.id_ticket)

    } else {
        // Esta advertencia no debería salir más si el ID existe.
        console.warn(`Ticket con ID ${id} no encontrado.`);
    }
    
    setIsModalOpen(true);
    console.log(id," Avance total",avancetotal)
    
}, [ticketdata,actualizar]);

function sumarColumna(
    ticketTabla: TicketSeguimientotabla[],
    columna: keyof Pick<TicketSeguimientotabla, "avance" | "horas">
): number {

    return ticketTabla.reduce((total, item) => {
        const valor = Number(item[columna]);
        return total + (isNaN(valor) ? 0 : valor);
    }, 0);
}
useEffect(() => {
    // Esta función se ejecutará CADA VEZ que tickettabla cambie.
    const sumaActual = sumarColumna(tickettabla, 'avance');
    const sumaHoras = sumarColumna(tickettabla, 'horas');
        setAvancetotal(sumaActual);
        setHorastotal(sumaHoras);
    
}, [tickettabla, avancetotal,ticketdata]);
const verseguimiento=(id_ticket: number)=>{
    /**traigo la informacion el seguimiento */
         setActualizar(false) 
        axios.post('http://localhost:3000/ticketseguimientoview', `id_ticket=${id_ticket}`)
        .then(response => {
        //console.log("busqueda:", response.data.message);
        if(response.data.ticketseguimiento!=null){
            console.log("la data",response.data.ticketseguimiento)
            setTickettabla(response.data.ticketseguimiento)
            setAvancetotal(sumarColumna(response.data.ticketseguimiento, 'avance'))
            setHorastotal(sumarColumna(response.data.ticketseguimiento, 'horas'))
            setActualizar(true) 
                                   
        }
        else{
        console.log("no trajo nada",state.usuario?.idusuario)
            setTickettabla([])            
            
        }                
        // aquí puedes actualizar el state con los datos si es necesario
        })
        .catch(error => {
        console.error("Error al traer tabla de seguimiento:", error);
        }); 
        
        /**fin de traer la informacion del seguimiento */
}
/**codigo para manejar los cambios en el seguimiento */
const handleChange = (field: keyof TicketSeguimiento, value:  number | string | null) => {
        setSeguimiento((prev) => prev ? { ...prev, [field]: value } : prev)
}

/**fin codigo para manejar los cambios en el seguimiento */


/**Codigo para guardar los avances */
const saveSeguimiento = () => {
    setActualizar(false)
    console.log("el sgui",seguimiento)
    
        const dataToSend = {
            ...seguimiento,
            id_seguimiento: Number(seguimiento?.id_seguimiento),
            id_ticket: Number(seguimiento?.id_ticket),
            id_usuario: Number(seguimiento?.id_usuario),
            avance: parseFloat(seguimiento?.avance ?? ""),
            horas: Number(seguimiento?.horas),                        
            fecha: seguimiento?.fecha,
            comentarios: seguimiento?.comentarios,
        };

    axios.post('http://localhost:3000/ticketseguimientomanager', dataToSend)
      .then(response => {
        
        console.log("respuesta", response.data);
        if (response.data.success) {
         
            setActualizar(true)
            verseguimiento(dataToSend.id_ticket)
            
            

          //openNotification("Registro guardado con exito", "exito");
        
        } else {
          console.error("Error al guardar los datos:", response.data.mensaje);          
          setActualizar(true)
        }
      })
      .catch(error => {
        console.error("Error al guardar los datos:", error);
      });

}
/**Fin de codigos para guardar los avances */


/*Codigo para el modal */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
/*Fin codigo modal*/
    /*Codigo para el modal */
      const [isModalOpenTicket, setIsModalOpenticket] = useState(false);

      const showModalticket = () => { 
        console.log("Ticket nuevo:");
        setTicket({
            
            id_ticket: 0,
            id_usuario: state.usuario?.idusuario ?? 0,            
            fecha_inicio: getCurrentDate(),
            horas_programadas: "0",
            comentarios: "",
            id_creador: state.usuario?.idusuario ?? 0,
            fecha_creacion: getCurrentDate(),
            fecha_termino: "",
            fecha_final: "",
            estatus: 0,
            id_proyecto: 0,
            nombre_proyecto: "",
            id_solicitante: 0,
            nombre_solicitante: "",
            id_tarea: 0,
            nom_tarea: "",
            tarea: "",
            prioridad: 3,            
            avance: 0
        });        
        setIsModalOpenticket(true);            
        };
    const handleOkticket = () => {
        setIsModalOpenticket(false);
    };
    const handleCancelticket = () => {
        setIsModalOpenticket(false);
    };
/*Fin codigo modal*/


    /*codigo para jalar los tickets pendientes */    
useEffect(() => { 
    if (!state.usuario || state.usuario.idusuario < 0){     
      return;
    } // Evita búsquedas vacías
   
    axios.post('http://localhost:3000/ticketview', `id_usuario=${state.usuario?.idusuario}`)
        .then(response => {
        //console.log("busqueda:", response.data.message);
        if(response.data.ticketdata!=null){
            console.log("la data",response.data.ticketdata)
            setTicketsdata(response.data.ticketdata)                      
        }
        else{
          console.log("no trajo nada",state.usuario?.idusuario)
            setTicketsdata([])                       
        }                
        // aquí puedes actualizar el state con los datos si es necesario
        })
        .catch(error => {
        console.error("Error al guardar los datos:", error);
        });        
        //console.log("datos de geologia asd asd",initialRecords)
        ///ver los        
}, [actualizar]);
    /*fin de codigo para ver los tickets pendientes */
  return (
    <>
    <div className="p-4 space-y-4 bg-gray-50 h-full">
    <Modal
       title="Ticket"
        open={isModalOpenTicket}
        onOk={handleOkticket}
        onCancel={handleCancelticket}        
        width={"75%"}
        footer={null}
        style={{top:'10%',left:'7%'}}        
        >
        <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-3 gap-8">
                <div className="space-y-2">
                    <div>
                        <label htmlFor="fecha" className="text-sm font-medium text-foreground">
                        Prioridad
                        </label>
                    </div>
                    <select
                        id="prioridad"
                        onChange={(e) => handleChangeTicket("prioridad", e.target.value)}                                                
                        className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"                       >
                        <option value="">Selecciona una prioridad</option>
                        <option value="1">Urgente</option>
                        <option value="2">Importante</option>
                        <option value="3">Media</option>
                        <option value="3">Normal</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <div>
                        <label htmlFor="fecha" className="text-sm font-medium text-foreground">
                        Proyecto
                        </label>
                    </div>
                    <select
                        id="id_proyecto" 
                        onChange={(e) => handleChangeTicket("id_proyecto", e.target.value)}                                               
                        className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"                       >
                        <option value="">Selecciona una proyecto</option>
                        <option value="1">Asientos</option>
                        <option value="2">Concheño</option>
                        <option value="3">Coronel</option>
                        <option value="3">Tayahua</option>
                    </select>                
                </div>
                <div className="space-y-2">
                    <div>
                        <label htmlFor="fecha" className="text-sm font-medium text-foreground">
                        Solicitante
                        </label>
                    </div>
                    <select
                        id="id_solicitante"                                                
                         onChange={(e) => handleChangeTicket("id_solicitante", e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"                       >
                        <option value="">Selecciona un solicitante</option>
                        <option value="1">Dr Macario</option>
                        <option value="2">Ismael Reyes</option>
                        <option value="4">Ruben Vazquez</option>
                        <option value="5">Ricardo Diaz</option>
                    </select>                
                </div>
            </div>
            <div className="grid grid-cols-3 gap-8">
                <div className="space-y-2">
                    <div>
                        <label htmlFor="fecha" className="text-sm font-medium text-foreground">
                        Tarea
                        </label>
                    </div>
                    <select
                        id="id_tarea"
                         onChange={(e) => handleChangeTicket("id_tarea", e.target.value)}                                                
                        className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"                       >
                        <option value="">Selecciona una tarea</option>
                        <option value="1">Modelo</option>
                        <option value="2">Estimacion</option>
                        <option value="3">Base de datos</option>
                        
                    </select>                
                </div>
                <div className="space-y-2 col-span-2">
                    <div>
                        <label htmlFor="fecha" className="text-sm font-medium text-foreground">
                        Descripcion Tarea
                        </label>
                    </div>
                    <div>
                        <input                       
                        type="Text"
                        id="tarea"
                         onChange={(e) => handleChangeTicket("tarea", e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                        placeholder="Breve descripcion de la tarea"/>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-8">
                <div className="space-y-2 ">
                    <div>
                        <label htmlFor="fecha" className="text-sm font-medium text-foreground">
                        Fecha de inicio
                        </label>
                    </div>
                    <div>
                        <input                        
                            type="date"
                            id="fecha_inicio"
                             onChange={(e) => handleChangeTicket("fecha_inicio", e.target.value)}
                            value={ticket?.fecha_inicio}                                                
                            className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                            placeholder=""/>
                    </div>
                </div>
                <div className="space-y-2 ">
                    <div>
                       <label htmlFor="fecha" className="text-sm font-medium text-foreground">
                        Fecha final
                        </label>
                    </div>
                    <div>
                        <input                        
                            type="date"
                            id="fecha_final"
                            onChange={(e) => handleChangeTicket("fecha_final", e.target.value)}                                                
                            className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                            placeholder=""/>
                    </div>
                </div>
                <div className="space-y-2 ">
                    <div>
                       <label htmlFor="fecha" className="text-sm font-medium text-foreground">
                        Horas programadas
                        </label>
                    </div>
                    <div>
                        <input                        
                            type="number"
                            id="horas_programadas"
                             onChange={(e) => handleChangeTicket("horas_programadas", e.target.value)}
                            className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                            placeholder="1.5 hrs"/>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-8">
                <div className="space-y-2 ">
                    <div>
                       <label htmlFor="fecha" className="text-sm font-medium text-foreground">
                        Comentarios
                        </label>
                    </div>
                    <div>
                        <input                        
                            type="text"
                            id="comentarios"
                             onChange={(e) => handleChangeTicket("comentarios", e.target.value)}
                            className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                            placeholder="Comentarios generales del ticket"/>
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-end ">
                <button
                onClick={saveTicket}
                className={"MontserratReg flex items-center w-1/6 justify-center gap-2 pt-2 pb-1 rounded-md  text-white text-lg MontserratReg transition-colors duration-300 bg-blue-600 hover:bg-blue-800 "}
                >Guardar
                </button>
                
            </div>
        </form>
    </Modal>
    <Modal
       title=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}        
        width={"75%"}
        footer={null}
        style={{top:'10%',left:'7%'}}        
        >
        <form onSubmit={handleSubmit} className="space-y-4">
            <TicketTitulo id_ticket={ticketseguimiento?.id_ticket ?? 0}  prioridad={ticketseguimiento?.prioridad ?? 0} nom_tarea={ticketseguimiento?.nom_tarea ?? ""} tarea={ticketseguimiento?.tarea ?? ""}  />
            
            <div className="bg-gray-50"><Progress percent={Math.min(100, Math.max(avancetotal, Number(ticketseguimiento?.avance ?? avancetotal)))} status="active" /></div>
            <hr className='my-2 h-px border-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent'></hr>
            <div className="grid grid-cols-3 ">
                <div className="grid grid-cols-1 pr-5 pb-3">
                    <div className="space-y-2 pb-3">
                        <div>
                            <label htmlFor="fecha" className="text-sm font-medium text-foreground">
                            Fecha
                            </label>
                        </div>
                        <div>
                            <input 
                                type="date" 
                                value={seguimiento?.fecha}
                                onChange={(e) => handleChange("fecha", e.target.value)}
                                className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2 pb-3">
                        <div>
                            <label htmlFor="fecha" className="text-sm font-medium text-foreground">
                            Avance en %
                            </label>
                        </div>
                        <div>
                            <input type="number"
                            id="avance" name="avance"
                            value={seguimiento?.avance}
                            onChange={(e) => handleChange("avance", e.target.value)} 
                            className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                            placeholder="Ejemplo: 5% o -5%"/>
                        </div>
                    </div>
                    <div className="space-y-2 pb-3">
                        <div>
                            <label htmlFor="fecha" className="text-sm font-medium text-foreground">
                            Horas invertidas
                            </label>
                        </div>
                        <input
                            id="horas" name="horas"
                            type="number" 
                            value={seguimiento?.horas}
                            onChange={(e) => handleChange("horas", e.target.value)}
                            className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                            placeholder="Ejemplo: 1.5 hrs"/>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="space-y-2">
                        <div>
                            <label htmlFor="fecha" className="text-sm font-medium text-foreground">
                            Comentarios
                            </label>
                        </div>
                        <div>
                            <textarea name="comentarios" rows={6} cols={40}
                            id="comentarios" 
                             value={seguimiento?.comentarios}
                            onChange={(e) => handleChange("comentarios", e.target.value)} 
                            className="w-full px-4 py-2.5 bg-background border-gray-300 border-2  border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0  focus:border-green-600 transition-all"
                            placeholder="Ejemplo: 1.5 hrs"/>
                        </div>
                    </div>
                    <div className="flex flex-row space-y-2 justify-end "> 
                        <button
                            type="button"
                            onClick={saveSeguimiento}    
                            className={"MontserratReg flex items-center w-2/6 justify-center gap-2 pt-2 pb-1 rounded-md  text-white text-lg MontserratReg transition-colors duration-300 bg-blue-600 hover:bg-blue-800 "}>
                                Guardar <BsSave size={20} />
                        </button>
                    </div>
                </div>
            </div>

        </form>
        <hr className='my-2 h-px border-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent'></hr>
        <div className="flex flex-row justify-start p-1.5 gap-2">
            <div className="MontserratReg bg-gray-100 pl-3 pr-3 pt-2 pb-2 rounded-lg">Solicito <b>{ticketseguimiento?.nombre_solicitante}</b></div>
            <div className="MontserratReg bg-gray-100 pl-3 pr-3 pt-2 pb-2 rounded-lg"> Unidad <b>{ticketseguimiento?.nombre_proyecto}</b></div>
            <div className="MontserratReg bg-gray-100 pl-3 pr-3 pt-2 pb-2 rounded-lg">  Fecha inicio <b>{ticketseguimiento?.fecha_inicio}</b></div>
            <div className="MontserratReg bg-gray-100 pl-3 pr-3 pt-2 pb-2 rounded-lg">  Horas totales <b>{horastotal} / {ticketseguimiento?.horas_programadas}</b> horas programadas</div>
        </div>
        <div>
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
    
    {/* Encabezado de la Tabla (Thead) */}
    <table className="min-w-full divide-y divide-gray-500">
        <thead className="bg-gray-500 text-gray-50">
            <tr>
                {/* Asignado a (width: 15%) */}
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider w-1/6">Asignado</th>
                {/* Fecha (width: 15%) */}
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider w-1/6">Fecha</th>
                {/* Comentarios (width: 50%) - La columna más ancha para el texto */}
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider w-1/2">Comentarios</th>
                {/* Horas (width: 10%) */}
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider w-1/12">Horas</th>
                {/* Avance (width: 10%) */}
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider w-1/12">Avance</th>
            </tr>
        </thead>
        
        {/* Cuerpo de la Tabla (Tbody) */}
        <tbody className="bg-white divide-y divide-gray-200">
            {tickettabla.length > 0 ? (
                tickettabla.map((row) => (
                    <tr key={row.id_seguimiento} className="hover:bg-gray-50">
                        {/* 1. Asignado a */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/6">
                            {row.username}
                        </td>
                        {/* 2. Fecha */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-1/6">
                            {row.fecha}
                        </td>
                        {/* 3. Comentarios */}
                        <td className="px-6 py-4 text-sm text-gray-700 w-1/2">
                            {/* Aquí puedes reutilizar la función truncateText si la tienes */}
                            {row.comentarios}
                        </td>
                        {/* 4. Horas */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 w-1/12">
                            {row.horas}
                        </td>
                        {/* 5. Avance */}
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium w-1/12 
                                ${row.avance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {String(row.avance).replace(/^0+/, '')}%
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No hay registros de seguimiento.
                    </td>
                </tr>
            )}
        </tbody>
    </table>
</div>
        </div>
    </Modal>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8 font-inter">
        
        {/* Encabezado */}
        <div className="w-auto mb-6 sm:mb-8 flex gap-3 p-2">
            <div className="text-3xl MontserratReg text-gray-900 dark:text-white flex items-center ">
            <BsTicketPerforated  size={35} style={{ transform: `rotate(-45deg)` }}/> 
            </div>
            <div className="text-4xl MontserratReg text-gray-900 dark:text-white flex items-center ">    
                Mis Tickets
            </div>
            <div>
            <button
                onClick={showModalticket}
                className="bg-green-500 hover:bg-green-700 text-white font-bold p-3 rounded-full flex items-center " >
                 <BsPlusLg size={30} />
            </button>
            </div>
            
            
            
        </div>

        <div className="mx-auto ">
            
            {/* Lista de Tickets */}
            <div className="grid grid-cols-2 gap-8">
            {ticketdata.length > 0 ? (
                ticketdata.map((ticket) => (
                <TicketCard 
                    key={ticket.id_ticket} 
                    ticket={ticket} 
                    onClickTicket={handleTicketClick} 
                />
                ))
            ) : (
                <div className="p-8 bg-white dark:bg-gray-800 rounded-xl text-center shadow-lg">
                <CheckCircle className="w-10 h-10 mx-auto text-green-500 mb-2" />
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">¡No hay tickets pendientes!</p>
                <p className="text-gray-500 dark:text-gray-400">Todo está al día. ¡Buen trabajo!</p>
                </div>
            )}
            </div>
            
            {/* Lista de Tickets */}
            <div className="grid grid-cols-2 gap-8">
                        </div>
        </div>
               
        </div>
    </div>  
    </>
  );
};

export default Tickets;
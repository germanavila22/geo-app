
import {  Calendar, TrendingUp, FolderOpen } from 'lucide-react';
import { useCallback } from 'react';
import { BsHourglassSplit,BsLightning,BsExclamationTriangle,BsHourglassTop,BsTicketPerforated } from "react-icons/bs";
// --- 1. Definición de la Interfaz del Ticket (Typescript) ---

/**
 * Define la estructura de datos para un ticket pendiente.
 */
export interface TicketItem {
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

// --- 2. Funciones de Ayuda ---

/**
 * Calcula la diferencia en días entre hoy y la fecha de compromiso.
 * @param dateString - Fecha de compromiso en formato YYYY-MM-DD.
 * @returns Número de días restantes.
 */
export const calculateDaysRemaining = (dateString: string): number => {
  const due = new Date(dateString);
  const today = new Date();
  // Normalizar la hora para comparar solo fechas
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Determina la clase de color basada en la urgencia.
 * Entre más cerca la fecha, más rojo.
 * @param daysRemaining - Días restantes.
 * @returns Clase de Tailwind CSS para el color de fondo.
 */
export const getUrgencyColorClass = (daysRemaining: number): string => {
  if (daysRemaining < 0) {
    // Vencido
    return 'bg-red-600/10 border-red-500';
  } else if (daysRemaining <= 2) {
    // Muy urgente (Rojo intenso)
    return 'bg-red-500/10 border-yellow-400';
  } else if (daysRemaining <= 7) {
    // Urgente (Naranja)
    return 'bg-orange-500/10 border-green-400';
  } else if (daysRemaining <= 14) {
    // Medio (Amarillo)
    return 'bg-sky-500 border-green-400';
  } else {
    // Normal (Verde suave)
    return 'bg-sky-500 border-blue-400';
  }
};

/**
 * Obtiene el ícono y color basado en el nivel de importancia.
 * @param importancia - Nivel de importancia.
 * @returns Un objeto con el componente de ícono y el color del texto.
 */
export const getImportanceIcon = (importancia: TicketItem['prioridad']): { Icon: React.ElementType, color: string } => {
  switch (importancia) {
    case 1:
      return { Icon: BsLightning , color: 'text-red-600' };
    case 2:
      return { Icon: BsExclamationTriangle, color: 'text-yellow-600' };
    case 3:
      return { Icon: BsHourglassSplit, color: 'text-blue-600' };
    case 4:
    default:
      return { Icon: BsHourglassTop, color: 'text-green-600' };
  }
};

// --- 3. Componente de Tarjeta de Ticket ---

interface TicketCardProps {
  ticket: TicketItem;
  onClickTicket: (id: number) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClickTicket }) => {
  // Lógica para el color de urgencia
  const daysRemaining = calculateDaysRemaining(ticket.fecha_final);
  const urgencyClass = getUrgencyColorClass(daysRemaining);

  // Lógica para el ícono de importancia
  const { Icon: ImportanceIcon, color: iconColor } = getImportanceIcon(ticket.prioridad);

  // Manejador de click
  const handleClick = useCallback(() => {
    onClickTicket(ticket.id_ticket);
  }, [ticket.id_ticket, onClickTicket]);

  const daysText = daysRemaining < 0 
    ? `VENCIDO hace ${Math.abs(daysRemaining)} días` 
    : (daysRemaining === 0 ? '¡HOY VENCE!' : `Faltan ${daysRemaining} días`);

  return (
    <div
      className={`
        p-4 mb-4 rounded-xl shadow-lg 
        transition-all duration-200 
        hover:shadow-xl hover:scale-[1.01] 
        cursor-pointer 
        border-l-4 ${urgencyClass} 
        bg-white dark:bg-gray-800
      `}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-2">
        {/* ID y Proyecto */}
        <div className="flex items-center space-x-2">
          <BsTicketPerforated className="w-5 h-5 text-gray-500" />
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            <span className="text-gray-400">#TKT-</span>{String(ticket.id_ticket).padStart(4, '0')}
          </p>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${iconColor} bg-opacity-10 capitalize`}>
            <ImportanceIcon className={`w-4 h-4 inline mr-1 ${iconColor}`} />
            {ticket.nom_tarea} | {ticket.tarea}
          </span>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <FolderOpen className="w-4 h-4 mr-1"/>
            {ticket.nombre_proyecto}
        </p>
      </div>

      {/* Fecha Compromiso y Avance */}
      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Fecha Compromiso
          </p>
          <p className={`font-bold ${daysRemaining < 4 ? 'text-red-500 dark:text-red-400' : 'text-gray-800 dark:text-gray-100'}`}>
            {new Date(ticket.fecha_final).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <p className={`text-xs mt-0.5 ${daysRemaining < 0 ? 'text-red-700' : (daysRemaining < 4 ? 'text-orange-600' : 'text-gray-500')}`}>
            ({daysText})
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
             <TrendingUp className="w-4 h-4 mr-1" />
            Avance
          </p>
          <div className="flex items-center mt-1">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="h-2.5 rounded-full"
                style={{ width: `${ticket.avance}%`, backgroundColor: ticket.avance === 100 ? '#10B981' : '#3B82F6' }}
              ></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-100">{ticket.avance}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export { TicketCard };
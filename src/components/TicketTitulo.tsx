import { BsHourglassSplit,BsLightning,BsExclamationTriangle,BsHourglassTop,BsTicketPerforated } from "react-icons/bs";
type InfoBoxProps = {
  id_ticket: number;
  prioridad: number;
  nom_tarea: string;
  tarea: string;  
};

const iconMap: Record<string, React.ReactElement> = {
    1: <BsLightning size={30} />,
    2: <BsExclamationTriangle size={30} />,
    3: <BsHourglassSplit size={30} />,
    4: <BsHourglassTop size={35} />,
   
};
export const fondo = (importancia:number) => {
 
    switch (importancia) {
    case 1:
        return 'border-red-500' ;
    case 2:
        return 'border-yellow-500' ;
    case 3:
        return 'border-green-500' ;
    case 4:
        return 'border-green-500' ;
    default:
      return { color_fondo: 'text-green-600' };
  }
};
const TicketTitulo: React.FC<InfoBoxProps> = ({ id_ticket, prioridad, nom_tarea,tarea}) => {
  const iconElement: React.ReactElement = iconMap[prioridad] ??<BsHourglassTop size={25} />; // Ícono por defecto
  const fondodiv=fondo(prioridad)
  return (
    <>
    <div className={`${fondodiv} border-b-2  flex flex-row justify-between pr-5 pt-5  items-center`}>
                <div className="flex flex-row items-center pb-1">
                    <div className="flex flex-row pr-1.5"> <BsTicketPerforated  size={30} style={{ transform: `rotate(-45deg)` }}/></div>
                    <div className="MontserratLight text-3xl font-bold text-gray-700">TKT-{String(id_ticket).padStart(4, '0')}</div>
                    <div className="flex flex-row MontserratLight text-2xl"> {iconElement}</div>
                </div>
                <div className="MontserratReg text-2xl"><b>{nom_tarea}</b><span className="text-gray-400"> | {tarea}</span></div>                
    </div>
    
    </>
  );
};

export default TicketTitulo;

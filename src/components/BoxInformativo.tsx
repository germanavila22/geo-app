import {
  FiSettings,   
  
  FiFolder,
  FiBox,
} from 'react-icons/fi';
import { LuGlobe } from 'react-icons/lu';
import { BiAnalyse } from 'react-icons/bi';
import { AiOutlineFall } from 'react-icons/ai';
import { TbReport } from 'react-icons/tb';
import { LuFileSpreadsheet } from 'react-icons/lu';
import { LuFlagTriangleLeft } from 'react-icons/lu';
type InfoBoxProps = {
  icono: string;
  titulo: string;
  cantidad: string;
  comentario: string;
  border?: string; // opcional para personalizar fondo
};

const iconMap: Record<string, React.ReactElement> = {
    FiHome: <FiSettings size={20} />,
    FiUser: <FiSettings size={20} />,
    FiSettings: <FiSettings size={20} />,
    GoGlobe: <LuGlobe size={25} />,
    FiBox: <FiBox size={25} />,
    FiFolder: <FiFolder size={20} />,
    BiAnalyse: <BiAnalyse size={50} />,
    AiOutlineFall: <AiOutlineFall size={50} />,
    Reporte: <TbReport size={50} />,
    HojaRe: <LuFileSpreadsheet size={50} />,
    Banderola: <LuFlagTriangleLeft size={50} />,
};

const BoxInformativo: React.FC<InfoBoxProps> = ({ icono, titulo, cantidad, comentario, border }) => {
const iconElement: React.ReactElement = iconMap[icono] ??<LuGlobe size={25} />; // Ícono por defecto
  return (
    <div className={`bg-white rounded-2xl shadow p-4 flex ${border}`}>
      {/* Icono - lado izquierdo 3/4 */}
      <div className=" items-center justify-center w-3/4">
        <div className="text-lg font-semibold text-gray-700">{titulo}</div>
        <div className="text-4xl font-bold text-gray-900">{cantidad}</div>
        <div className="text-xs text-gray-400 ">{comentario}</div>    
      </div>

      {/* Texto - lado derecho 1/4 */}
      <div className="w-1/4 flex items-center justify-center">
        <div className="text-5xl text-red-600 pl-5 mr-1">
          {iconElement}
        </div>
      </div>
    </div>
  );
};

export default BoxInformativo;

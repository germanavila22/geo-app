import GraficaAvance from './GraficaAvance';
//import { FaArrowUp } from 'react-icons/fa';
//import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
//import { BsArrowUp } from 'react-icons/bs';
import { LuArrowUpFromDot } from 'react-icons/lu';

interface BoxProps {  
  nombre: string;
  azimuth: number;
  inclinacion: number;
  profundidad: number;
  geologia:number;
  perforado:number;
  muestreo:number;
}

const BoxBarreno: React.FC<BoxProps> = ({ nombre,azimuth,inclinacion,profundidad,geologia,perforado,muestreo }) => {
    
    let grados: number = 0;
    let gradcandena:string = '';
    if (inclinacion === 90) {
        grados = 0;
        gradcandena = '0deg';
    }
    else if (inclinacion >= 0 && inclinacion <= 90) {
        grados = 90- inclinacion;
        gradcandena = `${grados}deg`;
    }
    else if (inclinacion < 0 ) {
        grados = 90 + Math.abs(inclinacion);
        gradcandena = `${grados}deg`;
    }
    
  return (
    <div className="bg-white rounded-2xl shadow p-3 w-full max-w-sm">
      
      {/* Parte inferior: nombre del barreno */}
      <div className="mt-1 text-center text-3xl font-medium text-gray-800">
        {nombre} 
      </div>
      <div className='text-center text-lg font-medium text-gray-800'>Prof {profundidad} </div>
      {/* Parte superior: Donut Chart Placeholder */}
      <div className="flex justify-center items-center h-45">
        {/* Aquí irá el gráfico de 3 aros */}
        <GraficaAvance perforado={perforado} geologia={geologia} muestreo={muestreo} />
        {/* Puedes reemplazar el div con el componente de gráfico real */}
        
      </div>

      {/* Parte media: rumbo e inclinación */}
      <div className="grid grid-cols-3 mt-4 text-center hover:bg-gray-100 pt-0.5 rounded-lg transition-colors duration-300">
        <div className=''>
          <div className="text-xs text-gray-500">Rumbo</div>
          <div className="flex justify-center items-center h-10">
            <LuArrowUpFromDot className="text-green-600" size={25} style={{ transform: `rotate(${azimuth}deg)` }} />
          </div>
          <div className="text-sm text-gray-700">{azimuth}°</div>
        </div>

        <div>
          <div className="text-xs text-gray-500">Inclinación</div>
          <div className="flex justify-center items-center h-10">
            <LuArrowUpFromDot className={`text-blue-600 transition-transform duration-300`} size={25} style={{ transform: `rotate(${grados}deg)` }}/>     
          </div>
          <div className="text-sm text-gray-700">{inclinacion}°</div>
        </div>

        <div>
          <div className="text-xs text-gray-500">Estatus</div>
          <div className="flex justify-center items-center h-10">
            <LuArrowUpFromDot className={`text-blue-600 `} size={25} style={{ transform: `rotate(${grados}deg)` }}/>     
          </div>
          <div className="text-sm text-gray-700">{inclinacion}°</div>
        </div>
      </div>

      
    </div>
  );
};

export default BoxBarreno;
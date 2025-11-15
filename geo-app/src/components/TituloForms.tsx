//import  { useState } from "react";
import { Popover } from 'antd';
import { IoAlert } from 'react-icons/io5';
interface BoxProps {  
  titulo: string;
  holeid: string;
  proyecto: string;
  depth: number;
  azimuth: number;
  dip:number;
  
}

export const TituloForm: React.FC<BoxProps> = ({ titulo,holeid,proyecto,depth,azimuth,dip}) => {
    
   
    
  return (
    <>       
        <div className="flex flex-col border-r border-gray-400 pr-4 mr-2 space-y-1">
            <span className=" text-gray-500 text-md font-bold">{titulo}</span>
            <span className="text-gray-800 text-3xl MontserratLight">{holeid}</span>
        </div>

        {/* Columna Derecha */}
        <div className="flex flex-col space-y-1">
            <span className="text-sm font-semibold text-gray-700">{proyecto}</span>
            <span className="text-sm text-gray-500">Profundidad: {depth} m</span>
            
        </div>
        <div className="flex flex-col space-y-1 pr-5">
            <span className="text-sm text-gray-500">Azimuth: {azimuth}</span>
            <span className="text-sm text-gray-500">Dip: {dip}</span>
            
        </div>
    </>
  );
};
interface Gaps{
    inicio:number;
    fin:number;
}
interface BoxPropsError {
    registros:number;
    gaps:Gaps[];
 }
 //const [mensajegap, setmensajegap] = useState("");

export const Tituloerrores: React.FC<BoxPropsError> = ({ registros,gaps}) => {
   const contenedor = (
    <div className="p-2">
      {gaps.map((gap, index) => (
        <div key={index} className="mb-2">
            <span className="text-sm text-gray-700">Gap {index + 1}: Desde {gap.inicio} m hasta {gap.fin} m</span>
        </div>
      ))}
    </div>
  );
  return (
    <>       
     
  <div className="flex flex-col space-y-1 pr-5">
        {/* Mensaje de registros */}
        {registros > 0 ? (
          <span className="text-sm text-gray-500">Registros: {registros}</span>
        ) : (
          <span className="text-sm text-gray-500">No se encontraron registros</span>
        )}

        {/* Mensaje de gaps */}
        {gaps.length === 0 ? (
            
          <span className="text-sm text-gray-500">No se encontraron gaps</span>
            
        ) : (
          <>
            <Popover content={contenedor} title="Gaps Detectados" trigger="click" placement="left">
                <span className="flex items-center gap-2 text-sm font-semibold text-red-600 cursor-help ">Hay Gaps<span className='animate-bounce '><IoAlert size={20} /></span></span>
            </Popover>
            
          </>
        )}
      </div>

    </>
  );
};
import { useMemo } from "react";

interface InfoBoxProps{
    titulo:string,
    fecha:string|Date,
    color:string
}

const SPANISH_MONTH_ABBR = [
  'Enero', 'Febrero', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

const Boxfecha: React.FC<InfoBoxProps> = ({ titulo, fecha, color  }) => {
      const parsedDate = useMemo(() => {
    try {
      let dateInput = fecha;
      // FIX para desplazamiento de zona horaria:
      // Cuando se pasa una cadena 'YYYY-MM-DD', JS la interpreta como UTC 00:00:00Z, lo que puede
      // desplazar la fecha un día hacia atrás en zonas horarias negativas.
      // Al añadir 'T00:00:00', la fecha se interpreta como medianoche local, manteniendo el día correcto.
      if (typeof fecha === 'string' && fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
        dateInput = fecha + 'T00:00:00';
      }

      return new Date(dateInput);
    } catch (error) {
      console.error("Fecha inválida proporcionada:", error);
      return new Date(); // Retornar la fecha actual como fallback
    }
  }, [fecha]);

  // Si la fecha no es válida, mostrar un mensaje de error simple
  if (isNaN(parsedDate.getTime())) {
    return (
      <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-xl max-w-32 mx-auto shadow-md">
        <p className="font-semibold text-sm">Error</p>
        <p className="text-xs">Fecha no válida.</p>
      </div>
    );
  }

    // Extracción y formato de las partes de la fecha
    const day = parsedDate.getDate();
    // El método getMonth() retorna 0 para enero y 11 para diciembre
    const monthAbbr = SPANISH_MONTH_ABBR[parsedDate.getMonth()];
    const year = parsedDate.getFullYear();
  return (
    <div className="max-w-32 aspect-square bg-white border border-gray-200 rounded-md  shadow-lg overflow-hidden  cursor-pointer">
        <div className="text-center mb-0.5">
            <p className={`${color} text-sm text-gray-800 truncate px-1 py-1   rounded-t-md MontserratReg`}>
            {titulo}
            </p>
        </div>
        <div className='flex flex-col'>
            <div className="flex h-[calc(100%-1.8rem)] items-stretch justify-between ">            
                {/* Lado Izquierdo: Día Grande y Año (Principal) */}
                <div className="flex flex-col flex-grow items-center justify-center  text-center  w-10/12">                                        
                    {/* Día con número grande (reducido a text-4xl) */}
                    <div className="MontserratReg text-4xl font-bold leading-none text-gray-900">
                        {day}
                    </div>                                            
                    {/* Año (debajo del día) */}
                    <div className="text-xs font-medium uppercase text-gray-500 mt-1">
                        {monthAbbr}
                    </div>
                </div>                                    
                {/* Lado Derecho: Mes (Orientación Vertical) */}
                <div className="MontserratReg flex flex-col flex-shrink-0 items-center justify-center  w-2/12">
                    <div 
                    className="text-lg font-semibold tracking-wider text-gray-700 transform rotate-90 whitespace-nowrap origin-center pt-3"
                    style={{width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center',}}
                >
                    {year}
                    </div>
                </div>
            </div>
        </div>
    </div>        
  );
};

export default Boxfecha;
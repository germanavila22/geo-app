import { useGeo, } from '../hooks/useGeoContext';
//import SeccionBarreno from '../components/Seccion';
import Boxfecha from '../components/Boxfecha'
import Seccion from '../components/SeccionP'
interface Collar {
  holeid: string;
  depth: number; // Profundidad final del barreno
}

/** Interfaz para la información de levantamiento (survey). */
interface Survey {
  holeid: string;
  depth: number; // Profundidad de la medición
  azimuth: number; // Acimut (0-360 grados)
  dip: number; // Inclinación (-90 a 90 grados)
}

/** Interfaz para la información geológica (geology). */
interface Geology {
  holeid: string;
  geolfrom: number; // Desde (metros)
  geolto: number; // Hasta (metros)
  litho: string; // Nombre de la litología
  color: string; // Color para el intervalo (ej: '#FF0000')
}  
interface Geologysurv{
    holeid: string;
  geolfrom: number; // Desde (metros)
  geolto: number; // Hasta (metros)
  litho: string; // Nombre de la litología
  color: string; // Color para el intervalo (ej: '#FF0000')
   azimuth: number; // Acimut (0-360 grados)
  dip: number; 
}
const exampleCollar: Collar[] = [{ holeid: "DH-24-001", depth: 580 }];

const exampleSurvey: Survey[] = [
    { holeid: "DH-24-001", depth: 0, azimuth: 35, dip: -40 }, 
    { holeid: "DH-24-001", depth: 50, azimuth: 36, dip: -41 },
    { holeid: "DH-24-001", depth: 100, azimuth: 37, dip: -42 },
    { holeid: "DH-24-001", depth: 150, azimuth: 38, dip: -43 },
   
];

const exampleGeology: Geology[] = [
    { holeid: "DH-24-001", geolfrom: 0, geolto: 45, litho: "Soil/Overburden", color: "#A0522D" },
    { holeid: "DH-24-001", geolfrom: 45, geolto: 45.1, litho: "Fault Zone", color: "#6A5ACD" }, 
    { holeid: "DH-24-001", geolfrom: 45.1, geolto: 110, litho: "Granodiorite", color: "#FFD700" },
    { holeid: "DH-24-001", geolfrom: 110, geolto: 115, litho: "Quartz Vein", color: "#FFFFFF" },
    { holeid: "DH-24-001", geolfrom: 115, geolto: 250, litho: "Diorite Porphyry", color: "#32CD32" },
    { holeid: "DH-24-001", geolfrom: 250, geolto: 580, litho: "Sheared Basalt", color: "#808080" },
    // Gap: 280-300m
];

const GeologySurvey: Geologysurv[] = [
    { holeid: "DH-24-001", geolfrom: 0, geolto: 45, litho: "Soil/Overburden", color: "#A0522D",azimuth:35, dip:-40 },
    { holeid: "DH-24-001", geolfrom: 45, geolto: 45.1, litho: "Fault Zone", color: "#6A5ACD",azimuth:35, dip:-40 }, 
    { holeid: "DH-24-001", geolfrom: 45.1, geolto: 50, litho: "Granodiorite", color: "#FFD700",azimuth:35, dip:-41 },
    { holeid: "DH-24-001", geolfrom: 50, geolto: 100, litho: "Granodiorite", color: "#FFD700",azimuth:36, dip:-42 },
    { holeid: "DH-24-001", geolfrom: 100, geolto: 110, litho: "Granodiorite", color: "#FFD700",azimuth:36, dip:-42 },
    { holeid: "DH-24-001", geolfrom: 110, geolto: 115, litho: "Quartz Vein", color: "#FFFFFF",azimuth: 37, dip: -42 },
    { holeid: "DH-24-001", geolfrom: 115, geolto: 150, litho: "Diorite Porphyry", color: "#32CD32",azimuth: 37, dip: -42 },
    { holeid: "DH-24-001", geolfrom: 115, geolto: 250, litho: "Diorite Porphyry", color: "#32CD32",azimuth: 38, dip: -43 },
    { holeid: "DH-24-001", geolfrom: 250, geolto: 580, litho: "Sheared Basalt", color: "#808080" ,azimuth: 38, dip: -43 },
    // Gap: 280-300m
];



const Caratula = () => {
    const { state } = useGeo();
    const formatMiles = (num: number) =>
    new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    }).format(num);

    return (
    <>
        
        <div className="pl-4 pt-4  rounded-md bg-white h-dvh">
            {state.holeid.id_collar ===0?
              <div className="MontserratSemiBold w-full pl-2 flex flex-col sm:flex-row  gap-4  justify-center items-center" >
                 Debes selecciondar un collar para ver la caratula.
                  <Seccion 
                                collar_array={exampleCollar} 
                                survey_array={exampleSurvey} 
                                geology_array={exampleGeology}/> 
                                
                </div>
            :<div className='  bg-white shadow-md'>
                <div className="flex flex-row">
                    <div className="h-fit  flex-3/8 pl-2">
                        <div className='text-base MontserratReg text-gray-500'>Holeid</div>
                        <div className='text-4xl MontserratLight   text-gray-900 '>{state.holeid.holeid}</div>
                        
                        <div className='text-base MontserratReg text-gray-500 pt-4'>Proyecto</div>
                        <div className='text-xl MontserratReg   text-gray-900 '>{state.holeid.proyecto}</div>
                        
                        <div className='text-base MontserratReg text-gray-500 pt-4'>Produndidad</div>
                        <div className='text-xl MontserratReg   text-gray-900 '>{state.holeid.depth}m</div>
                        
                        <div className='text-base MontserratReg text-gray-500 pt-4'>Coordenadas</div>
                        <div className="flex flex-col sm:flex-row justify-between w-full gap-4">                            
                            <div className="flex flex-col w-full text-center sm:text-left">
                                <span className="MontserratReg text-sm border-b border-gray-300">Este</span>
                                <span className="MontserratReg text-xl text-gray-900">
                                    {formatMiles(state.holeid.east)} 
                                </span>
                            </div>                            
                            <div className="flex flex-col w-full text-center sm:text-left">
                                <span className="MontserratReg text-sm border-b border-gray-300">Norte</span>
                                <span className="MontserratReg text-xl">
                                {formatMiles(state.holeid.north)}
                                </span>
                            </div>                            
                            <div className="flex flex-col w-full text-center sm:text-left">
                                <span className="MontserratReg text-sm border-b border-gray-300">RL</span>
                                <span className="MontserratReg text-xl">
                                {formatMiles(state.holeid.rl)}
                                </span>
                            </div>
                        </div>
                        
                        <div className='text-base MontserratReg text-gray-500 pt-4 '>Rumbo</div>
                        <div className="flex flex-col sm:flex-row justify-between columns-3 w-full gap-4">
                            {/* Bloque 1 */}
                            <div className="flex flex-col w-full text-center sm:text-left flex-1/3">
                                <span className="MontserratReg text-sm border-b border-gray-300">Azimut</span>
                                <span className="MontserratReg text-xl text-gray-900">
                                    {formatMiles(state.holeid.azimuth)} 
                                </span>
                            </div>

                            {/* Bloque 2 */}
                            <div className="flex flex-col w-full text-center sm:text-left flex-1/3">
                                <span className="MontserratReg text-sm border-b border-gray-300">Dip</span>
                                <span className="MontserratReg text-xl">
                                {formatMiles(state.holeid.dip)}
                                </span>
                            </div>
                            <div className="flex flex-col w-full text-center sm:text-left flex-1/3">
                            </div>


                            
                        </div>
                        <div className='flex flex-row gap-2 '>
                            <div><Boxfecha titulo='Fecha inicio' fecha={"2025-02-22"} color="bg-red-100" /></div>
                            <div><Boxfecha titulo='Fecha inicio' fecha={"2025-02-22"} color="bg-blue-100" /></div>                            
                        </div>
                    </div>
                    <div className="  flex-5/8">
                                <Seccion 
                                collar_array={exampleCollar} 
                                survey_array={exampleSurvey} 
                                geology_array={exampleGeology}/> 
                                </div>                   
                </div>
                
               
            </div>
            }                    

        
        </div>
    </>
    )
};
export default Caratula;
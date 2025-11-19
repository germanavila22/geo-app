import { useGeo, } from '../hooks/useGeoContext';


const Caratula = () => {
    const { state } = useGeo();
    const formatMiles = (num: number) =>
    new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    }).format(num);

    return (
    <>
        
        <div className="p-4 space-y-4 bg-white h-full rounded-md">
            {state.holeid.id_collar ===0?
              <div className="MontserratSemiBold w-full pl-2 flex flex-col sm:flex-row  gap-4  justify-center items-center" >
                 Debes seleccionar un collar para ver la caratula.
                </div>
            :<div className='  bg-white shadow-md'>
                <div   className="w-full flex flex-col sm:flex-row    justify-center items-center" >
                    
                    <div className='w-full  flex flex-col sm:flex-row  items-center justify-end '>
                        <div className='border-l-2 border-l-red-700 flex-3/8 pl-4 py-2 mr-4'>
                            <div className='text-base MontserratReg text-gray-500'>Holeid</div>
                            <div className='text-4xl MontserratLight   text-gray-800 pb-2'>{state.holeid.holeid}</div>
                            <div className='text-base MontserratReg text-gray-500'>Proyecto</div>
                            <div className='text-2xl MontserratReg   text-gray-800 pb-2'>{state.holeid.proyecto}</div>
                            <div className='text-base MontserratReg text-gray-500 '>Coordenadas</div>
                            <div className="flex flex-col sm:flex-row justify-between w-full gap-4">
                                {/* Bloque 1 */}
                                <div className="flex flex-col w-full text-center sm:text-left">
                                    <span className="MontserratReg text-sm border-b border-gray-400">Este</span>
                                    <span className="MontserratReg text-xl text-gray-900">
                                     {formatMiles(state.holeid.east)} 
                                    </span>
                                </div>

                                {/* Bloque 2 */}
                                <div className="flex flex-col w-full text-center sm:text-left">
                                    <span className="MontserratReg text-sm border-b border-gray-400">Norte</span>
                                    <span className="MontserratReg text-xl">
                                    {formatMiles(state.holeid.north)}
                                    </span>
                                </div>

                                {/* Bloque 3 */}
                                <div className="flex flex-col w-full text-center sm:text-left">
                                    <span className="MontserratReg text-sm border-b border-gray-400">RL</span>
                                    <span className="MontserratReg text-xl">
                                    {formatMiles(state.holeid.rl)}
                                    </span>
                                </div>
                            </div>

                           
                        </div>
                        <div className=' flex-5/8'>Proyecto: {state.holeid.proyecto} - HoleID: {state.holeid.holeid}</div>
                    </div>
                </div>
            </div>
            }                    

        <h1 className="text-2xl font-bold text-gray-800">Carátula del Proyecto</h1>
        </div>
    </>
    )
};
export default Caratula;
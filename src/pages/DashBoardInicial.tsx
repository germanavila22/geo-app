
import BoxBarreno from "../components/BoxBarreno";
import BoxInformativo from "../components/BoxInformativo";


export default function DashBoardInicial() {
  return (
    <>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-3 border-b-2 border-gray-200 pb-3">
            <BoxInformativo key={1} titulo='Metros perforados' cantidad='500m' comentario='semanal' border='bg-gray-100' icono="HojaRe"/>
            <BoxInformativo key={2}titulo='Indicar Metros' cantidad='5,000' comentario='sugerencia' border='bg-gray-100' icono="Reporte"/>
            <BoxInformativo key={3}titulo='Metros perforados' cantidad='500m' comentario='semanal' border='bg-gray-100' icono="Banderola"/>
            <BoxInformativo key={4}titulo='Metros perforados' cantidad='500m' comentario='semanal' border='bg-gray-100' icono="AiOutlineFall"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-3">
            {/* Aquí puedes agregar más componentes o contenido */}
            <BoxBarreno key={10} nombre='BD-222' azimuth={350} inclinacion={-115} profundidad={50} perforado={55} geologia={25} muestreo={10}/>
            <BoxBarreno key={20} nombre='BD-022' azimuth={130} inclinacion={20} profundidad={500}  perforado={85} geologia={25} muestreo={10}/>
            <BoxBarreno key={30} nombre='BD-022' azimuth={85} inclinacion={-20} profundidad={500} perforado={65} geologia={25} muestreo={10}/>
            <BoxBarreno key={40} nombre='BD-022' azimuth={180} inclinacion={-175} profundidad={500} perforado={75} geologia={25} muestreo={10}/>
            <BoxBarreno key={50} nombre='BD-022' azimuth={130} inclinacion={20} profundidad={500} perforado={58} geologia={25} muestreo={10}/>                    
          </div>
          
    </>
  )
}

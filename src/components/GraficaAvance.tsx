// DonutTriple.tsx
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

type DonutTripleProps = {
  perforado: number;  // porcentaje
  geologia: number;   // porcentaje
  muestreo: number;   // porcentaje
};

const GraficaAvance: React.FC<DonutTripleProps> = ({ perforado, geologia, muestreo }) => {
  // Cada anillo necesita dos valores: valor y el resto para completar el 100%
  const ringData = (etiqueta:string,value: number) => [
    { name: etiqueta, value },
    { name: `Pend ${etiqueta} `, value: 100 - value },
  ];

  return (
    <>
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        {/* Capa 1: Muestreo (exterior) */}
        <Pie
          data={ringData("Muestreo ",muestreo)}
          dataKey="value"
          innerRadius={70}
          outerRadius={90}
          startAngle={90}
          endAngle={-270}
        >
          <Cell fill="#93288F" /> {/* Azul oscuro */}
          <Cell fill="#CCCCCC" /> {/* Gris claro */}
        </Pie>

        {/* Capa 2: Geología (medio) */}
        <Pie
          data={ringData("Geologia ",geologia)}
          dataKey="value"
          innerRadius={50}
          outerRadius={70}
          startAngle={90}
          endAngle={-270}
        >
          <Cell fill="#ED1B24" />        
          <Cell fill="#DDDDDD" />
        </Pie>

        {/* Capa 3: Perforación (interior) */}
        <Pie
          data={ringData("Perforado ",perforado)}
          dataKey="value"
          innerRadius={30}
          outerRadius={50}
          startAngle={90}
          endAngle={-270}
        >
          <Cell fill="#F6871E" /> {/* Rojo */}
          <Cell fill="#EEEEEE" />
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
    
    </>
  );
};

export default GraficaAvance;

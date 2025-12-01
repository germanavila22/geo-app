import { useEffect, useRef } from "react";

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
/**
 * Combina los arrays de Geology y Survey para generar un array Geologysurv.
 * Se asume que los arrays están ordenados por 'depth' y 'geolfrom' respectivamente.
 */
function combineGeologyAndSurvey(
  geology: Geology[],
  survey: Survey[]
): Geologysurv[] {
  // 1. Organizar el Survey por 'holeid' para acceso rápido.
  const surveyByHole = survey.reduce((acc, s) => {
    if (!acc[s.holeid]) {
      acc[s.holeid] = [];
    }
    acc[s.holeid].push(s);
    return acc;
  }, {} as { [key: string]: Survey[] });

  const combinedData: Geologysurv[] = [];

  for (const geolInterval of geology) {
    const holeSurvey = surveyByHole[geolInterval.holeid];

    if (!holeSurvey || holeSurvey.length === 0) {
      console.warn(
        `Advertencia: No se encontraron datos de Survey para el pozo ${geolInterval.holeid}. Intervalo omitido.`
      );
      continue;
    }

    // Asegurarse de que el Survey esté ordenado por profundidad.
    holeSurvey.sort((a, b) => a.depth - b.depth);

    let currentFrom = geolInterval.geolfrom;

    // 2. Iterar sobre el Survey para cortar el intervalo geológico.
    // El 'startSurveyIndex' encuentra el primer punto de survey *en o antes* del inicio del intervalo geológico.
    const startSurveyIndex = holeSurvey.findIndex(s => s.depth >= currentFrom);
    
    // Si no hay un punto de survey antes del inicio (e.g., el primer survey es a 50m y la geología empieza a 0m),
    // buscamos el último punto de survey que sea menor o igual al inicio del intervalo.
    let surveyIndex = startSurveyIndex > 0 ? startSurveyIndex - 1 : 0;
    
    // Si el primer punto de survey está después del inicio de la geología, usamos el primer punto si es el de 0m o el más cercano
    if (startSurveyIndex === 0 && holeSurvey[0].depth > currentFrom && currentFrom !== 0) {
        surveyIndex = 0; // Se asume que el primer punto de survey aplica desde 0m.
    } else if (startSurveyIndex > 0 && holeSurvey[startSurveyIndex - 1].depth <= currentFrom) {
        // Usamos el punto inmediatamente anterior o en 'geolfrom'
        surveyIndex = startSurveyIndex - 1;
    }


    while (currentFrom < geolInterval.geolto) {
      const currentSurvey = holeSurvey[surveyIndex];

      // 3. Determinar el punto de corte (To) del segmento
      let nextSurveyDepth = Infinity;
      if (surveyIndex + 1 < holeSurvey.length) {
        nextSurveyDepth = holeSurvey[surveyIndex + 1].depth;
      }

      // El segmento termina en el final del intervalo geológico o en el próximo punto de Survey, lo que ocurra primero.
      const segmentTo = Math.min(
        geolInterval.geolto,
        nextSurveyDepth
      );

      // 4. Crear el nuevo segmento combinado
      const newSegment: Geologysurv = {
        holeid: geolInterval.holeid,
        geolfrom: currentFrom,
        geolto: segmentTo,
        litho: geolInterval.litho,
        color: geolInterval.color,
        azimuth: currentSurvey.azimuth,
        dip: currentSurvey.dip,
      };

      combinedData.push(newSegment);

      // 5. Preparar para la siguiente iteración
      currentFrom = segmentTo;

      // Si el final del segmento es el próximo punto de Survey, avanzamos al siguiente punto de Survey.
      if (currentFrom === nextSurveyDepth) {
        surveyIndex++;
      }
      
      // Manejar el caso donde el punto de survey está justo en el final.
      if (currentFrom === geolInterval.geolto && surveyIndex + 1 < holeSurvey.length && currentFrom === holeSurvey[surveyIndex + 1].depth) {
          surveyIndex++;
      }

      // Si ya hemos procesado el último punto de Survey y no hemos llegado al final de la geología,
      // la última medición de Survey se aplica al resto del pozo.
      if (surveyIndex >= holeSurvey.length) {
        break; 
      }
    }
  }

  return combinedData;
}

const Seccion =({ collar_array, survey_array, geology_array }: {
    collar_array: Collar[];
    survey_array: Survey[];
    geology_array: Geology[];
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    console.log(collar_array)
    console.log(survey_array)
    console.log(geology_array)

    useEffect(() => {
      const result = combineGeologyAndSurvey(geology_array, survey_array);
      console.log("el result",result)
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Limpia el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Estilo opcional
      ctx.strokeStyle = "#880000";
      ctx.lineWidth = 1;

      // Dibuja la línea
      ctx.beginPath();
      ctx.moveTo(0, 0);   // Punto inicial
      ctx.lineTo(300, 300); // Punto final
      ctx.stroke();
    }, []);

    return(
        <>
        <div className="w-full h-full border">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            style={{ border: "1px solid #111111" }}
          />
        </div>
        </>
    )
}
export default Seccion
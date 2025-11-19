export type Registro = {
 
  geolfrom:number;
  geolto: number;
 
};

export type Gap = {
  inicio: number;
  fin: number;
};

/**
 * Calcula los huecos (gaps) entre intervalos de geología registrados.
 * Si el primer intervalo no empieza en 0, crea un gap desde 0.
 *
 * @param registros - Arreglo de intervalos con geolfrom y geolto
 * @param profundidad - Profundidad total del barreno
 * @returns Lista de objetos {desde, hasta} que representan los huecos
 */
export function ObtenerGaps(registros: Registro[], profundidad: number): Gap[] {
  const gaps: Gap[] = [];

  if (!Array.isArray(registros) || registros.length === 0) {
    // Si no hay intervalos, todo es un gap
    return profundidad > 0 ? [{ inicio: 0, fin: profundidad }] : [];
  }

  // Normalizar y ordenar los intervalos por 'geolfrom'
  const ordenados = [...registros]
    .map(r => ({
      from: (r.geolfrom),
      to: (r.geolto),
    }))
    .filter(r => !isNaN(r.from) && !isNaN(r.to))
    .sort((a, b) => a.from - b.from);

  let current = 0;

  for (const r of ordenados) {
    if (r.from > current) {
      // Si el siguiente intervalo empieza después del actual, hay gap
      gaps.push({ inicio: current, fin: r.from });
    }
    // Avanzar el puntero hasta el final del intervalo actual
    current = Math.max(current, r.to);
  }

  // Si al final hay espacio sin cubrir hasta la profundidad total
  if (current < profundidad) {
    gaps.push({ inicio: current, fin: profundidad });
  }

  return gaps;
}

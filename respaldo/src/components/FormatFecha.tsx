export const formatFecha = (fecha: string) => {
  if (!fecha) return "";
   const [year, month, day] = fecha.split("T")[0].split("-");
  const meses = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
  return `${day} ${meses[parseInt(month, 10) - 1]} ${year.slice(-2)}`;
}


export const formatFechayymmdd = (fechaISO: string) => {
  if (!fechaISO) return ""
  const fecha = new Date(fechaISO);
  const fechaFormateada = fecha.toISOString().split("T")[0];  
  
return fechaFormateada ;
}
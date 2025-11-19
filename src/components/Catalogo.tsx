import axios from "axios";
import React from "react";

type GeologicalRecord = {
  id: number;
  nombre: string;
  estatus:number;
  descripcion: string;
  color: string;
  pattern: string;
};
type Catalogo = "lithology" | "structure" | "zone"


export function Catalogo(tipocatalogo: Catalogo) {
  const [catalogo, setcatalogo] = React.useState<GeologicalRecord[]>([]);

  React.useEffect(() => {
    let ruta = '';
    switch (tipocatalogo) {
      case "lithology":
        ruta = "http://192.168.1.64:3000/lithoview";
        break;
      case "structure":
        ruta = "http://192.168.1.64:3000/structview";
        break;
      case "zone":
        ruta = "http://192.168.1.64:3000/zoneview";
        break;
      default:
        break;
    }
    if (ruta) {
      axios.post(ruta, "")
        .then(response => {
         // console.log("respuesta", response.data);
          if (response.data.success) {
           // console.log("la data", response.data.data);
            setcatalogo(response.data.data);
          } else {
           // console.log("no trajo nada");
            setcatalogo([]);
          }
          // aquí puedes actualizar el state con los datos si es necesario
        })
        .catch(error => {
          console.error("Error al guardar los datos:", error);
        });
    }
  }, [tipocatalogo]);

  return {catalogo}
}
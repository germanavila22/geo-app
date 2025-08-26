export type Usuario={
    idusuario:number,
    nombre:string, 
    username:string,
    email:string,    
}
export type Collar={
  id_collar:number,
  holeid:string,
  depth:number
}
export type Menu={
    id_menu:number,
    description:string,
    path:string,
    icon:string
    id_padre:number,
}



export type TypeCollar = {
  id_collar: number;
  holeid: string;
  id_proyecto: number;
  holeidplan: string;
  east: number;
  north: number;
  rl: number;
  depth: number;
  dip: number;
  azimuth: number;
  fecha_inicio: string;
  fecha_final: string;
  holetype: string;
  estatus: number;
  area: string;
};
export type TypeCollardos = {
  id_collar: number;
  holeid: string;
  id_proyecto: number;
  east: number;
  north: number;
  rl: number;
  depth: number;
  dip: number;
  azimuth: number;
}
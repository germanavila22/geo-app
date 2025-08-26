import { useContext } from "react"
import { GeoContext } from "../context/geocontext"

export const useGeo =()=>{
    const context=useContext(GeoContext)
    if(!context){
        throw new Error("No estas usando el contexto");
        
    }
    return context
}

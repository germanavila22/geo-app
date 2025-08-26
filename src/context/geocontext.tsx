import { useReducer,createContext, type Dispatch,type ReactNode } from "react"
import { geoReducer,initialState, type GeoActions, type GeoState } from "../reducers/georeducer"

type GeoContextProps={
    state:GeoState
    dispatch:Dispatch<GeoActions>
    
}
type GeoProviderProps={
    children:ReactNode
}
export const GeoContext=createContext<GeoContextProps>(null!)

export const GeoProvider=({children}:GeoProviderProps)=>{

    const[state,dispatch]=useReducer(geoReducer,initialState)
    ///aqui se pueden agregar mas variables para que sean tomadas como globales    

    return(
        <GeoContext.Provider
        value={{
            state,
            dispatch
            
        }}>
            {children}
        </GeoContext.Provider>
    )
}
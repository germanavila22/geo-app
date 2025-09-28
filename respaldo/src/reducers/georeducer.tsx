
import type { Usuario,Menu,Collar } from "../Types/Index"
export type GeoActions=
    {type:'holeid',payload:{holeid:Collar}}|
    {type:'loguser',payload:{esUsuario:boolean, usuario?:Usuario,menu?:Menu[]}}


export type GeoState={
    holeid:Collar
    esUsuario:Boolean
    usuario:Usuario|undefined
    menu:Menu[]
}
///creo la funcion para mantener el usuario activo

const iniciaUser=()=>{
    const str = localStorage.getItem('esUsuario')
    const lsbudget= str === 'true'
    return lsbudget ? lsbudget :false
}
const iniciaUsuario=()=>{
    const str = localStorage.getItem('Usuario')
    if(str){
        return JSON.parse(str)
    }
    return {
        idusuario:0,
        nombre:"",
        username:"",
        email:""
    }
}
const iniciaMenu=()=>{
    const str = localStorage.getItem('Menu')
    if(str){
        return JSON.parse(str)
    }
    return []
}
export const initialState:GeoState={
    holeid:{id_collar:0,holeid:"",depth:0},
    esUsuario:iniciaUser(),
    usuario:iniciaUsuario(),
    menu:iniciaMenu()
}

export const geoReducer=(
    state:GeoState=initialState,
    action:GeoActions
)=>{
    if(action.type==='holeid'){
        return{...state,
            holeid:action.payload.holeid
        }
    }
    if(action.type==='loguser'){
        return{...state,
            esUsuario:action.payload.esUsuario,
            usuario:action.payload.usuario,
            menu:action.payload.menu ? action.payload.menu : []

        }

    }
    return state
}
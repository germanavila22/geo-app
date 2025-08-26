import React, { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useGeo } from "../hooks/useGeoContext"
import axios from "axios";


export const Login = () => {
    const navigate = useNavigate();
    const {dispatch } = useGeo()
    
      
    ///genero la funcion para validar el login
    ///state para controlar el mostrar el mensaje
    const [stmensaje,setStmensaje]=useState('')
    const [stvalido,setStvalido]=useState(false)
    ///state para controlar la info de los campos usuario y pass
    const [stform,setStform]=useState({username:'',password:''})

    ///funcion para guardar en el state from los datos
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStmensaje("")
        const { name, value } = e.target;
        const usuarioValidoRegex = /^[a-zA-Z0-9@._-]+$/;
        if(!usuarioValidoRegex.test(value) && (!stform.username.trim() && !stform.password.trim()) ){
            setStmensaje("Caracter invalido")
            setStvalido(false)
            return
        }
        setStform(() => ({
        ...stform,
        [name]: value,
        }));
        if(stform.username.trim() && stform.password.trim()){
            setStvalido(true)
        }
        else{
            setStvalido(false)
            setStmensaje("")
        }

    };

    ///sirve para que cuando des enter te pasa el elemento password
    const refpass = useRef<HTMLInputElement>(null);
    const refuser = useRef<HTMLInputElement>(null);
    const handleKey=(e:React.KeyboardEvent<HTMLElement>)=>{
        
        if(e.key==='Enter'){
            refpass.current?.focus()
            setStmensaje("")
        }
    }
    
    ///funcion principal de login
    const login =(e:React.FormEvent)=>{
        e.preventDefault()        
        ///expresion para solo permitir ciertos caracteres
        const usuarioValidoRegex = /^[a-zA-Z0-9@._-]+$/;

        if(!stform.username.trim()){
            setStmensaje("error en poner el Usuario")
            console.log("error")
            refuser.current?.focus()
            return
        }
        if (!usuarioValidoRegex.test(stform.username)) {
            setStmensaje('❌ El usuario solo puede contener letras, números y los símbolos @ . _ -');
            return;
        }
        if(!stform.password.trim()){
            setStmensaje("error en poner el Password")
            refpass.current?.focus()
            return
        }
        if (!usuarioValidoRegex.test(stform.password)) {
            setStmensaje('❌ La contraseña solo puede contener letras, números y los símbolos @ . _ -');
            setStform(() => ({
            ...stform,
            password: "",
            }));
            return;
        }
        ///mando los datos al backend
        axios.post('http://localhost:3000/auth', {
            username: stform.username,
            password: stform.password
        })
        .then((response) => {
            console.log("respuesta del backend")
            console.log(response.data.menu);
            if(response.data.authenticated){                
                dispatch({type:'loguser',
                    payload:{esUsuario:true,
                        usuario:{
                            idusuario:response.data.id,
                            nombre:response.data.nombre,
                            username:response.data.username,
                            email:response.data.email
                        }
                        ,menu:response.data.menus
                    }}
                  )
                  navigate('/home'); 
            }
            else{
                setStmensaje("Usuario o contraseña incorrectos")                
            }
        })
        .catch((error) => {
            
            console.log('Error al iniciar sesión:', error.data);
            console.log(error.response.data.mensaje)
            setStmensaje(error.response.data.mensaje)
            
        });  
        /*setStmensaje("todo bien")
        setStuser(newuser)
        dispatch({type:'loguser',
            payload:{
                esUsuario:true
            }
        })
        localStorage.setItem('esUsuario', 'true');   
        navigate('/home');  
       
        */
    }

  return (
    <>
    <div
      className="w-screen h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          'url("/fondo1.jpg"',
        backgroundColor: '#666666',
        backgroundBlendMode: 'multiply',
      }}
    ><div className='bg-white/100 rounded-2xl shadow-xl flex w-full max-w-3xl overflow-hidden'>
        <div className='hidden lg:flex items-center justify-center p-6 w-1/2'><img
            src="/logo_fid.png"
            alt="Logo"
            className="h-full object-contain"
          /></div>
            <div className="p-8 w-full lg:w-1/2">
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
              <form className="space-y-4" onSubmit={login}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Usuario</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Ingresa tu usuario"
                    onKeyDown={handleKey}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  text-gray-700">Contraseña</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="*****"
                    ref={refpass}
                    onChange={handleChange}
                  />
                </div>
                
                  {stmensaje? <div className="text-center bg-red-200 text-red-950 rounded-md p-2">{stmensaje}</div>:
                  <div className="text-right">
                  <a href="#" className="text-sm text-red-600 hover:underline p-2">
                    ¿Olvidaste tu contraseña?
                  </a>
                  </div>
                  }
                  
                
                
                <input
                  type="submit"
                  className="w-full  py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 transition duration-300 disabled:bg-gray-500"
                  disabled={!stvalido}
                  value="Iniciar Sesión"
                />
                
                
                
              </form>
            </div>
      </div>
    </div>
    </>
  )
}

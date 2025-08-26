import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import './App.css'
import App from './App.tsx'
import { GeoProvider } from './context/geocontext.tsx'
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GeoProvider>
      <BrowserRouter>
        <App />    
      </BrowserRouter>
    </GeoProvider>
  </StrictMode>,
)

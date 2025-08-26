
import React from 'react';
import { Link } from 'react-router-dom';


interface ItemMenuProps {
  id_padre: number;
  icono: React.ReactElement;
  descripcion: string;
  link: string;
}

const MenuItem: React.FC<ItemMenuProps> = ({ id_padre, icono, descripcion, link }) => {
    const fondo = id_padre === 0 ? 'border-l border-amber-600 group flex items-center cursor-pointer p-1 hover:bg-gray-100 hover:shadow-xl transition' : 'group flex items-center cursor-pointer p-2 pl-1 hover:bg-gray-100 hover:shadow-xl transition';    
    const content = (
        <div className=''>
              <div className={fondo}>              
                  <div className="p-2 rounded text-red-700 group-hover:bg-red-700 group-hover:text-white transition">
                  {icono}
                  </div>              
                  <div className="ml-3 text-sm text-gray-800">
                  {descripcion}
                  </div>
              </div>             
          </div>
    );
  return link ? (
    <Link to={link}>
      {content}
    </Link>
  ) : (
   <> {content}</>
  );
}

export default MenuItem;

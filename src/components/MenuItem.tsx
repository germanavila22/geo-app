
import React from 'react';
import { Link } from 'react-router-dom';


interface ItemMenuProps {
  id_padre: number;
  icono: React.ReactElement;
  descripcion: string;
  link: string;
}

const MenuItem: React.FC<ItemMenuProps> = ({ id_padre, icono, descripcion, link }) => {
    const fondo = id_padre === 0 ? 'border-l border-red-800 group flex items-center cursor-pointer p-1 hover:bg-gray-50 hover:shadow-2xl transition-all duration-500 ease-in-out' : 'group flex items-center cursor-pointer p-1 pl-1 hover:bg-gray-50 hover:shadow-2xl transition-all duration-500 ease-in-out';    
    const content = (
        <div className=''>
              <div className={fondo}>              
                  <div className="p-2 rounded text-red-500 group-hover:bg-red-700 group-hover:text-white ">
                  {icono}
                  </div>              
                  <div className="ml-3 text-sm text-white group-hover:text-gray-800 MontserratRegular">
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

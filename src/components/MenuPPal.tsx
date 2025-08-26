import MenuItem from './MenuItem';
import {
  FiSettings,   
  FiChevronRight, 
  FiFolder,
  FiBox,
} from 'react-icons/fi';
import { GoGlobe } from 'react-icons/go';
import { BiAnalyse } from 'react-icons/bi';
import { GiMineralHeart } from 'react-icons/gi';
import type { Menu } from "../Types/Index";
import type React from 'react';
 
 
const iconMap: Record<string, React.ReactElement> = {
    FiHome: <FiSettings size={20} />,
    FiUser: <FiSettings size={20} />,
    FiSettings: <FiSettings size={20} />,
    GoGlobe: <GoGlobe size={25} />,
    FiBox: <FiBox size={25} />,
    FiFolder: <FiFolder size={20} />,
    BiAnalyse: <BiAnalyse size={20} />,
    GiMineralHeart: <GiMineralHeart size={25} />,
};

interface MenuPPalProps {
    menuItems:Menu[]
}

const MenuPpal: React.FC<MenuPPalProps> = ({ menuItems }) => {
  return (
    <>
        <aside className="w-64 flex flex-col bg-gray-50 m-3 rounded-2xl shadow-2xl">
            <div className="p-2 font-bold text-2xl flex align-middle items-center">
            <div className='p-2'><img src="/logo.jpg" alt="Logo" className="h-10" /></div><div className='deep-gray'> MENÚ</div>
            </div>
            <hr className='my-2 h-px border-0 bg-gradient-to-r from-transparent via-gray-400 to-transparent'></hr>
            <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
                const iconElement: React.ReactElement = iconMap[item.icon] ?? <FiChevronRight size={20} />; // Ícono por defecto
                return (
                <MenuItem
                    key={item.id_menu}
                    id_padre={item.id_padre}
                    descripcion={item.description}
                    link={item.path}
                    icono={iconElement}
                />
                );
            })}            
            </nav>
        </aside>
    </>
  )
}
export default MenuPpal;

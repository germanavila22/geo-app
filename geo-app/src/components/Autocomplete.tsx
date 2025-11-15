import React, { useState, useEffect, useRef } from 'react';

type Elemento = {
  id_opcion: number;
  descripcion: string;
};

interface AutocompleteSimpleProps {
  name: string;
  value: number | null;
  onChange: (name: string, value: number | null) => void;
  opciones: Elemento[];
  placeholder?: string;
  ref?: React.Ref<HTMLInputElement>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;  
}

const AutocompleteSimple: React.FC<AutocompleteSimpleProps> = ({
  name,
  value,
  onChange,
  opciones,
  placeholder = '',
  ref,
  onKeyDown
}) => {
  const [texto, setTexto] = useState('');
  const [filtrados, setFiltrados] = useState<Elemento[]>([]);
  const [mostrarLista, setMostrarLista] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  //codigo que permite usar el ref desde el componente padre
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  useEffect(() => {
    const seleccionado = opciones.find(opt => opt.id_opcion === value);
    setTexto(seleccionado ? seleccionado.descripcion : '');
  }, [value, opciones]);

  const seleccionarElemento = (elemento: Elemento, avanzar = false) => {
    setTexto(elemento.descripcion);
    onChange(name, elemento.id_opcion);
    setMostrarLista(false);

    if (avanzar && inputRef.current) {
      const form = inputRef.current.form;
      const index = Array.prototype.indexOf.call(form, inputRef.current);
      const siguiente = form?.elements[index + 1] as HTMLElement;
      siguiente?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTexto(val);
    if (val.trim() === '') {
      // si se borró todo, limpiar selección
      setFiltrados([]);
      setMostrarLista(false);
      onChange(name, null);
      return;
    }
    const coincidencias = opciones.filter(opt =>
      opt.descripcion.toLowerCase().includes(val.toLowerCase())
    );
    setFiltrados(coincidencias);
    setMostrarLista(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === 'Tab') && filtrados.length > 0) {
      e.preventDefault();
      seleccionarElemento(filtrados[0], true);
    }
  };

  const handleFocus = () => {
    if (filtrados.length > 0) {
      setMostrarLista(true);
    }
  };

  const handleBlur = () => {
    // Permitir que se ejecute onMouseDown antes de ocultar
    setTimeout(() => setMostrarLista(false), 100);
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        name={name}
        type="text"
        value={texto}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
      autoComplete='off'
        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
      />
      {mostrarLista && filtrados.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow max-h-40 overflow-y-auto">
          {filtrados.map((opt) => (
            <li
              key={opt.id_opcion}
              onMouseDown={() => seleccionarElemento(opt)}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {opt.descripcion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteSimple;

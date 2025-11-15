import React, { useState, useRef, useEffect } from 'react';
import { LuSearch } from 'react-icons/lu';


interface DataRecord {
		id_collar :number
		holeid:     string
		depth:number
		east        :number    
		north           :number
		rl              :number
		id_proyecto     :number
		nombre_proyecto :string
    dip:number
    azimuth:number
}

interface AutocompleteSearchProps {
  data: DataRecord[];
  onSelect: (record: DataRecord) => void;
  onChange?: (searchTerm: string) => void;
  placeholder?: string;
}

export const AutocompleteSearch: React.FC<AutocompleteSearchProps> = ({
  data,
  onSelect,
  onChange,
  placeholder = "Buscar por ID Collar, Hole ID o Depth..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<DataRecord[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState<DataRecord | null>(null);
  //console.log(selectedRecord)
  if (selectedRecord) {
    // Aquí puedes manejar el registro seleccionado, por ejemplo, enviarlo al componente padre
    //console.log('Registro seleccionado:', selectedRecord);
  }
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrar datos basado en el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData([]);
      setIsOpen(false);
      return;
    }

    const filtered = data.filter(record => 
      
      record.holeid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.depth.toString().includes(searchTerm)
    );

    setFilteredData(filtered);
    setIsOpen(filtered.length > 0);
    setSelectedIndex(0);
  }, [searchTerm, data]);

  // Manejar selección con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredData.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredData.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredData.length - 1
        );
        break;
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        if (filteredData[selectedIndex]) {
          selectRecord(filteredData[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Seleccionar un registro
  const selectRecord = (record: DataRecord) => {
    setSelectedRecord(record);
    setSearchTerm(`${record.holeid}`);
    setIsOpen(false);
    onSelect(record);
  };

  // Manejar cambio en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedRecord(null);
    
    // Llamar la función onChange si está definida
    if (onChange) {
      onChange(e.target.value);
    }
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Input Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          < LuSearch className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (filteredData.length > 0){ setIsOpen(true);}else{setIsOpen(false)}
          }}
          placeholder={placeholder}
          className="w-0.5 focus:w-full pl-10 pr-10 py-2   rounded-4xl bg-gray-50 outline-none transition-all duration-500 text-sm"
        />
        
      </div>

      {/* Dropdown Results */}
      {isOpen && filteredData.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredData.map((record, index) => (
            <div
              key={`${record.id_collar}`}
              onClick={() => selectRecord(record)}
              className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                index === selectedIndex
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              } ${index !== filteredData.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    
                    <div className="text-sm text-gray-500">
                      {record.holeid}
                    </div>
                    <div className="text-sm text-gray-500">
                      {record.nombre_proyecto}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-blue-600">
                  {record.depth}m
                </div>
              </div>
            </div>
          ))}
          
          {/* Footer con información */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              {filteredData.length} resultado{filteredData.length !== 1 ? 's' : ''} encontrado{filteredData.length !== 1 ? 's' : ''}
              {filteredData.length > 0 && (
                <span className="ml-2">• Usa ↑↓ para navegar, Enter/Tab para seleccionar</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No results message */}
      {isOpen && searchTerm.trim() !== '' && filteredData.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="px-4 py-6 text-center">
            <div className="text-gray-500 text-sm">
              No se encontraron resultados para "{searchTerm}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
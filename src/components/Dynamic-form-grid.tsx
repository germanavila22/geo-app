//"use client"
import { useEffect } from "react";
import { useState } from "react"
import { BsXLg } from 'react-icons/bs';
import { BsCheckLg } from 'react-icons/bs';
import { BsPencil } from 'react-icons/bs';


/*map para poner el icono */
const iconMap: Record<string, React.ReactElement> = {
    BsXLg: <BsXLg size={20} color="red"/>,
    BsCheckLg: <BsCheckLg size={20} color= "blue" />,
    BsPencil: <BsPencil size={20} color="green"/>,
};

export type FieldType = "text" | "select" | "radiobutton" | "date"

export interface FieldOption {
  id_opcion: string | number
  descripcion: string
}

export interface FieldConfig {
  id: string
  label: string
  type: FieldType
  required: boolean
  options?: FieldOption[]
}

export interface RecordData {
  [fieldId: string]: string
}

export interface ActionConfig {
  nombreFuncion: string
  icono?: string
  texto: string
  texto_ayuda: string
  color: "primary" | "secondary" | "success" | "danger" | "warning"
}

export interface ActionFunctions {
  [nombreFuncion: string]: (record: RecordData) => void
}

interface DynamicFormGridProps {
  config: FieldConfig[]
  initialRecords: RecordData[]
  actions: ActionConfig[]
  actionFunctions: ActionFunctions // New prop to pass the actual functions
  onSave?: (records: RecordData[]) => void
}
function toInputDate(date: string) {
  return new Date(date).toISOString().split("T")[0];
}
export function DynamicFormGrid({ config, initialRecords, actions, actionFunctions}: DynamicFormGridProps) {
  const [records, setRecords] = useState<RecordData[]>(initialRecords)
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({})
  
  const handleChange = (rowIndex: number, fieldId: string, value: string) => {
    setRecords((prev) => {
      const newRecords = [...prev]
      newRecords[rowIndex] = { ...newRecords[rowIndex], [fieldId]: value }
      return newRecords
    })

    if (errors[rowIndex]?.[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        if (newErrors[rowIndex]) {
          delete newErrors[rowIndex][fieldId]
          if (Object.keys(newErrors[rowIndex]).length === 0) {
            delete newErrors[rowIndex]
          }
        }
        return newErrors
      })
    }
  }
useEffect(() => {
  setRecords(initialRecords)
}, [initialRecords])
/*
  const validateRow = (rowIndex: number): boolean => {
    const newErrors: Record<string, string> = {}
    const record = records[rowIndex]

    config.forEach((field) => {
      if (field.required) {
        const value = record[field.id]
        if (!value || value.trim() === "") {
          newErrors[field.id] = "Requerido"
        }
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, [rowIndex]: newErrors }))
      return false
    } else {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[rowIndex]
        return updated
      })
      return true
    }
  }

  const handleSaveRow = (rowIndex: number) => {
    if (validateRow(rowIndex)) {
      onSave?.([records[rowIndex]])
      alert(`Registro ${rowIndex + 1} guardado exitosamente`)
    }
  }

  const handleShowRowValues = (rowIndex: number) => {
    const record = records[rowIndex]
    const values = config.map((field) => `${field.label}: ${record[field.id] || "(vacío)"}`)
    alert(`Valores del Registro ${rowIndex + 1}:\n\n${values.join("\n")}`)
  }
*/
  const getColorClasses = (color: ActionConfig["color"]) => {
    const colorMap = {
      primary: "hover:bg-blue-300 ",
      secondary: "hover:bg-green-300 ",
      success: " text-bue-600 hover:bg-blue-700",
      danger: " hover:bg-red-300 ",
      warning: " hover:bg-yellow-300 ",
    }
    return colorMap[color]
  }

  const executeAction = (nombreFuncion: string, record: RecordData) => {
    const funcion = actionFunctions[nombreFuncion]
    if (funcion) {
      funcion(record)
    } else {
      console.error(`Función "${nombreFuncion}" no encontrada en actionFunctions`)
    }
  }

  const renderCell = (field: FieldConfig, rowIndex: number) => {
    const value = records[rowIndex][field.id] || ""
    const hasError = !!errors[rowIndex]?.[field.id]

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(rowIndex, field.id, e.target.value)}
            className={`w-full pt-1 pb-0.5 pl-2 text-xs border-1 border-gray-300 bg-white  ${
              hasError ? "border-red-500" : "border-input"
            }`}
            placeholder="..."
          />
        )

      case "date":
        return (
          <input
            type="date"
            value={toInputDate(value)}
            onChange={(e) => handleChange(rowIndex, field.id, e.target.value)}
            className={`w-full pt-1 pb-0.5 pl-2 text-xs border-1 border-gray-300 bg-white  ${
              hasError ? "border-red-500" : "border-input"
            }`}
            placeholder="..."
          />
        )

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleChange(rowIndex, field.id, e.target.value)}
            className={`w-full pt-1 pb-0.5 pl-2 text-xs border-1 border-gray-300 bg-white  ${
              hasError ? "border-red-500" : "border-input"
            }`}
          >
            <option value="">Seleccionar</option>
            {field.options?.map((option) => (
              <option key={option.id_opcion} value={option.id_opcion}>
                {option.descripcion}
              </option>
            ))}
          </select>
        )

      case "radiobutton":
        return (
          <div className="flex gap-3">
            {field.options?.map((option) => (
              <label key={option.id_opcion} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name={`${rowIndex}-${field.id}`}
                  value={option.id_opcion}
                  checked={value === String(option.id_opcion)}
                  onChange={(e) => handleChange(rowIndex, field.id, e.target.value)}
                  className="w-4 h-4 text-primary border-input focus:ring-2 focus:ring-ring"
                />
                <span className="text-sm">{option.descripcion}</span>
              </label>
            ))}
          </div>
        )

      default:
        return null
    }
  }
  //const iconElement: React.ReactElement = iconMap[actions.icon] ??<LuGlobe size={25} />; // Ícono por defecto
  return (
    <div className="w-full border-l border-r  border-gray-400  bg-card shadow-sm p-1">
      
      <div className="">
        <div className="flex items-center justify-center">
          
          <table className="w-11/12 border-collapse ">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground w-20">#</th>
                {config.map((field) => (
                  <th
                    key={field.id}
                    className="px-4 py-3 text-left text-sm font-semibold text-foreground min-w-[50px]"
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground min-w-[50px]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              
          
              {records.map((record, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-300 hover:bg-gray-200">
                  <td className="pl-2 text-sm text-muted-foreground font-medium">{rowIndex + 1}</td>
                  {config.map((field) => (
                    <td key={field.id} className="p-2">
                      {renderCell(field, rowIndex)}
                      {errors[rowIndex]?.[field.id] && (
                        <p className="text-xs text-red-500 mt-1">{errors[rowIndex][field.id]}</p>
                      )}
                    </td>
                  ))}
                  <td className="">
                    <div className="flex gap-2 flex-wrap">
                      {actions.map((action, actionIndex) => (
                        <div key={actionIndex} className="relative group">
                          <button
                            onClick={() => executeAction(action.nombreFuncion, records[rowIndex])}
                            className={`p-2 text-sm font-medium rounded-md transition-colors flex items-center  ${getColorClasses(
                              action.color,
                            )}`}
                          >
                            {action.icono && <span>{iconMap[action.icono]}</span>}
                            <span>{action.texto}</span>
                          </button>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-10">
                            {action.texto_ayuda}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
